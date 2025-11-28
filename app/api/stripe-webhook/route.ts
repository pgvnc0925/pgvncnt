import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  // Placeholder webhook handler; real Stripe integration disabled in offline mode.
  return NextResponse.json({ received: true });
}
