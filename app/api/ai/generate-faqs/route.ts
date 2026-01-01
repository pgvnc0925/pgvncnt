import { NextRequest, NextResponse } from "next/server";
import { generateFAQs } from "@/lib/ai/openai-client";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "pv_admin_session";

/**
 * API Route: Generate FAQs using OpenAI
 * POST /api/ai/generate-faqs
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const adminSecret = process.env.ADMIN_PASSWORD;
    const cookieStore = await cookies();
    const currentToken = cookieStore.get(ADMIN_COOKIE)?.value;
    const hasAccess = !!adminSecret && currentToken === adminSecret;

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, description, content, count = 5 } = body;

    // Validation
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string" },
        { status: 400 }
      );
    }

    if ((!description || typeof description !== "string") && (!content || typeof content !== "string")) {
      return NextResponse.json(
        { error: "Either description or content must be provided" },
        { status: 400 }
      );
    }

    if (typeof count !== "number" || count < 1 || count > 10) {
      return NextResponse.json(
        { error: "Count must be a number between 1 and 10" },
        { status: 400 }
      );
    }

    // Generate FAQs
    const result = await generateFAQs(
      title,
      description || "",
      content || "",
      count
    );

    // Check for errors
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Return generated FAQs
    return NextResponse.json({
      faqs: result.faqs,
      count: result.faqs.length,
    });
  } catch (error) {
    console.error("Error in generate-faqs API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
