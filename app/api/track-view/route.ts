import { NextRequest, NextResponse } from "next/server";
import { markBookViewed } from "@/lib/user-progress";

// In-memory view count storage (resets on server restart)
// In production, this should be stored in a database
const viewCounts = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    // Track the book view for the user
    await markBookViewed(slug);

    // Increment global view count
    const currentCount = viewCounts.get(slug) || 0;
    viewCounts.set(slug, currentCount + 1);

    return NextResponse.json({
      success: true,
      viewCount: viewCounts.get(slug)
    });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}

// GET endpoint to retrieve view counts
export async function GET() {
  const counts: Record<string, number> = {};
  viewCounts.forEach((count, slug) => {
    counts[slug] = count;
  });
  return NextResponse.json(counts);
}
