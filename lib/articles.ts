import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Article, ArticleFrontmatter } from '@/types/article'

const articlesDirectory = path.join(process.cwd(), 'content/articles')

// Ensure articles directory exists
if (!fs.existsSync(articlesDirectory)) {
  fs.mkdirSync(articlesDirectory, { recursive: true })
}

export function getAllArticles(): Article[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory)
    const articles = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(articlesDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          frontmatter: data as ArticleFrontmatter,
          content,
        }
      })
      .sort((a, b) => {
        return new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime()
      })

    return articles
  } catch (error) {
    console.error('Error reading articles:', error)
    return []
  }
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      frontmatter: data as ArticleFrontmatter,
      content,
    }
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error)
    return null
  }
}

export function getAllArticleSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory)
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''))
  } catch (error) {
    console.error('Error getting article slugs:', error)
    return []
  }
}