import { NextResponse } from "next/server";
import { saveSessionData } from "@/lib/evaluation/storage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uuid, answers, scores, email, name } = body || {};

    if (!uuid || !answers || !scores) {
      return NextResponse.json({ ok: false, message: "Missing uuid/answers/scores" }, { status: 400 });
    }

    const result = await saveSessionData({ uuid, answers, scores, email, name });
    return NextResponse.json(result);
  } catch (err) {
    console.error("save-session error", err);
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }
}
