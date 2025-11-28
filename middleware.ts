import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASE_PATH = "/risorse-base";
const PRO_PATH = "/pro";
const UNLOCK_PATH = "/unlock";
const ABBONATI_PATH = "/abbonati";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pvFree = req.cookies.get("pv_free");
  const pvPro = req.cookies.get("pv_pro");

  if (url.pathname.startsWith(PRO_PATH)) {
    if (!pvPro) {
      url.pathname = ABBONATI_PATH;
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith(BASE_PATH)) {
    if (!pvFree && !pvPro) {
      const next = req.nextUrl.pathname + (req.nextUrl.search || "");
      url.pathname = UNLOCK_PATH;
      url.searchParams.set("next", next);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pro/:path*", "/risorse-base/:path*"],
};
