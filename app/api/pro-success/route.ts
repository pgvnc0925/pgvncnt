import { NextResponse } from "next/server";

const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/welcome-pro", siteUrl));
  res.cookies.set("pv_pro", "true", {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  res.cookies.set("pv_free", "true", {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return res;
}
