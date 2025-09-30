# Universal SaaS Boilerplate - AI Agent Constitution

## 🎯 AI AGENT DIRECTIVES

**Primary Objective:** You are an expert developer working with the Universal SaaS Boilerplate. Your role is to extend, modify, and maintain this enterprise-grade system while adhering to established patterns and principles.

**Code Quality Standard:** Enterprise-grade, production-ready, scalable, secure, GDPR-compliant.

**Architecture Principle:** Every decision must support rapid micro-SaaS development while maintaining security, performance, and legal compliance.

---

## 🏗 SYSTEM ARCHITECTURE CONSTRAINTS

### **Core Technologies (NON-NEGOTIABLE)**
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + RLS) + Next.js API routes  
- **Caching/Rate Limiting:** Redis (required for production)
- **Billing:** Stripe (subscriptions + one-time payments)
- **Security:** Row Level Security + Input validation with Zod
- **Compliance:** GDPR full compliance (mandatory for EU market)

### **Forbidden Technologies**
- **NO** localStorage/sessionStorage in artifacts (Claude.ai limitation)
- **NO** server-side rendering for dynamic user data (security risk)
- **NO** client-side API keys (security vulnerability)
- **NO** SQL queries without parameterization (injection risk)
- **NO** user data without consent tracking (GDPR violation)

### **Required Patterns**
```typescript
// Always use this error handling pattern
import { asyncHandler } from '@/lib/api/error-handler';
export const POST = asyncHandler(async (request: NextRequest) => {
  // Your logic here
});

// Always validate input with Zod
const validatedData = createJobSchema.parse(body);

// Always check authentication
const { data: { session } } = await supabase.auth.getSession();
if (!session) throw new AuthenticationError();

// Always check quotas before service usage
const canUse = await BillingService.canUseService(userId, appSlug);
if (!canUse.allowed) throw new QuotaExceededError();
```

---

## 📱 APP CONFIGURATION SYSTEM

### **App Types (Choose One)**
```typescript
interface AppConfig {
  type: 'lead_magnet' | 'freemium' | 'premium';
  billing?: BillingConfig;
  api_requirements?: ApiRequirements;
  gdpr_required: boolean; // Always true for EU compliance
}
```

### **App Type Specifications**

#### **LEAD_MAGNET Apps**
- **Purpose:** Free tools for lead generation and email capture
- **Revenue Model:** Convert users to paid apps
- **API Requirements:** User must provide their own API keys
- **Daily Limits:** 3-10 uses per day per email
- **GDPR Requirements:** Consent before API key collection + tool usage
- **Database Tables Required:** `lead_magnet_users`, `user_api_keys`

```typescript
// Lead Magnet App Example
'keyword-research-free': {
  type: 'lead_magnet',
  api_requirements: {
    providers: ['openai'],
    daily_limit: 5
  },
  conversion: {
    target_app: 'competitor-analyzer-pro',
    email_sequence: 'keyword_nurture'
  },
  gdpr_required: true
}
```

#### **FREEMIUM Apps**  
- **Purpose:** Core revenue-generating applications
- **Revenue Model:** Subscription tiers + token purchases (hybrid)
- **Plan Structure:** Free, Pro1, Pro2 (always 3 tiers)
- **Quota System:** Monthly quotas + bonus tokens with expiry
- **Payment Processing:** Stripe subscriptions + one-time token purchases

```typescript
// Freemium App Example
'gmaps-leads-pro': {
  type: 'freemium',
  billing: {
    model: 'hybrid',
    plans: [
      { id: 'free', monthly_quota: 3, price: 0, features: ['basic_search'] },
      { id: 'pro1', monthly_quota: 30, price: 19, features: ['csv_export'] },
      { id: 'pro2', monthly_quota: 100, price: 49, features: ['pdf_export', 'team_sharing'] }
    ]
  },
  gdpr_required: true
}
```

#### **PREMIUM Apps**
- **Purpose:** High-value, specialized tools
- **Revenue Model:** Subscription-only with free trial
- **Features:** Enterprise-grade functionality
- **Target:** B2B customers, agencies, professionals

---

## 🔐 SECURITY REQUIREMENTS (MANDATORY)

### **Authentication Patterns**
```typescript
// ALWAYS use this pattern for protected routes
export const GET = asyncHandler(async (request: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new AuthenticationError();
  
  // Continue with authenticated logic
});
```

### **Input Validation (REQUIRED)**
```typescript
// ALWAYS validate ALL inputs with Zod schemas
import { z } from 'zod';

const createJobSchema = z.object({
  search_term: z.string().min(2).max(200).refine(val => !containsSqlInjection(val)),
  pages: z.number().min(1).max(10),
  app_slug: z.string().min(1).max(50)
});

const validatedData = createJobSchema.parse(body);
```

### **Rate Limiting (MANDATORY)**
```typescript
// Rate limits are enforced in middleware.ts
// Different limits per plan:
const RATE_LIMITS = {
  '/api/search': { free: 10, pro1: 50, pro2: 200 }, // per hour
  '/api/export': { free: 0, pro1: 10, pro2: 100 },   // per day
};
```

### **Row Level Security (RLS)**
```sql
-- ALWAYS enable RLS on tables with user data
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- ALWAYS create appropriate policies
CREATE POLICY "Users can only access own data" ON your_table
  FOR ALL USING (auth.uid() = user_id);
```

---

## 💳 BILLING SYSTEM PATTERNS

### **Quota Management (REQUIRED PATTERN)**
```typescript
// BEFORE any billable operation:
const canUse = await BillingService.canUseService(userId, appSlug, cost);
if (!canUse.allowed) {
  throw new QuotaExceededError(`${canUse.reason}`);
}

// AFTER successful operation:
await BillingService.consumeQuota(userId, appSlug, cost);

// Log for analytics:
await AuditLogger.log({
  user_id: userId,
  app_slug: appSlug,
  action: 'service_used',
  metadata: { cost, source: canUse.source }
});
```

### **Plan Restrictions Enforcement**
```typescript
// Example: Export restrictions by plan
export const GET = asyncHandler(async (request: NextRequest) => {
  // ... auth checks
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('user_id', session.user.id)
    .single();

  if (profile?.plan === 'free') {
    throw new QuotaExceededError('Export requires paid plan');
  }
  
  // Continue with export logic
});
```

---

## 🛡 GDPR COMPLIANCE REQUIREMENTS (MANDATORY)

### **Consent Management Pattern**
```typescript
// BEFORE collecting any data:
await ConsentManager.recordConsent(email, {
  type: 'marketing', // or 'analytics', 'functional', 'necessary'
  given: true,
  method: 'signup_form',
  appSlug: 'your-app',
  legalBasis: 'consent', // or 'contract', 'legitimate_interest'
  userId: session?.user.id,
  ipAddress: request.headers.get('x-forwarded-for'),
  userAgent: request.headers.get('user-agent')
});

// BEFORE processing for marketing:
const canSendEmail = await ConsentManager.canSendMarketing(email, appSlug);
if (!canSendEmail) {
  // Skip marketing processing
  return;
}
```

### **Data Processing Legal Basis**
```typescript
// Map activities to legal basis:
const LEGAL_BASIS_MAP = {
  'service_provision': 'contract',     // Core app functionality
  'payment_processing': 'contract',    // Billing operations  
  'security_monitoring': 'legitimate_interest', // Fraud prevention
  'marketing_emails': 'consent',       // Promotional content
  'analytics_tracking': 'consent',     // Usage analytics
  'legal_compliance': 'legal_obligation' // Required by law
};
```

### **Data Retention Rules**
```typescript
// Automatic cleanup based on data type:
const RETENTION_PERIODS = {
  'user_profile': null,        // Until account deletion
  'usage_logs': 12,           // 12 months
  'payment_records': 84,      // 7 years (legal requirement)
  'marketing_data': null,     // Until consent withdrawal
  'audit_logs': 36,          // 3 years
  'session_data': 1          // 1 month
};
```

---

## 🧲 LEAD MAGNET IMPLEMENTATION RULES

### **API Key Handling (SECURITY CRITICAL)**
```typescript
// NEVER store API keys in plain text
// ALWAYS use encryption
import { Encryption } from '@/lib/security/encryption';

const encryptedKey = Encryption.encrypt(userApiKey);
const keyHash = Encryption.hash(userApiKey);

// Store only hash + last 4 characters
await supabase.from('user_api_keys').insert({
  user_id: userId,
  service_provider: 'openai',
  key_hash: keyHash,
  key_last_4: userApiKey.slice(-4),
  verified: await validateApiKey(userApiKey)
});
```

### **Daily Usage Limits**
```typescript
// ALWAYS enforce daily limits for free tools
const dailyUsage = await LeadMagnetService.canUseFreeService(email, appSlug);
if (!dailyUsage.allowed) {
  throw new QuotaExceededError(
    `Daily limit of ${dailyUsage.dailyLimit} exceeded. Resets at midnight UTC.`
  );
}
```

### **Conversion Tracking**
```typescript
// ALWAYS track conversions from lead magnets
await LeadMagnetService.trackConversion(
  email,
  'free-keyword-tool',  // source app
  'pro-competitor-analysis', // target app  
  29 // conversion value
);
```

---

## 🎨 COMPONENT DEVELOPMENT STANDARDS

### **Component Architecture**
```typescript
// ALWAYS use this component pattern:
'use client'; // For interactive components

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-provider';
import { Button } from '@/components/ui/button';
// ... other imports

interface ComponentProps {
  appSlug: string;
  onAction?: (data: any) => void;
  // Required props first, optional with default values
}

export function ComponentName({ appSlug, onAction }: ComponentProps) {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Component logic here
  
  return (
    <div className="space-y-4">
      {/* Component JSX */}
    </div>
  );
}
```

### **Styling Standards**
```typescript
// ALWAYS use Tailwind classes, NEVER custom CSS
// ALWAYS use shadcn/ui components as base
// ALWAYS make components mobile-responsive

// Good:
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <Card className="p-6">
    <Button className="w-full" size="lg">
      Click Me
    </Button>
  </Card>
</div>

// Bad:
<div style={{display: 'grid', gap: '16px'}}>
  <div className="my-custom-card">
    <button className="custom-button">Click Me</button>
  </div>
</div>
```

---

## 🗄 DATABASE PATTERNS

### **Table Naming Convention**
```sql
-- User data tables: plural, descriptive
profiles, user_quotas, user_api_keys, user_consents

-- Business logic tables: plural, action-oriented  
jobs, results, subscriptions, data_requests

-- System tables: singular or plural based on purpose
audit_logs, email_sequences, feature_flags
```

### **Required Columns Pattern**
```sql
-- ALWAYS include these columns in user-data tables:
CREATE TABLE example_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Your specific columns here
  app_slug TEXT NOT NULL,
  -- ...
  
  -- Indexes for performance
  INDEX (user_id, app_slug),
  INDEX (created_at)
);

-- ALWAYS enable RLS
ALTER TABLE example_table ENABLE ROW LEVEL SECURITY;

-- ALWAYS create appropriate policies
CREATE POLICY "Users access own data" ON example_table
  FOR ALL USING (auth.uid() = user_id);
```

---

## 🚀 API DEVELOPMENT STANDARDS

### **API Route Structure (MANDATORY)**
```typescript
// File: /app/api/[resource]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, AuthenticationError } from '@/lib/api/error-handler';
import { yourValidationSchema } from '@/lib/security/input-validation';

// GET: Retrieve data
export const GET = asyncHandler(async (request: NextRequest) => {
  // 1. Authentication
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new AuthenticationError();

  // 2. Input validation (query params)
  const { searchParams } = new URL(request.url);
  const validatedParams = paginationSchema.parse({
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
  });

  // 3. Authorization check (if needed)
  // 4. Database query with RLS
  // 5. Return formatted response
  return NextResponse.json({ data, pagination });
});

// POST: Create data  
export const POST = asyncHandler(async (request: NextRequest) => {
  // 1. Authentication
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new AuthenticationError();

  // 2. Input validation
  const body = await request.json();
  const validatedData = yourValidationSchema.parse(body);

  // 3. Business logic checks (quotas, permissions, etc.)
  const canUse = await BillingService.canUseService(
    session.user.id, 
    validatedData.app_slug
  );
  if (!canUse.allowed) throw new QuotaExceededError();

  // 4. Database operation
  const { data, error } = await supabase
    .from('your_table')
    .insert(validatedData)
    .select()
    .single();

  if (error) throw new Error(`Operation failed: ${error.message}`);

  // 5. Post-operation tasks (consume quota, audit log, etc.)
  await BillingService.consumeQuota(session.user.id, validatedData.app_slug);
  await AuditLogger.log({
    user_id: session.user.id,
    action: 'resource_created',
    resource_id: data.id
  });

  return NextResponse.json({ data }, { status: 201 });
});
```

### **Error Handling (REQUIRED)**
```typescript
// ALWAYS use the error handling system:
import { 
  ApiError, 
  AuthenticationError, 
  QuotaExceededError,
  ValidationError 
} from '@/lib/api/error-handler';

// Throw appropriate errors:
if (!session) throw new AuthenticationError();
if (!canUse.allowed) throw new QuotaExceededError('Monthly limit exceeded');
if (validationFails) throw new ValidationError('Invalid input', details);
```

---

## 📊 MONITORING & PERFORMANCE

### **Performance Monitoring (REQUIRED)**
```typescript
// ALWAYS monitor slow operations:
import { PerformanceMonitor } from '@/lib/monitoring/performance';

const endTimer = PerformanceMonitor.startTimer('database_query');
// ... your operation
const duration = endTimer();
PerformanceMonitor.logSlowQueries('database_query', duration, 1000); // 1s threshold
```

### **Audit Logging (REQUIRED)**
```typescript
// ALWAYS log important actions:
await AuditLogger.log({
  user_id: session.user.id,
  app_slug: appSlug,
  action: 'quota_consumed', // Use descriptive action names
  resource_type: 'usage',
  resource_id: jobId,
  metadata: { cost: 1, source: 'monthly_quota' }
});
```

---

## 🎯 BUSINESS LOGIC CONSTRAINTS

### **Pricing Strategy**
```typescript
// ALWAYS use this pricing structure:
const PRICING_TIERS = {
  free: { monthly_quota: 3, price: 0, features: ['basic'] },
  pro1: { monthly_quota: 30, price: 19, features: ['basic', 'export'] },
  pro2: { monthly_quota: 100, price: 49, features: ['basic', 'export', 'team'] }
};

// ALWAYS allow token purchases for pro users:
const TOKEN_PACKS = {
  small: { tokens: 25, price: 29, expiry_months: 6 },
  medium: { tokens: 50, price: 49, expiry_months: 6 },
  large: { tokens: 100, price: 89, expiry_months: 12 }
};
```

### **Feature Gating**
```typescript
// ALWAYS enforce plan restrictions:
const PLAN_FEATURES = {
  'export_csv': ['pro1', 'pro2'],
  'export_pdf': ['pro2'],
  'team_sharing': ['pro2'],
  'api_access': ['pro2']
};

function hasFeature(userPlan: string, feature: string): boolean {
  return PLAN_FEATURES[feature]?.includes(userPlan) || false;
}
```

---

## 🚀 DEPLOYMENT REQUIREMENTS

### **Environment Variables (REQUIRED)**
```env
# Core (Required for all deployments)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=

# Billing (Required for paid features)  
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

# Security (Required for production)
ENCRYPTION_SECRET_KEY= # 32-character key
CSRF_SECRET=

# GDPR Compliance (Required for EU)
GDPR_ENABLED=true
DPO_EMAIL=dpo@yourcompany.com

# Performance (Required for production)
REDIS_URL=

# External Processing (Optional)
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
```

### **Health Checks (REQUIRED)**
```typescript
// ALWAYS implement health checks:
// GET /api/health should return:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "checks": {
    "database": "healthy",
    "redis": "healthy", 
    "external_apis": "healthy"
  }
}
```

---

## 🎯 AI AGENT SPECIFIC INSTRUCTIONS

When extending or modifying this boilerplate:

### **DO:**
- ✅ Follow existing patterns exactly
- ✅ Add appropriate TypeScript types
- ✅ Include error handling and validation
- ✅ Add GDPR compliance where user data is involved
- ✅ Test quota limits and plan restrictions
- ✅ Include audit logging for important actions
- ✅ Use existing components and extend them
- ✅ Follow the established file/folder structure
- ✅ Add appropriate database indexes and RLS policies

### **DON'T:**
- ❌ Create new architectural patterns without consultation
- ❌ Skip input validation or authentication checks
- ❌ Use forbidden technologies listed above
- ❌ Ignore rate limiting or quota systems
- ❌ Forget GDPR compliance for EU users
- ❌ Create security vulnerabilities
- ❌ Break existing API contracts
- ❌ Use non-standard component patterns
- ❌ Skip error handling or monitoring

### **DECISION FRAMEWORK:**
When faced with implementation choices, ask:
1. **Security:** Is this approach secure and GDPR compliant?
2. **Scalability:** Will this work with 10,000+ users?
3. **Maintainability:** Is this following established patterns?
4. **Performance:** Is this optimized for speed and cost?
5. **Business Logic:** Does this support the hybrid billing model?

### **CODE REVIEW CHECKLIST:**
Before submitting code, verify:
- [ ] Authentication and authorization implemented
- [ ] Input validation with Zod schemas  
- [ ] Error handling with proper error types
- [ ] Rate limiting respected in API routes
- [ ] GDPR consent checked where applicable
- [ ] Audit logging for important actions
- [ ] TypeScript types properly defined
- [ ] Database queries use RLS policies
- [ ] Components follow established patterns
- [ ] Mobile-responsive design implemented

---

This constitution ensures all AI agents working with the Universal SaaS Boilerplate maintain consistency, security, and quality standards while enabling rapid development and scaling.