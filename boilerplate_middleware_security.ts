// ====================================
// SECURITY & MIDDLEWARE LAYER
// Enterprise-Grade Protection & Rate Limiting
// ====================================

// /middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

// Rate limiting configuration per plan
const RATE_LIMITS = {
  '/api/search': { free: 10, pro1: 50, pro2: 200 }, // per hour
  '/api/export': { free: 0, pro1: 10, pro2: 100 }, // per day
  '/api/analyze': { free: 5, pro1: 30, pro2: 150 }, // per hour
  '/api/upload': { free: 2, pro1: 20, pro2: 100 }, // per hour
} as const;

// Protected routes requiring authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/api/user',
  '/api/billing',
  '/api/export',
  '/profile',
  '/settings'
];

// API routes requiring rate limiting
const RATE_LIMITED_ROUTES = Object.keys(RATE_LIMITS);

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // Handle authentication for protected routes
  if (PROTECTED_ROUTES.some(route => path.startsWith(route))) {
    if (!session) {
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle rate limiting for API routes
  if (RATE_LIMITED_ROUTES.some(route => path.startsWith(route))) {
    const rateLimitResult = await checkRateLimit(req, session);
    
    if (!rateLimitResult.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitResult.retryAfter,
          upgradeMessage: rateLimitResult.upgradeMessage
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': rateLimitResult.retryAfter.toString()
          }
        }
      );
    }

    // Add rate limit headers to successful responses
    res.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    res.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    res.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
  }

  // Security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return res;
}

async function checkRateLimit(req: NextRequest, session: any) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const userId = session?.user?.id;
  const path = req.nextUrl.pathname;
  
  // Determine user plan (default to free for unauthenticated users)
  let userPlan = 'free';
  
  if (userId) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('user_id', userId)
        .single();
        
      userPlan = profile?.plan || 'free';
    } catch (error) {
      console.error('Error fetching user plan:', error);
    }
  }

  // Get rate limit for this endpoint and plan
  const limitConfig = RATE_LIMITS[path as keyof typeof RATE_LIMITS];
  if (!limitConfig) {
    return { allowed: true, limit: 0, remaining: 0, resetTime: 0, retryAfter: 0 };
  }

  const limit = limitConfig[userPlan as keyof typeof limitConfig] || limitConfig.free;
  
  // Create rate limit key
  const identifier = userId || ip;
  const timeWindow = path.includes('export') ? 'day' : 'hour';
  const windowSeconds = timeWindow === 'day' ? 86400 : 3600;
  const windowStart = Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds;
  
  const key = `rate_limit:${path}:${identifier}:${windowStart}`;
  
  // Check current usage
  const current = await redis.get(key);
  const usage = current ? parseInt(current) : 0;
  
  if (usage >= limit) {
    const resetTime = windowStart + windowSeconds;
    const retryAfter = resetTime - Math.floor(Date.now() / 1000);
    
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetTime,
      retryAfter,
      upgradeMessage: userPlan === 'free' 
        ? 'Upgrade to Pro for higher rate limits'
        : 'Consider upgrading your plan for increased limits'
    };
  }

  // Increment usage
  await redis.incr(key);
  await redis.expire(key, windowSeconds);

  return {
    allowed: true,
    limit,
    remaining: limit - usage - 1,
    resetTime: windowStart + windowSeconds,
    retryAfter: 0
  };
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/profile/:path*',
    '/settings/:path*'
  ]
};

// /lib/security/input-validation.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Common validation schemas
export const emailSchema = z.string().email().min(3).max(254);

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number');

export const searchTermSchema = z.string()
  .min(2, 'Search term must be at least 2 characters')
  .max(200, 'Search term must be less than 200 characters')
  .refine((val) => !containsSqlInjection(val), 'Invalid search term');

export const urlSchema = z.string().url().max(2048);

export const paginationSchema = z.object({
  page: z.number().min(1).max(1000).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export const apiKeySchema = z.string()
  .min(10, 'API key too short')
  .max(512, 'API key too long')
  .refine((val) => !val.includes(' '), 'API key cannot contain spaces');

// XSS Protection
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>'"]/g, '') // Remove potential XSS chars
    .slice(0, 1000); // Limit length
}

// SQL Injection Detection
function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\s|^)(union|select|insert|update|delete|drop|create|alter|exec|execute)\s/i,
    /(\s|^)(or|and)\s+\d+\s*=\s*\d+/i,
    /['";](\s)*(union|select|insert|update|delete)/i,
    /(script|javascript|vbscript|onload|onerror)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

// App-specific validation schemas
export const createJobSchema = z.object({
  search_term: searchTermSchema,
  search_url: urlSchema.optional(),
  pages: z.number().min(1).max(10).default(1),
  app_slug: z.string().min(1).max(50)
});

export const leadMagnetSchema = z.object({
  email: emailSchema,
  app_slug: z.string().min(1).max(50),
  api_key: apiKeySchema,
  utm_source: z.string().max(50).optional(),
  utm_medium: z.string().max(50).optional(),
  utm_campaign: z.string().max(50).optional()
});

export const exportRequestSchema = z.object({
  job_id: z.string().uuid(),
  format: z.enum(['csv', 'pdf', 'json']),
  filters: z.record(z.any()).optional()
});

// Validation middleware for API routes
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors
        });
      }
      next(error);
    }
  };
}

// /lib/security/audit-logger.ts
import { supabase } from '@/lib/supabase/client';

export interface AuditLogEntry {
  user_id?: string;
  app_slug?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export class AuditLogger {
  static async log(entry: AuditLogEntry) {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          ...entry,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Audit log error:', error);
      }
    } catch (error) {
      console.error('Audit logging failed:', error);
    }
  }

  // Convenience methods for common actions
  static async logLogin(userId: string, ip?: string, userAgent?: string) {
    await this.log({
      user_id: userId,
      action: 'user_login',
      resource_type: 'authentication',
      ip_address: ip,
      user_agent: userAgent
    });
  }

  static async logApiKeyCreated(userId: string, serviceProvider: string, ip?: string) {
    await this.log({
      user_id: userId,
      action: 'api_key_created',
      resource_type: 'api_key',
      resource_id: serviceProvider,
      ip_address: ip
    });
  }

  static async logQuotaExceeded(userId: string, appSlug: string, currentUsage: number) {
    await this.log({
      user_id: userId,
      app_slug: appSlug,
      action: 'quota_exceeded',
      resource_type: 'usage',
      metadata: { current_usage: currentUsage }
    });
  }

  static async logDataExport(userId: string, appSlug: string, format: string, recordCount: number) {
    await this.log({
      user_id: userId,
      app_slug: appSlug,
      action: 'data_export',
      resource_type: 'export',
      metadata: { format, record_count: recordCount }
    });
  }

  static async logSuspiciousActivity(userId: string | undefined, action: string, metadata: Record<string, any>, ip?: string) {
    await this.log({
      user_id: userId,
      action: `suspicious_${action}`,
      resource_type: 'security',
      ip_address: ip,
      metadata
    });
  }
}

// /lib/security/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY!;

if (!SECRET_KEY) {
  throw new Error('ENCRYPTION_SECRET_KEY environment variable is required');
}

export class Encryption {
  private static getKey(): Buffer {
    return crypto.scryptSync(SECRET_KEY, 'salt', 32);
  }

  static encrypt(text: string): string {
    const key = this.getKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, key);
    cipher.setAAD(Buffer.from('additional-data'));

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();
    
    return JSON.stringify({
      iv: iv.toString('hex'),
      encrypted,
      authTag: authTag.toString('hex')
    });
  }

  static decrypt(encryptedData: string): string {
    try {
      const { iv, encrypted, authTag } = JSON.parse(encryptedData);
      const key = this.getKey();
      
      const decipher = crypto.createDecipher(ALGORITHM, key);
      decipher.setAAD(Buffer.from('additional-data'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }

  static hash(text: string, salt?: string): string {
    const actualSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(text, actualSalt, 10000, 64, 'sha512');
    return `${actualSalt}:${hash.toString('hex')}`;
  }

  static verifyHash(text: string, hashedText: string): boolean {
    try {
      const [salt, originalHash] = hashedText.split(':');
      const hash = crypto.pbkdf2Sync(text, salt, 10000, 64, 'sha512');
      return hash.toString('hex') === originalHash;
    } catch (error) {
      return false;
    }
  }
}

// /lib/api/error-handler.ts
import { NextResponse } from 'next/server';
import { AuditLogger } from '@/lib/security/audit-logger';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
  
  public details?: any;
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class QuotaExceededError extends ApiError {
  constructor(message: string = 'Quota exceeded') {
    super(message, 402, 'QUOTA_EXCEEDED');
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded', retryAfter: number = 3600) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.retryAfter = retryAfter;
  }
  
  public retryAfter: number;
}

export function handleApiError(error: any, userId?: string, ip?: string) {
  console.error('API Error:', error);

  // Log security-related errors
  if (error instanceof AuthenticationError || 
      error instanceof AuthorizationError || 
      error instanceof RateLimitError) {
    AuditLogger.logSuspiciousActivity(
      userId,
      error.name,
      { error_message: error.message },
      ip
    );
  }

  if (error instanceof ApiError) {
    const response: any = {
      error: error.message,
      code: error.code
    };

    if (error instanceof ValidationError && error.details) {
      response.details = error.details;
    }

    if (error instanceof RateLimitError) {
      return new NextResponse(JSON.stringify(response), {
        status: error.statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': error.retryAfter.toString()
        }
      });
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Generic error
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    },
    { status: 500 }
  );
}

// Async error wrapper for API routes
export function asyncHandler(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return async (req: Request, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
      return handleApiError(error, undefined, ip || undefined);
    }
  };
}

// /lib/security/csrf.ts
import crypto from 'crypto';

export class CSRFProtection {
  private static generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static createToken(userId: string): string {
    const token = this.generateToken();
    const timestamp = Date.now();
    const payload = `${userId}:${timestamp}:${token}`;
    
    const signature = crypto
      .createHmac('sha256', process.env.CSRF_SECRET!)
      .update(payload)
      .digest('hex');

    return Buffer.from(`${payload}:${signature}`).toString('base64');
  }

  static validateToken(token: string, userId: string, maxAge: number = 3600000): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      const [receivedUserId, timestamp, tokenValue, signature] = decoded.split(':');

      // Verify user ID matches
      if (receivedUserId !== userId) return false;

      // Verify token hasn't expired
      const tokenAge = Date.now() - parseInt(timestamp);
      if (tokenAge > maxAge) return false;

      // Verify signature
      const payload = `${receivedUserId}:${timestamp}:${tokenValue}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CSRF_SECRET!)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      return false;
    }
  }
}

// /lib/monitoring/performance.ts
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static startTimer(operation: string): () => number {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(operation, duration);
      return duration;
    };
  }

  private static recordMetric(operation: string, duration: number) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    const metrics = this.metrics.get(operation)!;
    metrics.push(duration);
    
    // Keep only last 1000 metrics
    if (metrics.length > 1000) {
      metrics.shift();
    }
  }

  static getMetrics(operation: string) {
    const metrics = this.metrics.get(operation) || [];
    
    if (metrics.length === 0) {
      return null;
    }

    const sorted = [...metrics].sort((a, b) => a - b);
    
    return {
      count: metrics.length,
      avg: metrics.reduce((sum, val) => sum + val, 0) / metrics.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }

  static logSlowQueries(operation: string, duration: number, threshold: number = 1000) {
    if (duration > threshold) {
      console.warn(`Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
      
      // In production, send to monitoring service
      if (process.env.NODE_ENV === 'production') {
        // Send to DataDog, New Relic, etc.
      }
    }
  }
}