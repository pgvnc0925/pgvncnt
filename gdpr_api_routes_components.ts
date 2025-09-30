// ====================================
// GDPR API ROUTES & USER DASHBOARD
// Subject Access Rights Implementation
// ====================================

// /app/api/gdpr/data-request/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, AuthenticationError } from '@/lib/api/error-handler';
import { ConsentManager } from '@/lib/gdpr/consent-manager';
import { z } from 'zod';

const consentSchema = z.object({
  app_slug: z.string().min(1).max(50),
  consents: z.record(z.boolean())
});

// Update user consent preferences
export const POST = asyncHandler(async (request: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  const body = await request.json();
  const validatedData = consentSchema.parse(body);

  // Record each consent preference
  for (const [consentType, given] of Object.entries(validatedData.consents)) {
    await ConsentManager.recordConsent(session.user.email!, {
      type: consentType as any,
      given,
      method: 'settings_page',
      appSlug: validatedData.app_slug,
      legalBasis: consentType === 'necessary' ? 'legal_obligation' : 'consent',
      userId: session.user.id,
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined
    });
  }

  return NextResponse.json({ success: true });
});

// Get current consent status
export const GET = asyncHandler(async (request: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  const { searchParams } = new URL(request.url);
  const appSlug = searchParams.get('app_slug') || 'default';

  const consentStatus = await ConsentManager.getConsentStatus(session.user.id, appSlug);

  return NextResponse.json({ consents: consentStatus });
});

// /components/gdpr/privacy-dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Trash2, 
  Edit, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Mail,
  Database
} from 'lucide-react';

interface DataRequest {
  id: string;
  request_type: string;
  status: string;
  requested_at: string;
  completed_at?: string;
  response_deadline: string;
}

interface ConsentStatus {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function PrivacyDashboard({ appSlug }: { appSlug: string }) {
  const { user } = useAuth();
  const [consents, setConsents] = useState<ConsentStatus>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      loadPrivacyData();
    }
  }, [user, appSlug]);

  const loadPrivacyData = async () => {
    try {
      // Load consent status
      const consentResponse = await fetch(`/api/gdpr/consent?app_slug=${appSlug}`);
      const consentData = await consentResponse.json();
      
      if (consentData.consents) {
        setConsents({
          necessary: true, // Always true
          functional: consentData.consents.functional || false,
          analytics: consentData.consents.analytics || false,
          marketing: consentData.consents.marketing || false
        });
      }

      // Load data requests
      const requestsResponse = await fetch('/api/gdpr/data-request');
      const requestsData = await requestsResponse.json();
      setDataRequests(requestsData.requests || []);
    } catch (error) {
      console.error('Error loading privacy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConsents = async (newConsents: ConsentStatus) => {
    setUpdating(true);
    try {
      const response = await fetch('/api/gdpr/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_slug: appSlug,
          consents: newConsents
        })
      });

      if (response.ok) {
        setConsents(newConsents);
      } else {
        throw new Error('Failed to update consents');
      }
    } catch (error) {
      console.error('Error updating consents:', error);
    } finally {
      setUpdating(false);
    }
  };

  const createDataRequest = async (requestType: string) => {
    try {
      const response = await fetch('/api/gdpr/data-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_type: requestType,
          reason: `User requested ${requestType} via privacy dashboard`
        })
      });

      if (response.ok) {
        await loadPrivacyData(); // Refresh data
      } else {
        throw new Error(`Failed to create ${requestType} request`);
      }
    } catch (error) {
      console.error('Error creating data request:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>;
      case 'processing':
        return <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Processing
        </Badge>;
      case 'pending':
        return <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
      default:
        return <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {status}
        </Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-EU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
      ))}
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Privacy & Data Control</h1>
        <p className="text-muted-foreground">
          Manage your data, privacy preferences, and exercise your rights under GDPR.
        </p>
      </div>

      {/* Cookie & Marketing Consent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Consent Preferences
          </CardTitle>
          <CardDescription>
            Control how we use cookies and process your data for different purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Necessary Cookies */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox checked={true} disabled />
                <div>
                  <div className="font-medium">Necessary Cookies</div>
                  <div className="text-sm text-muted-foreground">
                    Essential for the website to function properly
                  </div>
                </div>
              </div>
              <Badge variant="secondary">Required</Badge>
            </div>

            {/* Functional Cookies */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={consents.functional}
                  onCheckedChange={(checked) => 
                    updateConsents({ ...consents, functional: !!checked })
                  }
                  disabled={updating}
                />
                <div>
                  <div className="font-medium">Functional Cookies</div>
                  <div className="text-sm text-muted-foreground">
                    Remember preferences and provide enhanced features
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={consents.analytics}
                  onCheckedChange={(checked) => 
                    updateConsents({ ...consents, analytics: !!checked })
                  }
                  disabled={updating}
                />
                <div>
                  <div className="font-medium">Analytics Cookies</div>
                  <div className="text-sm text-muted-foreground">
                    Help us understand how you use our service
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={consents.marketing}
                  onCheckedChange={(checked) => 
                    updateConsents({ ...consents, marketing: !!checked })
                  }
                  disabled={updating}
                />
                <div>
                  <div className="font-medium">Marketing Cookies</div>
                  <div className="text-sm text-muted-foreground">
                    Show relevant ads and measure campaign effectiveness
                  </div>
                </div>
              </div>
            </div>
          </div>

          {updating && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>Updating your preferences...</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Your Data Rights
          </CardTitle>
          <CardDescription>
            Under GDPR, you have several rights regarding your personal data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Export Data */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium flex items-center mb-2">
                <Download className="h-4 w-4 mr-2" />
                Download Your Data
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get a copy of all personal data we have about you.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => createDataRequest('export')}
              >
                Request Export
              </Button>
            </div>

            {/* Delete Account */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium flex items-center mb-2">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Your Account
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Permanently delete your account and all associated data.
              </p>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => createDataRequest('delete')}
              >
                Request Deletion
              </Button>
            </div>

            {/* Rectify Data */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium flex items-center mb-2">
                <Edit className="h-4 w-4 mr-2" />
                Correct Your Data
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Request correction of inaccurate personal data.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => createDataRequest('rectify')}
              >
                Request Correction
              </Button>
            </div>

            {/* Restrict Processing */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium flex items-center mb-2">
                <Shield className="h-4 w-4 mr-2" />
                Restrict Processing
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Limit how we process your personal data.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => createDataRequest('restrict')}
              >
                Request Restriction
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Requests History */}
      {dataRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Request History</CardTitle>
            <CardDescription>
              Track the status of your data requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium capitalize">
                      {request.request_type} Request
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Requested on {formatDate(request.requested_at)}
                    </div>
                    {request.status === 'pending' && (
                      <div className="text-xs text-orange-600 mt-1">
                        Response by {formatDate(request.response_deadline)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {getStatusBadge(request.status)}
                    {request.completed_at && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Completed {formatDate(request.completed_at)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Questions about your privacy?</h3>
              <p className="text-sm text-muted-foreground">
                Contact our Data Protection Officer at{' '}
                <a href="mailto:dpo@yourcompany.com" className="underline">
                  dpo@yourcompany.com
                </a>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                You also have the right to lodge a complaint with your local data protection authority.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// /components/gdpr/lead-magnet-consent.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConsentManager } from '@/lib/gdpr/consent-manager';
import { Shield, Mail } from 'lucide-react';

interface LeadMagnetConsentProps {
  email: string;
  appSlug: string;
  onConsentGiven: (hasConsent: boolean) => void;
  toolName: string;
}

export function LeadMagnetConsent({ 
  email, 
  appSlug, 
  onConsentGiven, 
  toolName 
}: LeadMagnetConsentProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConsent = async () => {
    setLoading(true);
    
    try {
      // Record necessary consent for tool usage
      await ConsentManager.recordConsent(email, {
        type: 'necessary',
        given: true,
        method: 'lead_magnet',
        appSlug,
        legalBasis: 'contract' // Using tool = contract
      });

      // Record functional consent (required for tool to work)
      await ConsentManager.recordConsent(email, {
        type: 'functional',
        given: true,
        method: 'lead_magnet',
        appSlug,
        legalBasis: 'contract'
      });

      // Record marketing consent if given
      if (agreedToMarketing) {
        await ConsentManager.recordConsent(email, {
          type: 'marketing',
          given: true,
          method: 'lead_magnet',
          appSlug,
          legalBasis: 'consent'
        });
      }

      onConsentGiven(true);
    } catch (error) {
      console.error('Failed to record consent:', error);
      onConsentGiven(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Shield className="h-5 w-5 mr-2" />
          Privacy & Data Usage
        </CardTitle>
        <CardDescription>
          Before using {toolName}, please confirm your data preferences.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Required Terms */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
            />
            <div className="flex-1">
              <label htmlFor="terms" className="text-sm font-medium">
                I agree to the Terms of Service and Privacy Policy (Required)
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                We'll process your data to provide the {toolName} service. Your API key is encrypted and never stored in plain text.
              </p>
            </div>
          </div>

          {/* Marketing Consent */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketing"
              checked={agreedToMarketing}
              onCheckedChange={(checked) => setAgreedToMarketing(!!checked)}
            />
            <div className="flex-1">
              <label htmlFor="marketing" className="text-sm font-medium">
                Send me tips and updates about similar tools (Optional)
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                We'll occasionally send helpful content. You can unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded border text-xs text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Mail className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Your Rights:</strong> You can request to see, correct, or delete your data at any time. 
              Contact us at privacy@yourcompany.com or use our privacy dashboard.
            </div>
          </div>
        </div>

        <Button 
          onClick={handleConsent}
          disabled={!agreedToTerms || loading}
          className="w-full"
        >
          {loading ? 'Processing...' : `Continue with ${toolName}`}
        </Button>

        <div className="text-center">
          <a 
            href="/privacy-policy" 
            target="_blank" 
            className="text-xs text-blue-600 hover:underline"
          >
            Read full Privacy Policy
          </a>
          {' • '}
          <a 
            href="/terms" 
            target="_blank" 
            className="text-xs text-blue-600 hover:underline"
          >
            Terms of Service
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// /lib/gdpr/compliance-middleware.ts
import { NextRequest } from 'next/server';
import { ConsentManager } from './consent-manager';

export class ComplianceMiddleware {
  // Check if we can send marketing emails
  static async canSendMarketing(email: string, appSlug: string): Promise<boolean> {
    try {
      return await ConsentManager.canSendMarketing(email, appSlug);
    } catch (error) {
      console.error('Error checking marketing consent:', error);
      return false; // Fail safe - don't send if unsure
    }
  }

  // Check if we can collect analytics
  static async canCollectAnalytics(
    request: NextRequest, 
    userIdOrEmail: string, 
    appSlug: string
  ): Promise<boolean> {
    try {
      // Check consent from database
      const hasConsent = await ConsentManager.canCollectAnalytics(userIdOrEmail, appSlug);
      
      // Also check cookie consent for anonymous users
      const cookieConsent = request.cookies.get(`gdpr_consent_${appSlug}`);
      if (cookieConsent) {
        const consent = JSON.parse(cookieConsent.value);
        return consent.analytics === true;
      }
      
      return hasConsent;
    } catch (error) {
      console.error('Error checking analytics consent:', error);
      return false; // Fail safe
    }
  }

  // Anonymize IP address for GDPR compliance
  static anonymizeIP(ip: string): string {
    const parts = ip.split('.');
    if (parts.length === 4) {
      // IPv4: Replace last octet with 0
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    } else {
      // IPv6: Keep first 64 bits, zero the rest
      const ipv6Parts = ip.split(':');
      return ipv6Parts.slice(0, 4).join(':') + '::';
    }
  }
}

// /app/privacy-policy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Account information (email, name, password)</li>
            <li>API keys (encrypted and securely stored)</li>
            <li>Usage data and search queries</li>
            <li>Payment information (processed by Stripe)</li>
            <li>Communication records</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Provide and improve our services</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send service-related communications</li>
            <li>Analyze usage patterns (with consent)</li>
            <li>Send marketing communications (with consent)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Legal Bases (GDPR)</h2>
          <p>We process personal data based on:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Contract:</strong> To provide our services</li>
            <li><strong>Consent:</strong> For marketing and analytics</li>
            <li><strong>Legitimate Interest:</strong> For security and fraud prevention</li>
            <li><strong>Legal Obligation:</strong> For compliance with laws</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Your Rights Under GDPR</h2>
          <p>If you're in the EU, you have the right to:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data</li>
            <li>Restrict processing</li>
            <li>Data portability</li>
            <li>Object to processing</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Data Retention</h2>
          <p>We retain your data for:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Account data: Until account deletion + 30 days</li>
            <li>Usage logs: 12 months</li>
            <li>Financial records: 7 years (legal requirement)</li>
            <li>Marketing data: Until consent withdrawal</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
          <p>For privacy questions or to exercise your rights:</p>
          <ul className="list-none space-y-1">
            <li><strong>Email:</strong> privacy@yourcompany.com</li>
            <li><strong>DPO:</strong> dpo@yourcompany.com</li>
            <li><strong>Privacy Dashboard:</strong> Available in your account settings</li>
          </ul>
        </section>
      </div>
    </div>
  );
}lib/api/error-handler';
import { DataProcessor } from '@/lib/gdpr/data-processor';
import { AuditLogger } from '@/lib/security/audit-logger';
import { z } from 'zod';

const dataRequestSchema = z.object({
  request_type: z.enum(['export', 'delete', 'rectify', 'restrict', 'portability']),
  reason: z.string().min(10).max(500).optional()
});

// Create new data request (Article 15, 17, 16, 18, 20 GDPR)
export const POST = asyncHandler(async (request: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  const body = await request.json();
  const validatedData = dataRequestSchema.parse(body);

  // Create data request
  const { data: dataRequest, error } = await supabase
    .from('data_requests')
    .insert({
      user_id: session.user.id,
      request_type: validatedData.request_type,
      status: 'pending',
      response_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create data request: ${error.message}`);
  }

  // For export requests, process immediately if data is not sensitive
  if (validatedData.request_type === 'export') {
    try {
      const userData = await DataProcessor.exportUserData(session.user.id);
      
      await supabase
        .from('data_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          data_exported: userData
        })
        .eq('id', dataRequest.id);

      // Send export email
      await sendDataExportEmail(session.user.email!, userData);
    } catch (exportError) {
      console.error('Auto-export failed:', exportError);
      // Will be processed manually
    }
  }

  // For deletion requests, schedule deletion (with 30-day cooling period)
  if (validatedData.request_type === 'delete') {
    await DataProcessor.scheduleDataDeletion(session.user.id);
  }

  await AuditLogger.log({
    user_id: session.user.id,
    action: `gdpr_request_${validatedData.request_type}`,
    resource_type: 'gdpr_request',
    resource_id: dataRequest.id,
    metadata: { reason: validatedData.reason }
  });

  return NextResponse.json({ 
    success: true, 
    request_id: dataRequest.id,
    estimated_completion: dataRequest.response_deadline
  });
});

// Get user's data requests
export const GET = asyncHandler(async (request: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new AuthenticationError();
  }

  const { data: requests, error } = await supabase
    .from('data_requests')
    .select('*')
    .eq('user_id', session.user.id)
    .order('requested_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch data requests: ${error.message}`);
  }

  return NextResponse.json({ requests });
});

async function sendDataExportEmail(email: string, userData: any) {
  // Implementation depends on your email service
  console.log(`Sending data export to ${email}`);
  // Use SendGrid, Mailgun, etc.
}

// /app/api/gdpr/consent/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, AuthenticationError } from '@/