import React from "react";
import NewsletterMiniCTA from "@/components/CTA/NewsletterMiniCTA";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface SummaryWithCTAProps {
  mdxContent: string;
}

export default async function SummaryWithCTA({ mdxContent }: SummaryWithCTAProps) {
  // Split content by paragraphs and headings (double newlines)
  const blocks = mdxContent.split(/\n\n+/);
  const total = blocks.length;

  // Calculate insertion point at 30% of content
  const insertionIndex = Math.max(1, Math.floor(total * 0.3));

  // Split into before and after
  const beforeBlocks = blocks.slice(0, insertionIndex);
  const afterBlocks = blocks.slice(insertionIndex);

  const beforeContent = beforeBlocks.join("\n\n");
  const afterContent = afterBlocks.join("\n\n");

  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    },
  };

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
