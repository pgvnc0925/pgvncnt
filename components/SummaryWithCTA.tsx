import React from "react";
import NewsletterMiniCTA from "@/components/CTA/NewsletterMiniCTA";
import { UnlockCTA } from "@/components/CTA/UnlockCTA";
import { UpgradeProCTA } from "@/components/CTA/UpgradeProCTA";
import { BuyBookCTA } from "@/components/CTA/BuyBookCTA";
import { RelatedBooksCTA } from "@/components/CTA/RelatedBooksCTA";
import { ToolsCTA } from "@/components/CTA/ToolsCTA";
import { NextBookCTA } from "@/components/CTA/NextBookCTA";
import { DownloadCTA } from "@/components/CTA/DownloadCTA";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface SummaryWithCTAProps {
  mdxContent: string;
  bookSlug: string;
  bookTitle?: string;
  bookAuthor?: string;
  amazonLink?: string;
}

// CTA marker regex: {{CTA:type:param1:param2}}
const CTA_MARKER_REGEX = /\{\{CTA:([^}]+)\}\}/g;

export default async function SummaryWithCTA({
  mdxContent,
  bookSlug,
  bookTitle = "",
  bookAuthor = "",
  amazonLink = ""
}: SummaryWithCTAProps) {
  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    },
  };

  // Check if content has CTA markers
  const hasMarkers = CTA_MARKER_REGEX.test(mdxContent);

  if (!hasMarkers) {
    // Legacy behavior: auto-inject newsletter CTA at 30%
    const blocks = mdxContent.split(/\n\n+/);
    const total = blocks.length;
    const insertionIndex = Math.max(1, Math.floor(total * 0.3));
    const beforeBlocks = blocks.slice(0, insertionIndex);
    const afterBlocks = blocks.slice(insertionIndex);
    const beforeContent = beforeBlocks.join("\n\n");
    const afterContent = afterBlocks.join("\n\n");

    return (
      <>
        <MDXRemote source={beforeContent} options={mdxOptions} />
        <div className="my-8">
          <NewsletterMiniCTA />
        </div>
        <MDXRemote source={afterContent} options={mdxOptions} />
      </>
    );
  }

  // New behavior: parse and replace CTA markers
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // Reset regex
  CTA_MARKER_REGEX.lastIndex = 0;

  let match;
  while ((match = CTA_MARKER_REGEX.exec(mdxContent)) !== null) {
    const [fullMarker, ctaParams] = match;
    const matchIndex = match.index;

    // Add content before this marker
    if (matchIndex > lastIndex) {
      const contentBefore = mdxContent.slice(lastIndex, matchIndex);
      parts.push(
        <MDXRemote key={`content-${key++}`} source={contentBefore} options={mdxOptions} />
      );
    }

    // Parse CTA parameters (format: type:param1:param2)
    const params = ctaParams.split(":");
    const ctaType = params[0];

    // Render appropriate CTA component
    let ctaComponent: React.ReactNode = null;

    switch (ctaType) {
      case "newsletter":
        ctaComponent = <NewsletterMiniCTA key={`cta-${key++}`} />;
        break;

      case "unlock":
        ctaComponent = <UnlockCTA key={`cta-${key++}`} bookSlug={bookSlug} />;
        break;

      case "upgrade-pro":
        ctaComponent = <UpgradeProCTA key={`cta-${key++}`} />;
        break;

      case "buy-book":
        if (amazonLink) {
          ctaComponent = (
            <BuyBookCTA
              key={`cta-${key++}`}
              title={bookTitle}
              author={bookAuthor}
              amazonLink={amazonLink}
            />
          );
        }
        break;

      case "related-books":
        // For now, skip if no related books data
        // In the future, this could fetch related books dynamically
        break;

      case "tools":
        ctaComponent = <ToolsCTA key={`cta-${key++}`} bookSlug={bookSlug} />;
        break;

      case "next-book":
        // For now, skip if no next book data
        // In the future, this could fetch the next book in the learning path
        break;

      case "download":
        // Format: {{CTA:download:Title:Description:URL}}
        if (params.length >= 4) {
          ctaComponent = (
            <DownloadCTA
              key={`cta-${key++}`}
              title={params[1]}
              description={params[2]}
              downloadUrl={params[3]}
              buttonText={params[4] || "Scarica Gratis"}
            />
          );
        }
        break;

      default:
        console.warn(`Unknown CTA type: ${ctaType}`);
    }

    if (ctaComponent) {
      parts.push(ctaComponent);
    }

    lastIndex = matchIndex + fullMarker.length;
  }

  // Add remaining content after last marker
  if (lastIndex < mdxContent.length) {
    const remainingContent = mdxContent.slice(lastIndex);
    parts.push(
      <MDXRemote key={`content-${key++}`} source={remainingContent} options={mdxOptions} />
    );
  }

  return <>{parts}</>;
}
