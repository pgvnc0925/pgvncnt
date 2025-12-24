import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Article, ArticleFrontmatter } from '@/types/article';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

// Ensure articles directory exists
if (!fs.existsSync(articlesDirectory)) {
  fs.mkdirSync(articlesDirectory, { recursive: true });
}

function readArticleFile(fileName: string): Article | null {
  try {
    const fileSlug = fileName.replace(/\.mdx?$/, '');
    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const fm = data as ArticleFrontmatter;

    return {
      slug: fm.slug || fileSlug,
      frontmatter: fm,
      content,
    };
  } catch (error) {
    console.error(`Error parsing article file ${fileName}:`, error);
    return null;
  }
}

export function getAllArticles(): Article[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    const articles = fileNames
      .filter((fileName) => fileName.match(/\.mdx?$/))
      .map(readArticleFile)
      .filter((article): article is Article => article !== null)
      .sort((a, b) => {
        const dateA = new Date(a.frontmatter.publishedAt || '').getTime();
        const dateB = new Date(b.frontmatter.publishedAt || '').getTime();
        return dateB - dateA;
      });

    return articles;
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const mdxPath = path.join(articlesDirectory, `${slug}.mdx`);
    const mdPath = path.join(articlesDirectory, `${slug}.md`);
    let targetPath = '';

    if (fs.existsSync(mdxPath)) {
      targetPath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
      targetPath = mdPath;
    } else {
      return null;
    }

    const fileContents = fs.readFileSync(targetPath, 'utf8');
    const { data, content } = matter(fileContents);
    const fm = data as ArticleFrontmatter;

    return {
      slug: fm.slug || slug,
      frontmatter: fm,
      content,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

export function getAllArticleSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter((fileName) => fileName.match(/\.mdx?$/))
      .map((fileName) => fileName.replace(/\.mdx?$/, ''));
  } catch (error) {
    console.error('Error getting article slugs:', error);
    return [];
  }
}
