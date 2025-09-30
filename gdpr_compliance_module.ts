// ====================================
// GDPR COMPLIANCE MODULE
// Complete GDPR Implementation for EU Compliance
// ====================================

// /lib/gdpr/types.ts
export interface ConsentRecord {
  id: string;
  user_id?: string;
  email: string;
  consent_type: 'marketing' | 'analytics' | 'functional' | 'necessary';
  consent_given: boolean;
  consent_date: string;
  consent_method: 'cookie_banner' | 'signup_form' | 'settings_page' | 'lead_magnet';
  ip_address?: string;
  user_agent?: string;
  legal_basis: 'consent' | 'legitimate_interest' | 'contract' | 'legal_obligation';
  withdrawal_date?: string;
  app_slug: string;
}

export interface DataProcessingRecord {
  id: string;
  user_id: string;
  data_type: string;
  processing_purpose: string;
  legal_basis: string;
  data_source: string;
  retention_period_months: number;
  created_at: string;
  scheduled_deletion_date: string;
}

export interface DataExportRequest {
  id: string;
  user_id: string;
  request_type: 'export' | 'delete' | 'rectify' | 'restrict' | 'portability';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requested_at: string;
  completed_at?: string;
  data_exported?: any;
  admin_notes?: string;
}

// /lib/database/gdpr-schema.sql
-- GDPR Compliance Tables

-- Consent Management
CREATE TABLE user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('marketing', 'analytics', 'functional', 'necessary')),
  consent_given BOOLEAN NOT NULL,
  consent_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  consent_method TEXT NOT NULL CHECK (consent_method IN ('cookie_banner', 'signup_form', 'settings_page', 'lead_magnet')),
  ip_address INET,
  user_agent TEXT,
  legal_basis TEXT NOT NULL CHECK (legal_basis IN ('consent', 'legitimate_interest', 'contract', 'legal_obligation')),
  withdrawal_date TIMESTAMPTZ,
  app_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  INDEX (user_id, consent_type),
  INDEX (email, app_slug)
);

-- Data Processing Records (Article 30 GDPR)
CREATE TABLE data_processing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  data_type TEXT NOT NULL, -- 'email', 'usage_data', 'api_keys', etc.
  processing_purpose TEXT NOT NULL, -- 'service_provision', 'analytics', 'marketing'
  legal_basis TEXT NOT NULL,
  data_source TEXT NOT NULL, -- 'user_input', 'automated_collection', 'third_party'
  retention_period_months INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_deletion_date TIMESTAMPTZ NOT NULL
);

-- User Data Requests (Subject Access Requests)
CREATE TABLE data_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'delete', 'rectify', 'restrict', 'portability')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  data_exported JSONB,
  admin_notes TEXT,
  response_deadline TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

-- Cookie Consent Tracking
CREATE TABLE cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL, -- Anonymous ID before signup
  consent_string TEXT NOT NULL, -- Encoded consent preferences
  consent_date TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  app_slug TEXT NOT NULL,
  INDEX (visitor_id, app_slug)
);

-- Data Breach Log (required by GDPR Article 33)
CREATE TABLE data_breach_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  breach_type TEXT NOT NULL,
  affected_data_types TEXT[] NOT NULL,
  affected_users_count INTEGER NOT NULL DEFAULT 0,
  breach_discovered_at TIMESTAMPTZ NOT NULL,
  breach_contained_at TIMESTAMPTZ,
  authorities_notified_at TIMESTAMPTZ,
  users_notified_at TIMESTAMPTZ,
  risk_assessment TEXT NOT NULL, -- 'low', 'medium', 'high'
  mitigation_measures TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for GDPR tables
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_processing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consents" ON user_consents
  FOR SELECT USING (auth.uid() = user_id OR email = auth.email());

CREATE POLICY "Users can view own data processing records" ON data_processing_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own data requests" ON data_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own data requests" ON data_requests
  FOR SELECT USING (auth.uid() = user_id);

// /lib/gdpr/consent-manager.ts
import { supabase } from '@/lib/supabase/client';
import { ConsentRecord } from './types';

export class ConsentManager {
  static async recordConsent(
    email: string,
    consentData: {
      type: ConsentRecord['consent_type'];
      given: boolean;
      method: ConsentRecord['consent_method'];
      appSlug: string;
      legalBasis: ConsentRecord['legal_basis'];
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<ConsentRecord> {
    const { data, error } = await supabase
      .from('user_consents')
      .insert({
        user_id: consentData.userId,
        email,
        consent_type: consentData.type,
        consent_given: consentData.given,
        consent_method: consentData.method,
        legal_basis: consentData.legalBasis,
        app_slug: consentData.appSlug,
        ip_address: consentData.ipAddress,
        user_agent: consentData.userAgent
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to record consent: ${error.message}`);
    return data;
  }

  static async withdrawConsent(
    userId: string,
    email: string,
    consentType: ConsentRecord['consent_type'],
    appSlug: string
  ): Promise<void> {
    const { error } = await supabase
      .from('user_consents')
      .update({
        consent_given: false,
        withdrawal_date: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('email', email)
      .eq('consent_type', consentType)
      .eq('app_slug', appSlug)
      .eq('consent_given', true);

    if (error) throw new Error(`Failed to withdraw consent: ${error.message}`);
  }

  static async getConsentStatus(
    identifier: string, // userId or email
    appSlug: string
  ): Promise<Record<string, boolean>> {
    const isEmail = identifier.includes('@');
    
    const { data, error } = await supabase
      .from('user_consents')
      .select('consent_type, consent_given, withdrawal_date')
      .eq(isEmail ? 'email' : 'user_id', identifier)
      .eq('app_slug', appSlug)
      .order('consent_date', { ascending: false });

    if (error) throw new Error(`Failed to get consent status: ${error.message}`);

    // Get latest consent for each type
    const consentMap: Record<string, boolean> = {};
    
    data.forEach(consent => {
      if (!consentMap.hasOwnProperty(consent.consent_type)) {
        consentMap[consent.consent_type] = consent.consent_given && !consent.withdrawal_date;
      }
    });

    return consentMap;
  }

  static async hasValidConsent(
    identifier: string,
    consentType: ConsentRecord['consent_type'],
    appSlug: string
  ): Promise<boolean> {
    const consentStatus = await this.getConsentStatus(identifier, appSlug);
    return consentStatus[consentType] === true;
  }

  // Check if we can process data for marketing purposes
  static async canSendMarketing(email: string, appSlug: string): Promise<boolean> {
    return await this.hasValidConsent(email, 'marketing', appSlug);
  }

  // Check if we can collect analytics
  static async canCollectAnalytics(identifier: string, appSlug: string): Promise<boolean> {
    return await this.hasValidConsent(identifier, 'analytics', appSlug);
  }
}

// /lib/gdpr/data-processor.ts
import { supabase } from '@/lib/supabase/client';
import { DataProcessingRecord } from './types';

export class DataProcessor {
  static async recordDataProcessing(
    userId: string,
    processing: {
      dataType: string;
      purpose: string;
      legalBasis: string;
      source: string;
      retentionMonths: number;
    }
  ): Promise<DataProcessingRecord> {
    const scheduledDeletion = new Date();
    scheduledDeletion.setMonth(scheduledDeletion.getMonth() + processing.retentionMonths);

    const { data, error } = await supabase
      .from('data_processing_records')
      .insert({
        user_id: userId,
        data_type: processing.dataType,
        processing_purpose: processing.purpose,
        legal_basis: processing.legalBasis,
        data_source: processing.source,
        retention_period_months: processing.retentionMonths,
        scheduled_deletion_date: scheduledDeletion.toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to record data processing: ${error.message}`);
    return data;
  }

  static async scheduleDataDeletion(userId: string): Promise<void> {
    // Mark user for deletion (30 days from now to allow for appeals)
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 30);

    const { error } = await supabase
      .from('profiles')
      .update({
        scheduled_for_deletion: deletionDate.toISOString(),
        deletion_requested_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to schedule deletion: ${error.message}`);
  }

  static async exportUserData(userId: string): Promise<any> {
    // Collect all user data from different tables
    const userData = {
      profile: null,
      consents: [],
      jobs: [],
      results: [],
      quotas: [],
      api_keys: [],
      audit_logs: []
    };

    // Profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    userData.profile = profile;

    // Consent records
    const { data: consents } = await supabase
      .from('user_consents')
      .select('*')
      .eq('user_id', userId);
    userData.consents = consents || [];

    // Job data
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId);
    userData.jobs = jobs || [];

    // Results data (only metadata, not full results for privacy)
    const { data: results } = await supabase
      .from('results')
      .select('job_id, created_at, business_name, address')
      .in('job_id', (jobs || []).map(j => j.id));
    userData.results = results || [];

    // Usage quotas
    const { data: quotas } = await supabase
      .from('user_quotas')
      .select('*')
      .eq('user_id', userId);
    userData.quotas = quotas || [];

    // API keys (only metadata, not actual keys)
    const { data: apiKeys } = await supabase
      .from('user_api_keys')
      .select('service_provider, key_last_4, verified, created_at')
      .eq('user_id', userId);
    userData.api_keys = apiKeys || [];

    // Audit logs (last 90 days only)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select('action, resource_type, created_at, metadata')
      .eq('user_id', userId)
      .gte('created_at', ninetyDaysAgo.toISOString());
    userData.audit_logs = auditLogs || [];

    return userData;
  }

  // Automated data deletion based on retention policies
  static async cleanupExpiredData(): Promise<void> {
    const now = new Date().toISOString();

    // Delete data processing records that have exceeded retention
    const { data: expiredRecords } = await supabase
      .from('data_processing_records')
      .select('*')
      .lte('scheduled_deletion_date', now);

    for (const record of expiredRecords || []) {
      await this.deleteSpecificUserData(record.user_id, record.data_type);
    }

    // Clean up users scheduled for deletion
    const { data: usersToDelete } = await supabase
      .from('profiles')
      .select('user_id')
      .lte('scheduled_for_deletion', now)
      .not('scheduled_for_deletion', 'is', null);

    for (const user of usersToDelete || []) {
      await this.deleteAllUserData(user.user_id);
    }
  }

  private static async deleteSpecificUserData(userId: string, dataType: string): Promise<void> {
    switch (dataType) {
      case 'audit_logs':
        await supabase.from('audit_logs').delete().eq('user_id', userId);
        break;
      case 'job_results':
        const { data: userJobs } = await supabase
          .from('jobs')
          .select('id')
          .eq('user_id', userId);
        
        if (userJobs?.length) {
          await supabase
            .from('results')
            .delete()
            .in('job_id', userJobs.map(j => j.id));
        }
        break;
      // Add other data types as needed
    }
  }

  private static async deleteAllUserData(userId: string): Promise<void> {
    // Delete in order to respect foreign key constraints
    const { data: userJobs } = await supabase
      .from('jobs')
      .select('id')
      .eq('user_id', userId);

    if (userJobs?.length) {
      await supabase.from('results').delete().in('job_id', userJobs.map(j => j.id));
    }

    await supabase.from('jobs').delete().eq('user_id', userId);
    await supabase.from('user_quotas').delete().eq('user_id', userId);
    await supabase.from('user_api_keys').delete().eq('user_id', userId);
    await supabase.from('user_consents').delete().eq('user_id', userId);
    await supabase.from('data_processing_records').delete().eq('user_id', userId);
    await supabase.from('audit_logs').delete().eq('user_id', userId);
    
    // Finally delete the profile
    await supabase.from('profiles').delete().eq('user_id', userId);
  }
}

// /components/gdpr/cookie-banner.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ConsentManager } from '@/lib/gdpr/consent-manager';
import { X, Settings } from 'lucide-react';

interface CookieConsentBannerProps {
  appSlug: string;
  onConsentGiven?: (consents: Record<string, boolean>) => void;
}

export function CookieConsentBanner({ appSlug, onConsentGiven }: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consents, setConsents] = useState({
    necessary: true, // Always true, non-optional
    functional: false,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem(`gdpr_consent_${appSlug}`);
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, [appSlug]);

  const handleAcceptAll = async () => {
    const allConsents = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };

    await saveConsents(allConsents);
    setShowBanner(false);
  };

  const handleAcceptSelected = async () => {
    await saveConsents(consents);
    setShowBanner(false);
  };

  const handleRejectAll = async () => {
    const minimalConsents = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };

    await saveConsents(minimalConsents);
    setShowBanner(false);
  };

  const saveConsents = async (consentData: Record<string, boolean>) => {
    try {
      // Save to localStorage
      localStorage.setItem(`gdpr_consent_${appSlug}`, JSON.stringify(consentData));

      // Save to database for registered users
      const email = localStorage.getItem('user_email'); // Or get from auth context
      if (email) {
        for (const [type, given] of Object.entries(consentData)) {
          await ConsentManager.recordConsent(email, {
            type: type as any,
            given,
            method: 'cookie_banner',
            appSlug,
            legalBasis: type === 'necessary' ? 'legal_obligation' : 'consent',
            ipAddress: await getUserIP(),
            userAgent: navigator.userAgent
          });
        }
      }

      onConsentGiven?.(consentData);
    } catch (error) {
      console.error('Failed to save consents:', error);
    }
  };

  const getUserIP = async (): Promise<string | undefined> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return undefined;
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/50 backdrop-blur-sm">
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">🍪 Cookie Preferences</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBanner(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            We use cookies to improve your experience and analyze our traffic. 
            You can choose which cookies you're comfortable with.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!showDetails ? (
            // Simple banner
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 text-sm">
                We respect your privacy. Choose how you want us to use cookies to enhance your experience.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRejectAll}>
                  Reject All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDetails(true)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Customize
                </Button>
                <Button size="sm" onClick={handleAcceptAll}>
                  Accept All
                </Button>
              </div>
            </div>
          ) : (
            // Detailed preferences
            <div className="space-y-4">
              <div className="grid gap-4">
                {/* Necessary Cookies */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="necessary"
                    checked={true}
                    disabled={true}
                  />
                  <div className="flex-1">
                    <label htmlFor="necessary" className="text-sm font-medium">
                      Necessary Cookies (Required)
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Essential for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="functional"
                    checked={consents.functional}
                    onCheckedChange={(checked) => 
                      setConsents(prev => ({ ...prev, functional: !!checked }))
                    }
                  />
                  <div className="flex-1">
                    <label htmlFor="functional" className="text-sm font-medium">
                      Functional Cookies
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Remember your preferences and settings for a better experience.
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="analytics"
                    checked={consents.analytics}
                    onCheckedChange={(checked) => 
                      setConsents(prev => ({ ...prev, analytics: !!checked }))
                    }
                  />
                  <div className="flex-1">
                    <label htmlFor="analytics" className="text-sm font-medium">
                      Analytics Cookies
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Help us understand how you use our site to improve performance.
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="marketing"
                    checked={consents.marketing}
                    onCheckedChange={(checked) => 
                      setConsents(prev => ({ ...prev, marketing: !!checked }))
                    }
                  />
                  <div className="flex-1">
                    <label htmlFor="marketing" className="text-sm font-medium">
                      Marketing Cookies
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Used to show you relevant ads and track campaign performance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDetails(false)}
                >
                  Back
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={handleRejectAll}>
                    Reject All
                  </Button>
                  <Button size="sm" onClick={handleAcceptSelected}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            By continuing to use our service, you agree to our{' '}
            <a href="/privacy-policy" className="underline hover:no-underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/cookie-policy" className="underline hover:no-underline">
              Cookie Policy
            </a>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  );
}