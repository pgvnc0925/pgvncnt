export type BookLevel = 'base' | 'intermedio' | 'avanzato';

export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  level: BookLevel;
  rating: number;
  reviewCount: number;
  coverImage: string;
  description: string;
  readingTimeFull: string;
  readingTimeSystem: string;
  tags: string[];
  year?: number;
  pvCategory?: string;
  amazonLink?: string;
}

export interface InsightBox {
  title: string;
  content: string;
  articleSlug?: string;
  articleTitle?: string;
}

export interface BookFAQ {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface BookFrontmatter {
  title: string;
  slug: string;
  author: string;
  year?: number;
  level?: BookLevel;
  pvCategory?: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string;
  rating?: number;
  reviewCount?: number;
  readingTimeFull?: string;
  readingTimeSystem?: string;
  amazonLink?: string;
  amazon_link?: string;
  insightBoxes?: InsightBox[];
  faqs?: BookFAQ[];
  quiz?: QuizQuestion[];
}

export interface BookWithContent extends Book {
  content: string;
  frontmatter: BookFrontmatter;
}
