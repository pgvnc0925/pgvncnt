// ====================================
// UNIVERSAL COMPONENTS LIBRARY
// Reusable UI Components for All Apps
// ====================================

// /components/auth/login-form.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  redirectTo?: string;
  mode?: 'signin' | 'signup';
  onModeChange?: (mode: 'signin' | 'signup') => void;
}

export function LoginForm({ redirectTo = '/dashboard', mode = 'signin', onModeChange }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        window.location.href = redirectTo;
      } else {
        await signUp(email, password);
        setSuccess('Check your email for the confirmation link!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'signin' ? 'Sign In' : 'Create Account'}</CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Enter your credentials to access your account' 
            : 'Sign up to get started with your free account'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={mode === 'signin' ? 'Your password' : 'Create a password (min 6 chars)'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onModeChange?.('signup')}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onModeChange?.('signin')}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// /components/billing/plan-selector.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-provider';
import { BillingService } from '@/lib/billing/billing-service';
import { APPS_CONFIG } from '@/config/apps.config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanSelectorProps {
  appSlug: string;
  onPlanSelect?: (planId: string) => void;
  showCurrentPlan?: boolean;
}

export function PlanSelector({ appSlug, onPlanSelect, showCurrentPlan = true }: PlanSelectorProps) {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  
  const appConfig = APPS_CONFIG[appSlug];
  const plans = appConfig?.billing?.plans || [];

  const handleSelectPlan = async (planId: string) => {
    if (!user || loading) return;
    
    setLoading(planId);
    
    try {
      // Initialize quota for new plan
      await BillingService.initializeUserQuota(user.id, appSlug, planId);
      
      // Handle Stripe subscription creation for paid plans
      if (planId !== 'free') {
        // This would integrate with Stripe
        console.log('Creating Stripe subscription for plan:', planId);
      }
      
      onPlanSelect?.(planId);
    } catch (error) {
      console.error('Error selecting plan:', error);
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return profile?.plan === planId;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
      {plans.map((plan) => {
        const isCurrent = isCurrentPlan(plan.id);
        const isPopular = plan.id === 'pro1';
        
        return (
          <Card 
            key={plan.id} 
            className={cn(
              "relative",
              isCurrent && "ring-2 ring-blue-600",
              isPopular && "border-blue-200 shadow-lg scale-105"
            )}
          >
            {isPopular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
            )}
            
            {isCurrent && showCurrentPlan && (
              <Badge variant="secondary" className="absolute top-4 right-4">
                Current Plan
              </Badge>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize">{plan.name || plan.id}</span>
                {plan.id !== 'free' && <Zap className="h-5 w-5 text-yellow-500" />}
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">
                  {plan.price === 0 ? 'Free' : `€${plan.price}`}
                </span>
                {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>{plan.monthly_quota} {appSlug.includes('search') ? 'searches' : 'operations'} per month</span>
                </div>
                
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm capitalize">{feature.replace(/_/g, ' ')}</span>
                  </div>
                ))}
                
                {plan.token_price && (
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Extra operations: €{plan.token_price} each</span>
                  </div>
                )}
                
                {plan.max_team_members && (
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Up to {plan.max_team_members} team members</span>
                  </div>
                )}
              </div>

              <Button 
                className="w-full" 
                variant={isCurrent ? "secondary" : plan.id === 'pro1' ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading !== null || isCurrent}
              >
                {loading === plan.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCurrent 
                  ? 'Current Plan' 
                  : plan.price === 0 
                    ? 'Start Free' 
                    : `Upgrade to ${plan.name || plan.id}`
                }
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// /components/billing/usage-display.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-provider';
import { BillingService } from '@/lib/billing/billing-service';
import { UserQuota } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UsageDisplayProps {
  appSlug: string;
  showUpgradePrompts?: boolean;
  onUpgradeClick?: () => void;
}

export function UsageDisplay({ appSlug, showUpgradePrompts = true, onUpgradeClick }: UsageDisplayProps) {
  const { user } = useAuth();
  const [quota, setQuota] = useState<UserQuota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadQuota();
    }
  }, [user, appSlug]);

  const loadQuota = async () => {
    if (!user) return;
    
    try {
      const quotaData = await BillingService.getUserQuota(user.id, appSlug);
      setQuota(quotaData);
    } catch (error) {
      console.error('Error loading quota:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !quota) {
    return <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />;
  }

  const monthlyUsagePercent = (quota.used_this_month / quota.monthly_quota) * 100;
  const isNearLimit = monthlyUsagePercent > 80;
  const isOverLimit = quota.used_this_month >= quota.monthly_quota;

  const daysUntilReset = Math.ceil(
    (new Date(quota.reset_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Monthly Usage
            <span className="text-sm font-normal text-muted-foreground">
              Resets in {daysUntilReset} days
            </span>
          </CardTitle>
          <CardDescription>
            {quota.used_this_month} of {quota.monthly_quota} operations used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress 
            value={monthlyUsagePercent} 
            className={cn(
              "h-3",
              isOverLimit && "bg-red-100",
              isNearLimit && !isOverLimit && "bg-yellow-100"
            )}
          />
          
          <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
            <span>{quota.used_this_month} used</span>
            <span>{quota.monthly_quota - quota.used_this_month} remaining</span>
          </div>
        </CardContent>
      </Card>

      {quota.bonus_tokens > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 text-yellow-500 mr-2" />
              Bonus Tokens
            </CardTitle>
            <CardDescription>
              {quota.bonus_tokens} extra operations available
              {quota.tokens_expiry && (
                <span className="block">
                  Expires: {new Date(quota.tokens_expiry).toLocaleDateString()}
                </span>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {isOverLimit && showUpgradePrompts && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>You've reached your monthly limit.</span>
            <div className="space-x-2">
              <Button size="sm" variant="outline" onClick={onUpgradeClick}>
                Upgrade Plan
              </Button>
              <Button size="sm" onClick={() => {/* Handle token purchase */}}>
                <Plus className="h-4 w-4 mr-1" />
                Buy Tokens
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isNearLimit && !isOverLimit && showUpgradePrompts && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>You're running low on operations this month.</span>
            <Button size="sm" variant="outline" onClick={onUpgradeClick}>
              View Plans
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// /components/lead-magnet/api-key-input.tsx
'use client';

import { useState } from 'react';
import { LeadMagnetService } from '@/lib/lead-magnet/lead-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApiKeyInputProps {
  serviceProvider: 'openai' | 'google_maps' | 'serp';
  email: string;
  onApiKeyStored?: (success: boolean) => void;
}

const API_KEY_INFO = {
  openai: {
    name: 'OpenAI',
    placeholder: 'sk-...',
    helpUrl: 'https://platform.openai.com/api-keys',
    description: 'We need your OpenAI API key to analyze keywords and generate insights.'
  },
  google_maps: {
    name: 'Google Maps',
    placeholder: 'AIza...',
    helpUrl: 'https://console.cloud.google.com/google/maps-apis/credentials',
    description: 'We need your Google Maps API key to search for local businesses.'
  },
  serp: {
    name: 'SERP API',
    placeholder: 'xxx...',
    helpUrl: 'https://serpapi.com/manage-api-key',
    description: 'We need your SERP API key to fetch search engine results.'
  }
};

export function ApiKeyInput({ serviceProvider, email, onApiKeyStored }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const keyInfo = API_KEY_INFO[serviceProvider];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setLoading(true);
    setError('');

    try {
      await LeadMagnetService.storeApiKey(email, serviceProvider, apiKey.trim());
      setSuccess(true);
      setApiKey('');
      onApiKeyStored?.(true);
    } catch (err: any) {
      setError(err.message || 'Failed to validate API key');
      onApiKeyStored?.(false);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">{keyInfo.name} API key verified successfully!</span>
          </div>
          <p className="text-sm text-green-600 mt-2">
            You can now use the tool. Your API key is encrypted and secure.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Connect your {keyInfo.name} API</span>
        </CardTitle>
        <CardDescription>
          {keyInfo.description}
          {' '}
          <a 
            href={keyInfo.helpUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Get your API key here
          </a>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">{keyInfo.name} API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                placeholder={keyInfo.placeholder}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Your API key is secure</p>
                <p>We encrypt and hash your key. We never store it in plain text and only use it to make API calls on your behalf.</p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !apiKey.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify & Store API Key
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// /components/lead-magnet/daily-usage-counter.tsx
'use client';

import { useEffect, useState } from 'react';
import { LeadMagnetService } from '@/lib/lead-magnet/lead-service';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Clock } from 'lucide-react';

interface DailyUsageCounterProps {
  email: string;
  appSlug: string;
}

export function DailyUsageCounter({ email, appSlug }: DailyUsageCounterProps) {
  const [usage, setUsage] = useState<{
    dailyUsage: number;
    dailyLimit: number;
    allowed: boolean;
  } | null>(null);

  useEffect(() => {
    loadUsage();
  }, [email, appSlug]);

  const loadUsage = async () => {
    try {
      const usageData = await LeadMagnetService.canUseFreeService(email, appSlug);
      setUsage(usageData);
    } catch (error) {
      console.error('Error loading usage:', error);
    }
  };

  if (!usage) return null;

  const usagePercent = (usage.dailyUsage / usage.dailyLimit) * 100;
  const remaining = usage.dailyLimit - usage.dailyUsage;

  return (
    <Card className={`${!usage.allowed ? 'border-red-200 bg-red-50' : ''}`}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Daily Usage</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {usage.dailyUsage}/{usage.dailyLimit} used
          </span>
        </div>
        
        <Progress 
          value={usagePercent} 
          className={`h-2 ${!usage.allowed ? 'bg-red-100' : ''}`}
        />
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {remaining > 0 ? `${remaining} remaining today` : 'Daily limit reached'}
          </span>
          {!usage.allowed && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Limit reached</span>
            </div>
          )}
        </div>

        {!usage.allowed && (
          <div className="mt-3 p-2 bg-red-100 rounded-md">
            <p className="text-sm text-red-800">
              You've reached today's free limit. Usage resets at midnight UTC.
              Want unlimited access? Upgrade to our Pro plan!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
              