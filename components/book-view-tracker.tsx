"use client";

import { useEffect } from "react";

interface BookViewTrackerProps {
  bookSlug: string;
}

export function BookViewTracker({ bookSlug }: BookViewTrackerProps) {
  useEffect(() => {
    // Track book view on client side
    async function trackView() {
      try {
        await fetch("/api/track-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: bookSlug }),
        });
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    }

    trackView();
  }, [bookSlug]);

  return null; // This component renders nothing
}
