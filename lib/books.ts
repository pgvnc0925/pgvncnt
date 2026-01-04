import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Book, BookLevel, BookWithContent, BookFrontmatter } from '@/types/book';

const booksDirectory = path.join(process.cwd(), 'content', 'books');

/**
 * Ensure the books directory exists
 */
function ensureBooksDirectory() {
  if (!fs.existsSync(booksDirectory)) {
    fs.mkdirSync(booksDirectory, { recursive: true });
  }
}

/**
 * Resolve cover image path with multiple fallback strategies
 */
function resolveCoverPath(slug: string, frontmatterCover?: string): string {
  const publicDir = path.join(process.cwd(), 'public');

  const candidates = [
    // Use frontmatter cover if specified
    frontmatterCover ? path.join(publicDir, 'covers', frontmatterCover) : null,
    // Try slug-based names
    path.join(publicDir, 'covers', `${slug}.jpg`),
    path.join(publicDir, 'covers', `${slug}.png`),
    path.join(publicDir, 'covers', `${slug}.jpeg`),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return `/covers/${path.basename(candidate)}`;
    }
  }

  // Return frontmatter value even if file doesn't exist (might be from Supabase)
  if (frontmatterCover) {
    return frontmatterCover.startsWith('/') ? frontmatterCover : `/covers/${frontmatterCover}`;
  }

  // Default placeholder
  return '/covers/placeholder.jpg';
}

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return `${minutes} min di lettura`;
}

/**
 * Parse a single book MDX file
 */
function parseBookFile(fileName: string): Book | null {
  try {
    const slug = fileName.replace(/\.mdx?$/, '');
    const fullPath = path.join(booksDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data: frontmatter, content } = matter(fileContents);

    const fm = frontmatter as BookFrontmatter;

    // Skip if no title
    if (!fm.title) {
      console.warn(`⚠️  Skipping ${fileName}: missing title in frontmatter`);
      return null;
    }

    // Calculate reading time from content
    const calculatedReadingTime = calculateReadingTime(content);

    return {
      id: slug,
      slug: fm.slug || slug,
      title: fm.title,
      author: fm.author || 'Unknown Author',
      level: fm.level || 'base',
      rating: fm.rating || 4.5,
      reviewCount: fm.reviewCount || 0,
      coverImage: resolveCoverPath(slug, fm.coverImage),
      description: fm.excerpt || fm.metaDescription || '',
      readingTimeFull: fm.readingTimeFull || '',
      readingTimeSystem: fm.readingTimeSystem || calculatedReadingTime,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      year: fm.year,
      pvCategory: fm.pvCategory,
      amazonLink: fm.amazonLink || fm.amazon_link,
    };
  } catch (error) {
    console.error(`Error parsing book file ${fileName}:`, error);
    return null;
  }
}

/**
 * Get all books from the filesystem
 */
export function getAllBooks(): Book[] {
  try {
    ensureBooksDirectory();

    const fileNames = fs.readdirSync(booksDirectory);

    const books = fileNames
      .filter(fileName => fileName.match(/\.mdx?$/))
      .map(parseBookFile)
      .filter((book): book is Book => book !== null)
      .sort((a, b) => a.title.localeCompare(b.title));

    return books;
  } catch (error) {
    console.error('Error reading books from filesystem:', error);
    return [];
  }
}

/**
 * Get books filtered by level
 */
export function getBooksByLevel(level: BookLevel): Book[] {
  return getAllBooks().filter(book => book.level === level);
}

/**
 * Get a single book by slug
 */
export function getBookBySlug(slug: string): Book | null {
  const books = getAllBooks();
  return books.find(book => book.slug === slug) || null;
}

/**
 * Get a book with its full MDX content
 */
export function getBookWithContent(slug: string): BookWithContent | null {
  try {
    ensureBooksDirectory();

    const fileNames = fs.readdirSync(booksDirectory);
    let matched: {
      fileName: string;
      content: string;
      frontmatter: BookFrontmatter;
    } | null = null;

    for (const fileName of fileNames) {
      const fileSlug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(booksDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data: frontmatter, content } = matter(fileContents);
      const fm = frontmatter as BookFrontmatter;
      const candidateSlug = fm.slug || fileSlug;

      if (slug === fileSlug || slug === candidateSlug) {
        matched = { fileName, content, frontmatter: fm };
        break;
      }
    }

    if (!matched) {
      return null;
    }

    const book = parseBookFile(matched.fileName);
    if (!book) {
      return null;
    }

    return {
      ...book,
      content: matched.content,
      frontmatter: matched.frontmatter,
    };
  } catch (error) {
    console.error(`Error reading book ${slug}:`, error);
    return null;
  }
}

/**
 * Get all unique tags from all books
 */
export function getAllTags(): string[] {
  const allTags = getAllBooks().flatMap(book => book.tags);
  return Array.from(new Set(allTags)).sort();
}

/**
 * Get all unique authors
 */
export function getAllAuthors(): string[] {
  const allAuthors = getAllBooks().map(book => book.author);
  return Array.from(new Set(allAuthors)).sort();
}

/**
 * Get books by tag
 */
export function getBooksByTag(tag: string): Book[] {
  return getAllBooks().filter(book =>
    book.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Search books by title or author
 */
export function searchBooks(query: string): Book[] {
  const lowerQuery = query.toLowerCase();
  return getAllBooks().filter(book =>
    book.title.toLowerCase().includes(lowerQuery) ||
    book.author.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get the next book in the same level
 */
export function getNextBookInLevel(currentSlug: string): Book | null {
  const currentBook = getBookBySlug(currentSlug);
  if (!currentBook) return null;

  const booksInLevel = getBooksByLevel(currentBook.level);
  const currentIndex = booksInLevel.findIndex(b => b.slug === currentSlug);

  if (currentIndex === -1 || currentIndex === booksInLevel.length - 1) {
    return null; // Book not found or it's the last one
  }

  return booksInLevel[currentIndex + 1];
}

/**
 * Get statistics about the book collection
 */
export function getBookStats() {
  const books = getAllBooks();

  return {
    total: books.length,
    byLevel: {
      base: books.filter(b => b.level === 'base').length,
      intermedio: books.filter(b => b.level === 'intermedio').length,
      avanzato: books.filter(b => b.level === 'avanzato').length,
    },
    averageRating: books.reduce((sum, b) => sum + b.rating, 0) / books.length || 0,
    totalReviews: books.reduce((sum, b) => sum + b.reviewCount, 0),
  };
}
