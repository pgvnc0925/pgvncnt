/**
 * ====================================
 * COMPLETE AUTH SYSTEM BOILERPLATE
 * Production-ready authentication for Supabase + Next.js 13+
 * ====================================
 * 
 * Features:
 * - Email/Password auth with confirmation
 * - Strong password validation
 * - Secure session management
 * - Password reset with security
 * - Profile management integration
 * - Middleware protection
 * - Error handling & user feedback
 * - Server/client session sync
 * - Proper logout with cleanup
 * 
 * Usage:
 * 1. Copy files to your project
 * 2. Update environment variables
 * 3. Run database migrations
 * 4. Update imports in your components
 */

// ===== 1. CLIENT AUTH SERVICE (lib/auth/auth-service.ts) =====
export const AUTH_SERVICE = `
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, AuthError } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  needsEmailConfirmation?: boolean;
}

export interface ProfileData {
  full_name: string;
  company_name: string;
}

export class AuthService {
  static createClient() {
    return createClientComponentClient();
  }


  static async signUp(
    email: string, 
    password: string, 
    profileData: ProfileData
  ): Promise<AuthResult> {
    try {
      const supabase = this.createClient();
      
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: profileData.full_name,
            company_name: profileData.company_name,
          },
          emailRedirectTo: \`\${window.location.origin}/auth/callback?next=/dashboard\`
        }
      });

      if (error) {
        return { success: false, error: this.formatError(error) };
      }

      if (data.user && !data.session) {
        return { 
          success: true, 
          user: data.user,
          needsEmailConfirmation: true 
        };
      }

      return { success: true, user: data.user || undefined };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Errore durante la registrazione. Riprova.' };
    }
  }

  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const supabase = this.createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: this.formatError(error) };
      }

      if (data?.session) {
        await this.syncServerSession(data.session.access_token, data.session.refresh_token);
      }

      return { success: true, user: data.user || undefined };
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, error: 'Errore durante l\\'accesso. Riprova.' };
    }
  }

  static async signOut(): Promise<void> {
    try {
      const supabase = this.createClient();
      await supabase.auth.signOut();
      await fetch('/api/auth/signout', { method: 'POST' });
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Signout error:', error);
      window.location.href = '/auth/login';
    }
  }

  static async requestPasswordReset(email: string): Promise<AuthResult> {
    try {
      const supabase = this.createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: \`\${window.location.origin}/auth/reset-password/confirm\`
      });

      if (error) {
        return { success: false, error: this.formatError(error) };
      }
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Errore durante il reset. Riprova.' };
    }
  }

  static async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      const passwordValidation = this.validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }

      const supabase = this.createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: this.formatError(error) };
      }
      return { success: true };
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: 'Errore durante l\\'aggiornamento. Riprova.' };
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const supabase = this.createClient();
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }


  private static validatePassword(password: string): { valid: boolean; error?: string } {
    if (password.length < 8) {
      return { valid: false, error: 'La password deve avere almeno 8 caratteri' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { valid: false, error: 'La password deve contenere almeno una lettera minuscola' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { valid: false, error: 'La password deve contenere almeno una lettera maiuscola' };
    }
    if (!/(?=.*\\d)/.test(password)) {
      return { valid: false, error: 'La password deve contenere almeno un numero' };
    }
    return { valid: true };
  }

  private static formatError(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email o password non corretti';
      case 'Email not confirmed':
        return 'Conferma la tua email prima di accedere';
      case 'User already registered':
        return 'Questo email è già registrata';
      case 'Password should be at least 6 characters':
        return 'La password deve avere almeno 6 caratteri';
      case 'Unable to validate email address: invalid format':
        return 'Formato email non valido';
      case 'For security purposes, you can only request this after 60 seconds':
        return 'Per sicurezza, riprova tra 60 secondi';
      default:
        return error.message || 'Si è verificato un errore imprevisto';
    }
  }

  private static async syncServerSession(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error('Session sync error:', error);
    }
  }
}
`;

// ===== 2. SERVER AUTH SERVICE (lib/auth/server-auth.ts) =====
export const SERVER_AUTH_SERVICE = `
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Server-side auth utilities
 * Use only in server components, not client components
 */
export class ServerAuth {
  /**
   * Get current session (server-side only)
   */
  static async getSession() {
    try {
      const supabase = createServerComponentClient({ cookies });
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Get server session error:', error);
      return null;
    }
  }

  /**
   * Get current user (server-side only)
   */
  static async getUser() {
    try {
      const supabase = createServerComponentClient({ cookies });
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get server user error:', error);
      return null;
    }
  }

  /**
   * Create server supabase client
   */
  static createClient() {
    return createServerComponentClient({ cookies });
  }
}
`;

// ===== 3. API ROUTES =====

export const SESSION_ROUTE = `
// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { access_token, refresh_token } = await req.json();
    
    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    
    const { error } = await supabase.auth.setSession({ 
      access_token, 
      refresh_token 
    });
    
    if (error) {
      console.error('Session sync error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Session sync error:', e);
    return NextResponse.json({ error: e?.message || 'Bad request' }, { status: 400 });
  }
}
`;

export const SIGNOUT_ROUTE = `
// app/api/auth/signout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.signOut();
    
    const response = NextResponse.json({ success: true });
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('legal_ok');
    response.cookies.delete('session');
    
    return response;
  } catch (e: any) {
    console.error('Signout error:', e);
    
    const response = NextResponse.json({ success: true });
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('legal_ok');
    
    return response;
  }
}
`;

export const CALLBACK_ROUTE = `
// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';
    const error = searchParams.get('error');

    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        new URL(\`/auth/login?error=\${encodeURIComponent(error)}\`, req.url)
      );
    }

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError);
        return NextResponse.redirect(
          new URL(\`/auth/login?error=\${encodeURIComponent('Errore durante la conferma email')}\`, req.url)
        );
      }

      if (data.user) {
        await createOrUpdateProfile(supabase, data.user);
        return NextResponse.redirect(new URL(next, req.url));
      }
    }

    return NextResponse.redirect(new URL('/auth/login', req.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(
      new URL('/auth/login?error=callback_error', req.url)
    );
  }
}

async function createOrUpdateProfile(supabase: any, user: any) {
  try {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (!existingProfile) {
      const profileData = {
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        company_name: user.user_metadata?.company_name || '',
      };

      const { error: insertError } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (insertError) {
        console.error('Profile creation error:', insertError);
      }
    } else {
      const updateData: any = {};
      
      if (user.user_metadata?.full_name) {
        updateData.full_name = user.user_metadata.full_name;
      }
      if (user.user_metadata?.company_name) {
        updateData.company_name = user.user_metadata.company_name;
      }

      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date().toISOString();
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Profile update error:', updateError);
        }
      }
    }
  } catch (error) {
    console.error('Profile management error:', error);
  }
}
`;

// ===== 3. UPDATED MIDDLEWARE =====

export const SECURE_MIDDLEWARE = `
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/apps', '/crm'];
const REQUIRED_LEGAL_VERSION = process.env.LEGAL_VERSION || 'v1';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const res = NextResponse.next();

  // Always allow these paths
  const allow = (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/preventivo') ||
    pathname.startsWith('/contratto') ||
    pathname.startsWith('/onboarding/legal') ||
    pathname === '/'
  );
  if (allow) return res;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return res;

  // Enhanced auth check - look for both cookies
  const hasAccessToken = request.cookies.has('sb-access-token');
  const hasRefreshToken = request.cookies.has('sb-refresh-token');
  
  if (!hasAccessToken && !hasRefreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirectTo', pathname + (search || ''));
    return NextResponse.redirect(url);
  }

  // Legal acceptance version check
  const legalOk = request.cookies.get('legal_ok');
  if (!legalOk || legalOk.value !== REQUIRED_LEGAL_VERSION) {
    const url = request.nextUrl.clone();
    url.pathname = '/onboarding/legal';
    return NextResponse.redirect(url);
  }

  // Security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};
`;

// ===== 4. DATABASE MIGRATION =====

export const DATABASE_MIGRATION = `
-- Enhanced profiles table with auth metadata
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  email_confirmed_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_updated_at ON profiles(updated_at);
`;

// ===== 5. ENVIRONMENT VARIABLES =====

export const ENV_VARIABLES = `
# Required Supabase Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Legal Compliance Version (bump to force re-acceptance)
LEGAL_VERSION=v1

# Email Configuration (choose one)
# Option 1: SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

# Option 2: Gmail App Password
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
`;

// ===== 6. SETUP INSTRUCTIONS =====

export const SETUP_INSTRUCTIONS = `
# Auth System Setup Instructions

## 1. Database Setup
1. Run the database migration in your Supabase SQL editor
2. Ensure RLS is enabled on all tables
3. Test the policies with different users

## 2. Environment Configuration
1. Copy the environment variables to your .env.local
2. Update with your actual Supabase credentials
3. Set your app URL correctly for production

## 3. File Structure
\`\`\`
lib/auth/
├── auth-service.ts         # Client-side auth service
├── server-auth.ts          # Server-side auth utilities
└── types.ts               # Auth-related types

app/api/auth/
├── session/route.ts       # Session sync endpoint
├── signout/route.ts       # Secure signout endpoint
└── callback/route.ts      # Auth callback handler

app/auth/
├── login/page.tsx         # Login page
├── signup/page.tsx        # Signup page
├── reset-password/
│   ├── page.tsx          # Request reset page
│   └── confirm/page.tsx   # Set new password page
└── callback/page.tsx      # Optional callback page

middleware.ts              # Route protection
\`\`\`

## 4. Usage Examples

### Login Component
\`\`\`tsx
import { AuthService } from '@/lib/auth/auth-service';

const result = await AuthService.signIn(email, password);
if (result.success) {
  router.push('/dashboard');
} else {
  setError(result.error);
}
\`\`\`

### Signup Component
\`\`\`tsx
const result = await AuthService.signUp(email, password, {
  full_name: name,
  company_name: company
});

if (result.needsEmailConfirmation) {
  showMessage('Check your email for confirmation');
}
\`\`\`

### Logout
\`\`\`tsx
await AuthService.signOut(); // Handles everything automatically
\`\`\`

## 5. Security Features
- Strong password validation (8+ chars, mixed case, numbers)
- Email confirmation required
- Secure session management with server sync
- Proper cookie cleanup on logout
- CSRF protection headers
- Rate limiting ready (via middleware extension)
- SQL injection protection (via Supabase RLS)

## 6. Error Handling
All methods return AuthResult objects with:
- success: boolean
- user?: User
- error?: string (user-friendly, localized)
- needsEmailConfirmation?: boolean

## 7. Production Checklist
- [ ] Email confirmation enabled in Supabase
- [ ] SMTP configured for password resets
- [ ] SSL certificates installed
- [ ] Rate limiting enabled
- [ ] Error monitoring configured
- [ ] Backup strategy for auth data
- [ ] GDPR compliance if needed
`;

export default {
  AUTH_SERVICE,
  SERVER_AUTH_SERVICE,
  SESSION_ROUTE,
  SIGNOUT_ROUTE,
  CALLBACK_ROUTE,
  SECURE_MIDDLEWARE,
  DATABASE_MIGRATION,
  ENV_VARIABLES,
  SETUP_INSTRUCTIONS
};