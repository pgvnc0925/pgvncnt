// ====================================
// COMPLETE API STRUCTURE & ROUTES
// Production-Ready Next.js API Layer
// ====================================

// /app/api/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  return NextResponse.redirect(new URL('/auth/login?error=invalid_code', request.url));
}

// /app/api/user/profile/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, AuthenticationError } from '@/lib/api/error-handler';
import { AuditLogger } from '@/lib/security/audit-logger';
import { z } from 'zod';

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  preferences: z.object({
    timezone: z.string().optional(),
    language: z.enum(['en', 'it', 'es']).optional(),
    email_notifications: z.boolean().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional()
  }).optional()
});

export const GET = asyncHandler(async (request: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return NextResponse.json({ profile });
});

export const PUT = asyncHandler(async (request: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  const body = await request.json();
  const validatedData = updateProfileSchema.parse(body);

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      ...validatedData,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', session.user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  await AuditLogger.log({
    user_id: session.user.id,
    action: 'profile_updated',
    resource_type: 'profile',
    resource_id: session.user.id
  });

  return NextResponse.json({ profile });
});

// /app/api/user/quota/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, AuthenticationError } from '@/lib/api/error-handler';
import { BillingService } from '@/lib/billing/billing-service';
import { z } from 'zod';

const quotaQuerySchema = z.object({
  app_slug: z.string().min(1).max(50)
});

export const GET = asyncHandler(async (request: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  const { searchParams } = new URL(request.url);
  const { app_slug } = quotaQuerySchema.parse({
    app_slug: searchParams.get('app_slug')
  });

  const quota = await BillingService.getUserQuota(session.user.id, app_slug);
  const canUse = await BillingService.canUseService(session.user.id, app_slug);
  const analytics = await BillingService.getUsageAnalytics(session.user.id, app_slug);

  return NextResponse.json({
    quota,
    can_use: canUse,
    analytics
  });
});

// /app/api/jobs/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, AuthenticationError, QuotaExceededError } from '@/lib/api/error-handler';
import { BillingService } from '@/lib/billing/billing-service';
import { AuditLogger } from '@/lib/security/audit-logger';
import { PerformanceMonitor } from '@/lib/monitoring/performance';
import { createJobSchema, paginationSchema } from '@/lib/security/input-validation';

// Create new job
export const POST = asyncHandler(async (request: NextRequest) => {
  const endTimer = PerformanceMonitor.startTimer('create_job');
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  const body = await request.json();
  const validatedData = createJobSchema.parse(body);

  // Check quota
  const canUse = await BillingService.canUseService(
    session.user.id, 
    validatedData.app_slug
  );
  
  if (!canUse.allowed) {
    await AuditLogger.logQuotaExceeded(
      session.user.id, 
      validatedData.app_slug, 
      canUse.remainingMonthly || 0
    );
    throw new QuotaExceededError(`Quota exceeded: ${canUse.reason}`);
  }

  // Create job record
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .insert({
      user_id: session.user.id,
      search_type: validatedData.search_url ? 'url' : 'keyword',
      search_term: validatedData.search_term,
      search_url: validatedData.search_url,
      pages_requested: validatedData.pages,
      status: 'pending',
      app_slug: validatedData.app_slug
    })
    .select()
    .single();

  if (jobError) {
    throw new Error(`Failed to create job: ${jobError.message}`);
  }

  // Consume quota
  await BillingService.consumeQuota(session.user.id, validatedData.app_slug);

  // Trigger external processing (n8n webhook)
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      const webhookPayload = {
        job_id: job.id,
        user_id: session.user.id,
        search_url: validatedData.search_url || `https://www.google.com/maps/search/${encodeURIComponent(validatedData.search_term)}`,
        pages_limit: validatedData.pages
      };

      await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      });
    } catch (webhookError) {
      console.error('Failed to trigger n8n webhook:', webhookError);
      // Don't fail the job creation, just log the error
    }
  }

  await AuditLogger.log({
    user_id: session.user.id,
    app_slug: validatedData.app_slug,
    action: 'job_created',
    resource_type: 'job',
    resource_id: job.id,
    metadata: { search_term: validatedData.search_term, pages: validatedData.pages }
  });

  const duration = endTimer();
  PerformanceMonitor.logSlowQueries('create_job', duration);

  return NextResponse.json({ job }, { status: 201 });
});

// Get user's jobs
export const GET = asyncHandler(async (request: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  const { searchParams } = new URL(request.url);
  const pagination = paginationSchema.parse({
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    sortBy: searchParams.get('sortBy') || 'created_at',
    sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'
  });

  const app_slug = searchParams.get('app_slug');
  const status = searchParams.get('status');

  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('user_id', session.user.id);

  if (app_slug) {
    query = query.eq('app_slug', app_slug);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data: jobs, error, count } = await query
    .order(pagination.sortBy, { ascending: pagination.sortOrder === 'asc' })
    .range(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit - 1
    );

  if (error) {
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }

  return NextResponse.json({
    jobs,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: count || 0,
      pages: Math.ceil((count || 0) / pagination.limit)
    }
  });
});

// /app/api/jobs/[id]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, AuthenticationError, AuthorizationError } from '@/lib/api/error-handler';

export const GET = asyncHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AuthorizationError('Job not found or access denied');
    }
    throw new Error(`Failed to fetch job: ${error.message}`);
  }

  return NextResponse.json({ job });
});

// /app/api/jobs/[id]/results/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, AuthenticationError, AuthorizationError } from '@/lib/api/error-handler';
import { paginationSchema } from '@/lib/security/input-validation';

export const GET = asyncHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  // Verify job ownership
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('id, user_id, app_slug')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single();

  if (jobError || !job) {
    throw new AuthorizationError('Job not found or access denied');
  }

  // Get user's plan to determine result limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('user_id', session.user.id)
    .single();

  const userPlan = profile?.plan || 'free';

  // Parse pagination
  const { searchParams } = new URL(request.url);
  const pagination = paginationSchema.parse({
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    sortBy: searchParams.get('sortBy') || 'created_at',
    sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'
  });

  // Apply plan restrictions
  let effectiveLimit = pagination.limit;
  let maxResults = Infinity;

  if (userPlan === 'free') {
    maxResults = 10; // Free users see max 10 results
    effectiveLimit = Math.min(effectiveLimit, maxResults);
  }

  // Fetch results with plan restrictions
  let query = supabase
    .from('results')
    .select('*', { count: 'exact' })
    .eq('job_id', params.id);

  const { data: results, error: resultsError, count } = await query
    .order(pagination.sortBy, { ascending: pagination.sortOrder === 'asc' })
    .range(
      (pagination.page - 1) * effectiveLimit,
      Math.min(pagination.page * effectiveLimit - 1, maxResults - 1)
    );

  if (resultsError) {
    throw new Error(`Failed to fetch results: ${resultsError.message}`);
  }

  const response = {
    results: results || [],
    pagination: {
      page: pagination.page,
      limit: effectiveLimit,
      total: Math.min(count || 0, maxResults),
      pages: Math.ceil(Math.min(count || 0, maxResults) / effectiveLimit)
    },
    plan_restrictions: {
      plan: userPlan,
      max_visible_results: userPlan === 'free' ? 10 : Infinity,
      showing_limited_results: userPlan === 'free' && (count || 0) > 10
    }
  };

  return NextResponse.json(response);
});

// /app/api/export/[format]/[jobId]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, AuthenticationError, AuthorizationError, QuotaExceededError } from '@/lib/api/error-handler';
import { AuditLogger } from '@/lib/security/audit-logger';
import { exportRequestSchema } from '@/lib/security/input-validation';

export const GET = asyncHandler(async (
  request: NextRequest, 
  { params }: { params: { format: string; jobId: string } }
) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  // Validate parameters
  const validatedData = exportRequestSchema.parse({
    job_id: params.jobId,
    format: params.format
  });

  // Check user's plan and export permissions
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('user_id', session.user.id)
    .single();

  const userPlan = profile?.plan || 'free';
  
  // Free users cannot export
  if (userPlan === 'free') {
    throw new QuotaExceededError('Export feature requires a paid plan. Upgrade to access exports.');
  }

  // Verify job ownership
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('id, user_id, app_slug, search_term, status')
    .eq('id', params.jobId)
    .eq('user_id', session.user.id)
    .single();

  if (jobError || !job) {
    throw new AuthorizationError('Job not found or access denied');
  }

  if (job.status !== 'completed') {
    throw new Error('Cannot export incomplete job');
  }

  // Fetch results
  const { data: results, error: resultsError } = await supabase
    .from('results')
    .select('*')
    .eq('job_id', params.jobId)
    .order('created_at', { ascending: true });

  if (resultsError) {
    throw new Error(`Failed to fetch results: ${resultsError.message}`);
  }

  // Generate export based on format
  let exportData: Buffer;
  let contentType: string;
  let filename: string;

  switch (validatedData.format) {
    case 'csv':
      exportData = generateCSV(results || []);
      contentType = 'text/csv';
      filename = `results_${job.search_term}_${new Date().toISOString().split('T')[0]}.csv`;
      break;
      
    case 'pdf':
      exportData = await generatePDF(results || [], job);
      contentType = 'application/pdf';
      filename = `results_${job.search_term}_${new Date().toISOString().split('T')[0]}.pdf`;
      break;
      
    case 'json':
      exportData = Buffer.from(JSON.stringify(results, null, 2));
      contentType = 'application/json';
      filename = `results_${job.search_term}_${new Date().toISOString().split('T')[0]}.json`;
      break;
      
    default:
      throw new Error('Unsupported export format');
  }

  // Log export activity
  await AuditLogger.logDataExport(
    session.user.id,
    job.app_slug,
    validatedData.format,
    results?.length || 0
  );

  return new NextResponse(exportData, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': exportData.length.toString()
    }
  });
});

// Helper functions for export generation
function generateCSV(results: any[]): Buffer {
  if (results.length === 0) {
    return Buffer.from('No data available');
  }

  const headers = Object.keys(results[0]).filter(key => key !== 'id' && key !== 'job_id');
  const csvContent = [
    headers.join(','),
    ...results.map(result => 
      headers.map(header => {
        const value = result[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  return Buffer.from(csvContent, 'utf-8');
}

async function generatePDF(results: any[], job: any): Promise<Buffer> {
  // This would use a PDF generation library like puppeteer or jsPDF
  // Simplified implementation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Search Results - ${job.search_term}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <h1>Search Results: ${job.search_term}</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      <p>Total Results: ${results.length}</p>
      
      <table>
        <thead>
          <tr>
            ${Object.keys(results[0] || {}).filter(key => key !== 'id' && key !== 'job_id').map(key => `<th>${key}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${results.map(result => `
            <tr>
              ${Object.keys(result).filter(key => key !== 'id' && key !== 'job_id').map(key => `<td>${result[key] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // In production, use puppeteer to convert HTML to PDF
  return Buffer.from(htmlContent, 'utf-8');
}

// /app/api/billing/tokens/purchase/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, AuthenticationError } from '@/lib/api/error-handler';
import { BillingService } from '@/lib/billing/billing-service';
import { AuditLogger } from '@/lib/security/audit-logger';
import { z } from 'zod';

const purchaseTokensSchema = z.object({
  app_slug: z.string().min(1).max(50),
  token_pack_id: z.string().min(1).max(50),
  payment_method_id: z.string().min(1) // Stripe payment method ID
});

export const POST = asyncHandler(async (request: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  const body = await request.json();
  const validatedData = purchaseTokensSchema.parse(body);

  // Token pack configurations
  const TOKEN_PACKS = {
    'small': { tokens: 25, price: 29, expiry_months: 6 },
    'medium': { tokens: 50, price: 49, expiry_months: 6 },
    'large': { tokens: 100, price: 89, expiry_months: 12 }
  };

  const tokenPack = TOKEN_PACKS[validatedData.token_pack_id as keyof typeof TOKEN_PACKS];
  if (!tokenPack) {
    throw new Error('Invalid token pack');
  }

  try {
    // Process payment with Stripe (simplified)
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: tokenPack.price * 100, // Convert to cents
      currency: 'eur',
      payment_method: validatedData.payment_method_id,
      confirm: true,
      metadata: {
        user_id: session.user.id,
        app_slug: validatedData.app_slug,
        token_pack_id: validatedData.token_pack_id,
        tokens: tokenPack.tokens
      }
    });

    if (paymentIntent.status === 'succeeded') {
      // Add tokens to user's account
      await BillingService.addBonusTokens(
        session.user.id,
        validatedData.app_slug,
        tokenPack.tokens,
        tokenPack.expiry_months
      );

      await AuditLogger.log({
        user_id: session.user.id,
        app_slug: validatedData.app_slug,
        action: 'tokens_purchased',
        resource_type: 'billing',
        metadata: {
          tokens: tokenPack.tokens,
          amount: tokenPack.price,
          payment_intent_id: paymentIntent.id
        }
      });

      return NextResponse.json({
        success: true,
        tokens_added: tokenPack.tokens,
        payment_intent_id: paymentIntent.id
      });
    } else {
      throw new Error('Payment failed');
    }
  } catch (error: any) {
    await AuditLogger.log({
      user_id: session.user.id,
      app_slug: validatedData.app_slug,
      action: 'token_purchase_failed',
      resource_type: 'billing',
      metadata: {
        error: error.message,
        token_pack_id: validatedData.token_pack_id
      }
    });

    throw new Error(`Payment processing failed: ${error.message}`);
  }
});

// /app/api/lead-magnet/track-usage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, QuotaExceededError } from '@/lib/api/error-handler';
import { LeadMagnetService } from '@/lib/lead-magnet/lead-service';
import { AuditLogger } from '@/lib/security/audit-logger';
import { leadMagnetSchema } from '@/lib/security/input-validation';

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();
  const validatedData = leadMagnetSchema.parse(body);

  // Check if user can use free service
  const canUse = await LeadMagnetService.canUseFreeService(
    validatedData.email,
    validatedData.app_slug
  );

  if (!canUse.allowed) {
    throw new QuotaExceededError(
      `Daily limit of ${canUse.dailyLimit} uses exceeded. Usage resets at midnight UTC.`
    );
  }

  // Store API key securely if provided
  let apiKeyHash = '';
  if (validatedData.api_key) {
    const apiKeyData = await LeadMagnetService.storeApiKey(
      validatedData.email,
      'openai', // This would be dynamic based on app
      validatedData.api_key
    );
    apiKeyHash = apiKeyData.key_hash;
  }

  // Track usage
  await LeadMagnetService.trackLeadUsage(
    validatedData.email,
    validatedData.app_slug,
    apiKeyHash,
    {
      source: validatedData.utm_source,
      medium: validatedData.utm_medium,
      campaign: validatedData.utm_campaign
    }
  );

  // Log usage for analytics
  await AuditLogger.log({
    app_slug: validatedData.app_slug,
    action: 'lead_magnet_usage',
    resource_type: 'usage',
    metadata: {
      email: validatedData.email,
      utm_source: validatedData.utm_source,
      utm_medium: validatedData.utm_medium,
      utm_campaign: validatedData.utm_campaign
    }
  });

  return NextResponse.json({
    success: true,
    remaining_uses: canUse.dailyLimit - canUse.dailyUsage - 1,
    daily_limit: canUse.dailyLimit
  });
});

// /app/api/webhooks/n8n/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { asyncHandler } from '@/lib/api/error-handler';
import { z } from 'zod';

const webhookSchema = z.object({
  job_id: z.string().uuid(),
  status: z.enum(['running', 'completed', 'failed']),
  results: z.array(z.object({
    business_name: z.string(),
    address: z.string(),
    phone: z.string().optional(),
    website: z.string().optional(),
    rating: z.number().optional(),
    review_count: z.number().optional(),
    category: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    gmaps_url: z.string().optional()
  })).optional(),
  total_results: z.number().optional(),
  error_message: z.string().optional()
});

// Webhook endpoint for n8n to update job status and results
export const POST = asyncHandler(async (request: NextRequest) => {
  // Verify webhook signature (in production)
  const webhookSignature = request.headers.get('x-n8n-signature');
  if (!verifyWebhookSignature(webhookSignature, await request.text())) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const body = await request.json();
  const validatedData = webhookSchema.parse(body);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Update job status
  const { error: jobUpdateError } = await supabase
    .from('jobs')
    .update({
      status: validatedData.status,
      total_results: validatedData.total_results,
      completed_at: validatedData.status === 'completed' ? new Date().toISOString() : null
    })
    .eq('id', validatedData.job_id);

  if (jobUpdateError) {
    throw new Error(`Failed to update job: ${jobUpdateError.message}`);
  }

  // Insert results if provided
  if (validatedData.results && validatedData.results.length > 0) {
    const resultsWithJobId = validatedData.results.map(result => ({
      ...result,
      job_id: validatedData.job_id
    }));

    const { error: resultsError } = await supabase
      .from('results')
      .insert(resultsWithJobId);

    if (resultsError) {
      console.error('Failed to insert results:', resultsError);
      // Don't fail the webhook, just log the error
    }
  }

  // Send notification email if job completed
  if (validatedData.status === 'completed') {
    // Get job details for notification
    const { data: job } = await supabase
      .from('jobs')
      .select(`
        *,
        profiles:user_id (email, full_name)
      `)
      .eq('id', validatedData.job_id)
      .single();

    if (job?.profiles?.email) {
      // Send completion email (implement with your email service)
      await sendJobCompletionEmail(job);
    }
  }

  return NextResponse.json({ success: true });
});

function verifyWebhookSignature(signature: string | null, body: string): boolean {
  if (!signature || !process.env.N8N_WEBHOOK_SECRET) {
    return false;
  }

  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.N8N_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

async function sendJobCompletionEmail(job: any) {
  // Implement with your email service (SendGrid, Mailgun, etc.)
  console.log(`Sending completion email for job ${job.id} to ${job.profiles.email}`);
}