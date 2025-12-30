import { NextResponse } from "next/server";
import { recoverSessionByEmail, recoverSessionByUuid } from "@/lib/evaluation/storage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, uuid } = body || {};

    if (!email && !uuid) {
      return NextResponse.json({ ok: false, message: "Missing email or uuid" }, { status: 400 });
    }

    const result = email
      ? await recoverSessionByEmail(email)
      : await recoverSessionByUuid(uuid);

    return NextResponse.json(result);
  } catch (err) {
    console.error("recover-session error", err);
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }
}
