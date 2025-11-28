import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(_request: NextRequest) {
  return NextResponse.json({ received: true });
}
