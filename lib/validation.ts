import { z } from 'zod';

/**
 * Zod schema for book frontmatter validation
 */
export const bookFrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens only')
    .optional(),
  author: z.string().min(1, 'Author is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  level: z.enum(['base', 'intermedio', 'avanzato']).optional(),
  pvCategory: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  readingTimeFull: z.string().optional(),
  readingTimeSystem: z.string().optional(),
  amazonLink: z.string().url().optional().or(z.literal('')),
  amazon_link: z.string().url().optional().or(z.literal('')),
});

export type BookFrontmatterSchema = z.infer<typeof bookFrontmatterSchema>;

/**
 * Validate book frontmatter
 */
export function validateBookFrontmatter(data: unknown) {
  return bookFrontmatterSchema.safeParse(data);
}

/**
 * Schema for RAG JSON structure
 */
export const ragConceptSchema = z.object({
  name: z.string(),
  definition: z.string(),
  tertiary_points: z.array(z.string()).optional(),
  examples: z.array(z.string()).optional(),
  applications: z.array(z.string()).optional(),
  common_mistakes: z.array(z.string()).optional(),
  diagnostic_questions: z.array(z.string()).optional(),
});

export const ragPrimaryConceptSchema = z.object({
  name: z.string(),
  definition: z.string(),
  relationships: z.array(z.string()).optional(),
  secondary_concepts: z.array(ragConceptSchema).optional(),
});

export const ragBookConnectionSchema = z.object({
  related_book: z.string(),
  relation_type: z.enum(['complemento', 'contrasto', 'coerenza']),
  explanation: z.string(),
});

export const ragMetaAnalysisSchema = z.object({
  agreement_points: z.array(z.string()).optional(),
  disagreement_points: z.array(z.string()).optional(),
  connections_to_other_books: z.array(ragBookConnectionSchema).optional(),
});

export const ragBookSchema = z.object({
  book_title: z.string(),
  author: z.string(),
  publication_year: z.string(),
  pv_category: z.string(),
  core_thesis: z.string(),
  primary_concepts: z.array(ragPrimaryConceptSchema),
  pv_meta_analysis: ragMetaAnalysisSchema.optional(),
});

export type RagBookSchema = z.infer<typeof ragBookSchema>;

/**
 * Validate RAG JSON structure
 */
export function validateRagJson(data: unknown) {
  return ragBookSchema.safeParse(data);
}
