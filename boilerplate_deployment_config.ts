// ====================================
// PRODUCTION DEPLOYMENT & CONFIGURATION
// Complete Setup for Production Environment
// ====================================

// /next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Universal SaaS',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.CORS_ORIGIN || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/healthz',
        destination: '/api/health',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

// /.env.example
# ===================================
# UNIVERSAL SAAS BOILERPLATE ENV VARS
# ===================================

# App Configuration
NEXT_PUBLIC_APP_NAME="Universal SaaS"
NEXT_PUBLIC_APP_URL="https://yourapp.com"
NODE_ENV="production"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Redis (for rate limiting and caching)
REDIS_URL="redis://localhost:6379"

# Stripe (for billing)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Security
ENCRYPTION_SECRET_KEY="your-32-character-encryption-key"
CSRF_SECRET="your-csrf-secret-key"
JWT_SECRET="your-jwt-secret-key"
API_KEY_SALT="your-api-key-salt"

# External Services
N8N_WEBHOOK_URL="https://your-n8n.com/webhook/job-processing"
N8N_WEBHOOK_SECRET="your-n8n-webhook-secret"

# Email Service (choose one)
SENDGRID_API_KEY="SG.xxx"
MAILGUN_API_KEY="key-xxx"
MAILGUN_DOMAIN="mg.yourapp.com"

# Analytics & Monitoring
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
SENTRY_DSN="https://xxx@sentry.io/xxx"

# CORS
CORS_ORIGIN="https://yourapp.com"

# /docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.local
    depends_on:
      - redis
      - postgres
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: universal_saas
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:

# /Dockerfile
# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# /nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;
    
    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/ssl/certs/cert.pem;
        ssl_certificate_key /etc/ssl/certs/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        # Static files
        location /_next/static/ {
            alias /app/.next/static/;
            expires 365d;
            add_header Cache-Control "public, immutable";
        }

        # API routes with rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Auth routes with stricter rate limiting
        location /api/auth/ {
            limit_req zone=auth burst=10 nodelay;
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # All other requests
        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check
        location /healthz {
            access_log off;
            proxy_pass http://app;
        }
    }
}

# /scripts/deploy.sh
#!/bin/bash

# Production deployment script
set -e

echo "🚀 Starting production deployment..."

# Build and push Docker image
echo "📦 Building Docker image..."
docker build -t universal-saas:latest .
docker tag universal-saas:latest your-registry/universal-saas:latest
docker push your-registry/universal-saas:latest

# Update environment variables
echo "⚙️  Updating environment variables..."
# Load from secure vault (AWS Secrets Manager, HashiCorp Vault, etc.)

# Database migrations
echo "🗄️  Running database migrations..."
npm run migrate:prod

# Deploy with zero downtime
echo "🔄 Deploying with zero downtime..."
docker-compose -f docker-compose.prod.yml up -d --scale app=2
sleep 30
docker-compose -f docker-compose.prod.yml up -d --scale app=1

# Health check
echo "🏥 Performing health check..."
curl -f http://localhost/healthz || exit 1

# Cleanup old images
echo "🧹 Cleaning up..."
docker system prune -f

echo "✅ Deployment completed successfully!"

# /scripts/migrate.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigrations() {
  console.log('🗄️  Running database migrations...');

  try {
    // Check if migrations table exists
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'migrations');

    if (!tables || tables.length === 0) {
      // Create migrations table
      await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE migrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });
    }

    // Run pending migrations
    const migrations = [
      '001_initial_schema.sql',
      '002_add_indexes.sql',
      '003_update_rls_policies.sql'
    ];

    for (const migration of migrations) {
      const { data: executed } = await supabase
        .from('migrations')
        .select('id')
        .eq('name', migration);

      if (!executed || executed.length === 0) {
        console.log(`Running migration: ${migration}`);
        
        // Execute migration SQL
        const fs = require('fs');
        const migrationSQL = fs.readFileSync(`./migrations/${migration}`, 'utf8');
        
        await supabase.rpc('execute_sql', { sql: migrationSQL });
        
        // Mark as executed
        await supabase
          .from('migrations')
          .insert({ name: migration });
          
        console.log(`✅ Migration ${migration} completed`);
      }
    }

    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };

# /app/api/health/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown',
      redis: 'unknown',
      external_apis: 'unknown'
    }
  };

  try {
    // Check database connection
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    health.checks.database = error ? 'unhealthy' : 'healthy';

    // Check Redis connection
    if (process.env.REDIS_URL) {
      const Redis = require('ioredis');
      const redis = new Redis(process.env.REDIS_URL);
      
      try {
        await redis.ping();
        health.checks.redis = 'healthy';
      } catch (redisError) {
        health.checks.redis = 'unhealthy';
      } finally {
        redis.disconnect();
      }
    }

    // Check external API (example: n8n webhook)
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        const response = await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'HEAD',
          timeout: 5000
        });
        health.checks.external_apis = response.ok ? 'healthy' : 'degraded';
      } catch {
        health.checks.external_apis = 'unhealthy';
      }
    }

    // Overall health status
    const allHealthy = Object.values(health.checks).every(status => status === 'healthy');
    health.status = allHealthy ? 'healthy' : 'degraded';

    return NextResponse.json(health, { 
      status: allHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      ...health,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}

# /lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  if (process.env.SENTRY_DSN && process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
      environment: process.env.NODE_ENV,
      beforeSend(event, hint) {
        // Filter out sensitive data
        if (event.request?.data) {
          delete event.request.data.password;
          delete event.request.data.api_key;
        }
        return event;
      },
    });
  }
}

export function captureException(error: Error, context?: any) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('Error captured:', error, context);
  }
}

# /package.json
{
  "name": "universal-saas-boilerplate",
  "version": "1.0.0",
  "description": "Enterprise-grade SaaS boilerplate for rapid development",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "migrate": "node scripts/migrate.js",
    "migrate:prod": "NODE_ENV=production node scripts/migrate.js",
    "setup": "node scripts/setup.js",
    "docker:build": "docker build -t universal-saas .",
    "docker:run": "docker-compose up -d",
    "docker:stop": "docker-compose down",
    "deploy": "bash scripts/deploy.sh"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "@sentry/nextjs": "^7.118.0",
    "@stripe/stripe-js": "^2.1.11",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "@supabase/supabase-js": "^2.38.4",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.10",
    "@types/node": "20.9.0",
    "@types/react": "18.2.37",
    "@types/react-dom": "18.2.15",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "framer-motion": "^10.16.5",
    "ioredis": "^5.3.2",
    "isomorphic-dompurify": "^2.6.0",
    "lucide-react": "^0.292.0",
    "next": "14.0.3",
    "next-themes": "^0.2.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-hook-form": "^7.47.0",
    "recharts": "^2.8.0",
    "stripe": "^14.5.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "5.2.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@types/jest": "^29.5.8",
    "autoprefixer": "10.4.16",
    "eslint": "8.53.0",
    "eslint-config-next": "14.0.3",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "postcss": "8.4.31",
    "tailwindcss": "3.3.5"
  }
}

# /tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "slide-in": {
          from: { transform: "translateY(10px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}

# /app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }

  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .animate-in {
    @apply animate-fade-in;
  }
  
  .slide-in {
    @apply animate-slide-in;
  }
}

# /README.md
# Universal SaaS Boilerplate

Enterprise-grade, production-ready SaaS boilerplate for rapid micro-SaaS development.

## 🚀 Features

### Core Architecture
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** for styling
- **Supabase** for database and auth
- **Redis** for caching and rate limiting

### Authentication & Security
- Multi-provider auth (email, OAuth)
- Row Level Security (RLS)
- Rate limiting per plan
- Input validation & sanitization
- CSRF protection
- Audit logging

### Billing & Plans
- **Hybrid model**: Subscriptions + token purchases
- **Multiple tiers**: Free, Pro1, Pro2, Enterprise
- **Stripe integration** for payments
- **Usage tracking** and quotas
- **Plan restrictions** enforcement

### Lead Magnet System
- **Free tools** for lead generation
- **API key management** for user tools
- **Email capture** and nurturing
- **Conversion tracking** across apps
- **UTM parameter tracking**

### Mobile & Performance
- **Responsive design** for all screen sizes
- **Performance monitoring** and optimization
- **Health checks** and monitoring
- **Docker** ready with multi-stage builds

## 🏗 Architecture

```
/app
├── /api                 # Next.js API routes
├── /auth               # Authentication pages
├── /dashboard          # Main app dashboard
└── /globals.css        # Global styles

/components
├── /ui                 # shadcn/ui components
├── /auth               # Auth forms & flows
├── /billing            # Plan selection, usage
├── /lead-magnet        # Free tool components
└── /layout             # Navigation, headers

/lib
├── /auth               # Auth provider & helpers
├── /billing            # Billing service & logic
├── /security           # Validation, encryption
├── /monitoring         # Performance & health
└── /supabase           # Database client

/config
├── apps.config.ts      # App-specific settings
└── database/           # Schema & migrations
```

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/universal-saas-boilerplate.git
cd universal-saas-boilerplate
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Fill in your environment variables
```

### 3. Database Setup
```bash
# Run migrations
npm run migrate

# Or use Docker
docker-compose up -d postgres redis
```

### 4. Development
```bash
npm run dev
```

### 5. Production Deployment
```bash
# Build and deploy
npm run deploy
```

## 🔧 Configuration

### App Configuration
Edit `/config/apps.config.ts` to define your apps:

```typescript
export const APPS_CONFIG = {
  'your-app-slug': {
    type: APP_TYPES.FREEMIUM,
    billing: {
      model: 'hybrid',
      plans: [
        { id: 'free', monthly_quota: 10, price: 0 },
        { id: 'pro', monthly_quota: 100, price: 29 }
      ]
    }
  }
};
```

### Database Schema
The boilerplate includes:
- **profiles** - User profiles and plans
- **user_quotas** - Usage tracking per app
- **jobs** - Background job tracking
- **results** - Job results storage
- **lead_magnet_users** - Lead generation tracking
- **audit_logs** - Security and usage logging

## 🏢 Business Models Supported

### 1. Lead Magnet Apps
- Free tools requiring user's API key
- Email capture for nurturing
- Daily usage limits
- Conversion tracking to paid apps

### 2. Freemium Apps
- Free tier with limited features
- Multiple paid tiers
- Usage-based quotas
- Token purchase system

### 3. Premium Apps
- Paid-only with free trial
- Enterprise features
- Team collaboration
- Advanced analytics

## 🔒 Security Features

- **Input validation** with Zod schemas
- **Rate limiting** per user plan
- **SQL injection** prevention
- **XSS protection** with DOMPurify
- **API key encryption** for user keys
- **CSRF tokens** for forms
- **Audit logging** for all actions

## 📊 Monitoring & Analytics

- **Performance monitoring** for slow queries
- **Health checks** for all services
- **Error tracking** with Sentry
- **Usage analytics** per user/app
- **Conversion tracking** across funnel

## 🚀 Deployment Options

### Docker (Recommended)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
```bash
npm run build
npm start
```

### Cloud Platforms
- **Vercel** (easiest for Next.js)
- **Railway** (full-stack with databases)
- **AWS ECS** (enterprise scale)
- **Google Cloud Run** (serverless containers)

## 📝 Usage Examples

### Creating a New Lead Magnet App
1. Add configuration to `apps.config.ts`
2. Use `<ApiKeyInput />` component
3. Implement app-specific logic
4. Track usage with `LeadMagnetService`

### Adding a Freemium App
1. Configure plans in `apps.config.ts`
2. Use `<PlanSelector />` for upgrades
3. Implement quota checks in API routes
4. Use `<UsageDisplay />` for user feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use for commercial projects.

## 🆘 Support

- Documentation: [docs.your-domain.com]
- Issues: [GitHub Issues]
- Email: support@your-domain.com

---

**Built for makers who want to ship fast without compromising on quality.**