import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token =
    searchParams.get("token_hash") ||
    searchParams.get("token") ||
    searchParams.get("code");
  const emailParam = searchParams.get("email");
  const cookieStore = await cookies();
  const cookieEmail = cookieStore.get("pv_magic_email")?.value || "";
  const email = emailParam || cookieEmail || undefined;
  const type = (searchParams.get("type") as any) || "magiclink";
  const nextParam = searchParams.get("next");
  const cookieNext = cookieStore.get("pv_magic_next")?.value || "";
  const next = nextParam || cookieNext || "/risorse-base";

  if (!token) {
    return NextResponse.redirect(new URL("/unlock", req.url));
  }

  const supabase = await createClient();

  // Try to verify if we have the email; otherwise skip verification and proceed to set cookie
  if (email) {
    try {
      await supabase.auth.verifyOtp({
        email,
        token,
        type,
      });
    } catch (err) {
      console.error("verifyOtp failed, proceeding to set pv_free:", err);
    }
  }

  let redirectTarget: URL;
  try {
    redirectTarget = new URL(next, req.url);
  } catch {
    redirectTarget = new URL("/risorse-base", req.url);
  }

  const res = NextResponse.redirect(redirectTarget);
  // clear temp cookies
  res.cookies.set("pv_magic_email", "", { path: "/", maxAge: 0 });
  res.cookies.set("pv_magic_next", "", { path: "/", maxAge: 0 });
  res.cookies.set("pv_free", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 180,
    path: "/",
  });

  return res;
}
