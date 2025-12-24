export interface ArticleFrontmatter {
  title: string
  slug?: string
  description: string
  publishedAt: string
  author?: string
  tags: string[]
  featuredImage?: string
  ctaBookSlug?: string
  ctaBookText?: string
  amazonAffiliateLink?: string
  relatedBooks?: string[]
  relatedTools?: string[]
  faq?: Array<{
    question: string
    answer: string
  }>
  ctaText?: string
  ctaLink?: string
}

export interface Article {
  slug: string
  frontmatter: ArticleFrontmatter
  content: string
}
