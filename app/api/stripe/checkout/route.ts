// Placeholder handler to avoid missing deps; Stripe integration disabled here.
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/abbonati', request.url));
}
