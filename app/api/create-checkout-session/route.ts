import { NextResponse } from "next/server";

const priceId = process.env.STRIPE_PRICE_ID;
const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST() {
  if (!priceId) {
    return NextResponse.json({ error: "Stripe non configurato" }, { status: 500 });
  }

  // Offline/sandbox placeholder: skip real Stripe call
  const fakeUrl = `${siteUrl}/abbonati`;
  return NextResponse.json({ url: fakeUrl });
}
