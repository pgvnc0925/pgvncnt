// ====================================
// UNIVERSAL SAAS BOILERPLATE v1.0
// Enterprise-Grade Multi-App Foundation
// ====================================

// /config/app-types.ts
export const APP_TYPES = {
  LEAD_MAGNET: 'lead_magnet',
  FREEMIUM: 'freemium', 
  PREMIUM: 'premium'
} as const;

export type AppType = typeof APP_TYPES[keyof typeof APP_TYPES];

// /config/apps.config.ts
interface AppConfig {
  type: AppType;
  billing?: {
    model: 'hybrid' | 'subscription' | 'tokens';
    plans: PlanConfig[];
  };
  api_requirements?: {
    providers: string[];
    daily_limit?: number;
  };
  conversion?: {
    target_app: string;
    email_sequence: string;
  };
}

export const APPS_CONFIG: Record<string, AppConfig> = {
  'keyword-research-free': {
    type: APP_TYPES.LEAD_MAGNET,
    api_requirements: {
      providers: ['openai'],
      daily_limit: 5
    },
    conversion: {
      target_app: 'competitor-analyzer-pro',
      email_sequence: 'keyword_nurture'
    }
  },
  'gmaps-leads-pro': {
    type: APP_TYPES.FREEMIUM,
    billing: {
      model: 'hybrid',
      plans: [
        { 
          id: 'free', 
          monthly_quota: 3, 
          price: 0,
          features: ['basic_search', 'limited_results']
        },
        { 
          id: 'pro1', 
          monthly_quota: 30, 
          price: 19,
          features: ['advanced_search', 'csv_export', 'full_results']
        },
        { 
          id: 'pro2', 
          monthly_quota: 100, 
          price: 49,
          features: ['enterprise_search', 'all_exports', 'team_sharing', 'api_access']
        }
      ]
    }
  }
};

// /types/index.ts
export interface User {
  id: string;
  email: string;
  created_at: string;
  email_verified: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan: 'free' | 'pro1' | 'pro2' | 'enterprise';
  role: 'user' | 'admin' | 'super_admin';
  team_id?: string;
  permissions: Record<string, any>;
  onboarding_completed: boolean;
  preferences: {
    timezone: string;
    language: string;
    email_notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  created_at: string;
  updated_at: string;
}

export interface PlanConfig {
  id: string;
  name: string;
  monthly_quota: number;
  price: number;
  features: string[];
  token_price?: number;
  max_team_members?: number;
}

export interface UserQuota {
  id: string;
  user_id: string;
  app_slug: string;
  monthly_quota: number;
  bonus_tokens: number;
  tokens_expiry?: string;
  used_this_month: number;
  reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface UserApiKey {
  id: string;
  user_id: string;
  email: string;
  service_provider: string;
  key_hash: string;
  key_last_4: string;
  verified: boolean;
  last_used_at?: string;
  created_at: string;
}

export interface LeadMagnetUser {
  id: string;
  email: string;
  app_slug: string;
  api_key_hash: string;
  usage_count: number;
  first_used_at: string;
  last_used_at: string;
  converted_to_paid: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// /lib/database/schema.sql
-- CORE USER MANAGEMENT
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro1', 'pro2', 'enterprise')),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  permissions JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{
    "timezone": "UTC",
    "language": "en", 
    "email_notifications": true,
    "theme": "system"
  }',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TEAM MANAGEMENT (B2B)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- BILLING & SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- USAGE & QUOTA MANAGEMENT
CREATE TABLE user_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  app_slug TEXT NOT NULL,
  monthly_quota INTEGER NOT NULL DEFAULT 0,
  bonus_tokens INTEGER NOT NULL DEFAULT 0,
  tokens_expiry TIMESTAMPTZ,
  used_this_month INTEGER NOT NULL DEFAULT 0,
  reset_date TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', NOW() + interval '1 month'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, app_slug)
);

-- API KEY MANAGEMENT (for lead magnet apps)
CREATE TABLE user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  email TEXT NOT NULL, -- For non-registered users
  service_provider TEXT NOT NULL, -- 'openai', 'google_maps', etc.
  key_hash TEXT NOT NULL,
  key_last_4 TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, service_provider)
);

-- LEAD MAGNET TRACKING
CREATE TABLE lead_magnet_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  app_slug TEXT NOT NULL,
  api_key_hash TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  first_used_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  converted_to_paid BOOLEAN DEFAULT FALSE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  UNIQUE(email, app_slug)
);

-- CONVERSION TRACKING
CREATE TABLE lead_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  from_app TEXT NOT NULL,
  to_app TEXT NOT NULL,
  conversion_value DECIMAL(10,2),
  converted_at TIMESTAMPTZ DEFAULT NOW()
);

-- EMAIL SEQUENCES
CREATE TABLE email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_slug TEXT NOT NULL,
  sequence_type TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  days_delay INTEGER NOT NULL,
  email_template TEXT NOT NULL,
  conversion_goal TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOGGING
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE SET NULL,
  app_slug TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnet_users ENABLE ROW LEVEL SECURITY;

-- Core RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own quotas" ON user_quotas
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Team members can view team data" ON team_members
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT user_id FROM team_members tm 
      WHERE tm.team_id = team_members.team_id AND tm.role IN ('owner', 'admin')
    )
  );

// /lib/auth/auth-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Create profile if doesn't exist
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({ 
              user_id: userId,
              email: user?.email || ''
            })
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    setProfile(data);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile, 
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// /lib/billing/billing-service.ts
import { supabase } from '@/lib/supabase/client';
import { UserQuota } from '@/types';
import { APPS_CONFIG } from '@/config/apps.config';

export class BillingService {
  static async getUserQuota(userId: string, appSlug: string): Promise<UserQuota | null> {
    const { data, error } = await supabase
      .from('user_quotas')
      .select('*')
      .eq('user_id', userId)
      .eq('app_slug', appSlug)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }

  static async initializeUserQuota(userId: string, appSlug: string, plan: string) {
    const appConfig = APPS_CONFIG[appSlug];
    if (!appConfig?.billing) return;

    const planConfig = appConfig.billing.plans.find(p => p.id === plan);
    if (!planConfig) return;

    const { data, error } = await supabase
      .from('user_quotas')
      .upsert({
        user_id: userId,
        app_slug: appSlug,
        monthly_quota: planConfig.monthly_quota,
        bonus_tokens: 0,
        used_this_month: 0,
        reset_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async canUseService(userId: string, appSlug: string, cost: number = 1) {
    const quota = await this.getUserQuota(userId, appSlug);
    if (!quota) return { allowed: false, reason: 'no_quota' };

    // Check if need to reset monthly quota
    if (new Date() >= new Date(quota.reset_date)) {
      await this.resetMonthlyQuota(userId, appSlug);
      quota.used_this_month = 0;
    }

    // Check monthly quota first
    if (quota.used_this_month + cost <= quota.monthly_quota) {
      return { allowed: true, source: 'monthly' };
    }

    // Check bonus tokens
    if (quota.bonus_tokens >= cost && 
        (!quota.tokens_expiry || new Date() < new Date(quota.tokens_expiry))) {
      return { allowed: true, source: 'bonus_tokens' };
    }

    return { 
      allowed: false, 
      reason: 'quota_exceeded',
      remainingMonthly: Math.max(0, quota.monthly_quota - quota.used_this_month),
      remainingTokens: quota.bonus_tokens || 0
    };
  }

  static async consumeQuota(userId: string, appSlug: string, cost: number = 1) {
    const canUse = await this.canUseService(userId, appSlug, cost);
    if (!canUse.allowed) {
      throw new Error(`Quota exceeded: ${canUse.reason}`);
    }

    const quota = await this.getUserQuota(userId, appSlug);
    if (!quota) throw new Error('No quota found');

    let updateData: Partial<UserQuota> = {};

    if (canUse.source === 'monthly') {
      updateData.used_this_month = quota.used_this_month + cost;
    } else if (canUse.source === 'bonus_tokens') {
      updateData.bonus_tokens = quota.bonus_tokens - cost;
    }

    const { error } = await supabase
      .from('user_quotas')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('app_slug', appSlug);

    if (error) throw error;

    // Log usage for analytics
    await this.logUsage(userId, appSlug, cost, canUse.source);
  }

  static async addBonusTokens(userId: string, appSlug: string, tokens: number, expiryMonths: number = 6) {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + expiryMonths);

    const { data, error } = await supabase
      .from('user_quotas')
      .update({
        bonus_tokens: supabase.raw('bonus_tokens + ?', [tokens]),
        tokens_expiry: expiryDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('app_slug', appSlug)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private static async resetMonthlyQuota(userId: string, appSlug: string) {
    const nextResetDate = new Date();
    nextResetDate.setMonth(nextResetDate.getMonth() + 1, 1);
    nextResetDate.setHours(0, 0, 0, 0);

    const { error } = await supabase
      .from('user_quotas')
      .update({
        used_this_month: 0,
        reset_date: nextResetDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('app_slug', appSlug);

    if (error) throw error;
  }

  private static async logUsage(userId: string, appSlug: string, cost: number, source: string) {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        app_slug: appSlug,
        action: 'quota_consumed',
        resource_type: 'usage',
        metadata: { cost, source }
      });
  }

  static async getUsageAnalytics(userId: string, appSlug: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('app_slug', appSlug)
      .eq('action', 'quota_consumed')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

// /lib/lead-magnet/lead-service.ts
import { supabase } from '@/lib/supabase/client';
import { LeadMagnetUser, UserApiKey } from '@/types';
import crypto from 'crypto';

export class LeadMagnetService {
  static async trackLeadUsage(
    email: string, 
    appSlug: string, 
    apiKeyHash: string,
    utmData?: { source?: string; medium?: string; campaign?: string }
  ) {
    const { data, error } = await supabase
      .from('lead_magnet_users')
      .upsert({
        email,
        app_slug: appSlug,
        api_key_hash: apiKeyHash,
        usage_count: supabase.raw('COALESCE(usage_count, 0) + 1'),
        last_used_at: new Date().toISOString(),
        utm_source: utmData?.source,
        utm_medium: utmData?.medium,
        utm_campaign: utmData?.campaign
      }, {
        onConflict: 'email,app_slug'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async canUseFreeService(email: string, appSlug: string): Promise<{
    allowed: boolean;
    dailyUsage: number;
    dailyLimit: number;
  }> {
    const appConfig = APPS_CONFIG[appSlug];
    const dailyLimit = appConfig?.api_requirements?.daily_limit || 5;

    // Get today's usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('app_slug', appSlug)
      .eq('metadata->>email', email)
      .gte('created_at', today.toISOString());

    if (error) throw error;

    const dailyUsage = data?.length || 0;
    
    return {
      allowed: dailyUsage < dailyLimit,
      dailyUsage,
      dailyLimit
    };
  }

  static async storeApiKey(
    email: string, 
    serviceProvider: string, 
    apiKey: string,
    userId?: string
  ): Promise<UserApiKey> {
    // Hash the API key for secure storage
    const keyHash = crypto
      .createHash('sha256')
      .update(apiKey + process.env.API_KEY_SALT)
      .digest('hex');
    
    const keyLast4 = apiKey.slice(-4);

    // Test API key validity
    const isValid = await this.validateApiKey(serviceProvider, apiKey);
    
    const { data, error } = await supabase
      .from('user_api_keys')
      .upsert({
        user_id: userId,
        email,
        service_provider: serviceProvider,
        key_hash: keyHash,
        key_last_4: keyLast4,
        verified: isValid
      }, {
        onConflict: 'email,service_provider'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private static async validateApiKey(provider: string, apiKey: string): Promise<boolean> {
    try {
      switch (provider) {
        case 'openai':
          const openaiResponse = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          });
          return openaiResponse.ok;

        case 'google_maps':
          const mapsResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${apiKey}`
          );
          const mapsData = await mapsResponse.json();
          return !mapsData.error_message;

        default:
          return false;
      }
    } catch (error) {
      console.error(`API key validation failed for ${provider}:`, error);
      return false;
    }
  }

  static async getApiKey(email: string, serviceProvider: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('key_hash')
      .eq('email', email)
      .eq('service_provider', serviceProvider)
      .eq('verified', true)
      .single();

    if (error || !data) return null;

    // In production, you'd decrypt this properly
    // This is a simplified example
    return data.key_hash;
  }

  static async trackConversion(email: string, fromApp: string, toApp: string, value?: number) {
    const { error } = await supabase
      .from('lead_conversions')
      .insert({
        email,
        from_app: fromApp,
        to_app: toApp,
        conversion_value: value
      });

    if (error) throw error;

    // Update lead magnet user record
    await supabase
      .from('lead_magnet_users')
      .update({ converted_to_paid: true })
      .eq('email', email)
      .eq('app_slug', fromApp);
  }
}
