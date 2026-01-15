/**
 * Data loader for Velite output
 * Loads and filters content from apps/web/.velite/docs.json
 */

import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Pattern, GlossaryEntry, Category, VeliteDoc } from '../types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let cachedDocs: VeliteDoc[] | null = null
let lastLoadTime = 0
const CACHE_TTL = 60 * 1000 // 1 minute cache

/**
 * Get the path to the Velite output file
 */
function getVelitePath(): string {
  // Try multiple possible paths
  const possiblePaths = [
    join(process.cwd(), 'apps/web/.velite/docs.json'),
    join(process.cwd(), '.velite/docs.json'),
    join(__dirname, '../../../../apps/web/.velite/docs.json'),
  ]

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path
    }
  }

  throw new Error(
    `Velite output not found. Tried: ${possiblePaths.join(', ')}`
  )
}

/**
 * Load all docs from Velite output
 */
function loadDocs(): VeliteDoc[] {
  const now = Date.now()

  // Return cached if still valid
  if (cachedDocs && now - lastLoadTime < CACHE_TTL) {
    return cachedDocs
  }

  const path = getVelitePath()
  const content = readFileSync(path, 'utf-8')
  cachedDocs = JSON.parse(content) as VeliteDoc[]
  lastLoadTime = now

  return cachedDocs
}

/**
 * Filter docs to only include published/complete content
 */
function filterPublished(docs: VeliteDoc[]): VeliteDoc[] {
  return docs.filter(
    (doc) =>
      doc.status === 'complete' ||
      doc.status === 'published'
  )
}

/**
 * Exclude blog posts from results
 */
function excludeBlog(docs: VeliteDoc[]): VeliteDoc[] {
  return docs.filter((doc) => !doc.slug.startsWith('blog/'))
}

/**
 * Get all patterns
 */
export function getPatterns(): Pattern[] {
  const docs = loadDocs()
  const filtered = excludeBlog(filterPublished(docs))

  return filtered
    .filter((doc) => doc.slug.startsWith('patterns/'))
    .filter((doc) => doc.slug.split('/').length > 2) // Exclude category index pages
    .map(docToPattern)
}

/**
 * Get pattern by slug
 */
export function getPatternBySlug(slug: string): Pattern | null {
  const patterns = getPatterns()
  const normalizedSlug = slug.startsWith('patterns/')
    ? slug
    : `patterns/${slug}`

  return patterns.find((p) => p.slug === normalizedSlug) || null
}

/**
 * Get all glossary entries
 */
export function getGlossaryEntries(): GlossaryEntry[] {
  const docs = loadDocs()
  const filtered = filterPublished(docs)

  return filtered
    .filter((doc) => doc.slug.startsWith('glossary/'))
    .filter((doc) => doc.slug.split('/').length > 2) // Exclude index pages
    .map(docToGlossary)
}

/**
 * Get glossary entry by slug or term
 */
export function getGlossaryEntry(identifier: string): GlossaryEntry | null {
  const entries = getGlossaryEntries()
  const identifierLower = identifier.toLowerCase()

  // Try exact slug match first
  const normalizedSlug = identifier.startsWith('glossary/')
    ? identifier
    : `glossary/${identifier}`
  const bySlug = entries.find((e) => e.slug === normalizedSlug)
  if (bySlug) return bySlug

  // Try matching slug ending (e.g., "aria-attributes" matches "glossary/a/aria-attributes")
  const bySlugEnding = entries.find((e) => {
    const slugParts = e.slug.split('/')
    const lastPart = slugParts[slugParts.length - 1]
    return lastPart.toLowerCase() === identifierLower
  })
  if (bySlugEnding) return bySlugEnding

  // Try term match (case-insensitive)
  const byTerm = entries.find(
    (e) => e.term.toLowerCase() === identifierLower
  )
  return byTerm || null
}

/**
 * Get all categories
 */
export function getCategories(): Category[] {
  const patterns = getPatterns()
  const categoryMap = new Map<string, { name: string; patterns: string[] }>()

  for (const pattern of patterns) {
    const parts = pattern.slug.split('/')
    if (parts.length >= 3) {
      // patterns/[category]/[pattern]
      const categorySlug = parts[1]
      const categoryName = formatCategoryName(categorySlug)

      if (!categoryMap.has(categorySlug)) {
        categoryMap.set(categorySlug, {
          name: categoryName,
          patterns: [],
        })
      }
      categoryMap.get(categorySlug)!.patterns.push(pattern.slug)
    }
  }

  return Array.from(categoryMap.entries()).map(([slug, data]) => ({
    slug,
    name: data.name,
    patternCount: data.patterns.length,
    patterns: data.patterns,
  }))
}

/**
 * Convert Velite doc to Pattern type
 */
function docToPattern(doc: VeliteDoc): Pattern {
  const parts = doc.slug.split('/')

  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description || '',
    summary: doc.summary,
    category: parts.length >= 2 ? parts[1] : 'uncategorized',
    status: doc.status,
    body: doc.body,
    toc: doc.toc,
    metadata: {
      readingTime: doc.metadata?.readingTime || 0,
      wordCount: doc.metadata?.wordCount || 0,
    },
    aliases: doc.aliases,
    icon: doc.icon,
    featured: doc.featured,
    url: doc.url,
  }
}

/**
 * Convert Velite doc to GlossaryEntry type
 */
function docToGlossary(doc: VeliteDoc): GlossaryEntry {
  return {
    slug: doc.slug,
    term: doc.title,
    definition: doc.description || '',
    body: doc.body,
    toc: doc.toc,
    relatedTerms: [], // Could be extracted from body if needed
    url: doc.url,
  }
}

/**
 * Format category slug to display name
 */
function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Search patterns by text query
 */
export function searchPatterns(query: string): Pattern[] {
  const patterns = getPatterns()
  const queryLower = query.toLowerCase()

  return patterns.filter((pattern) => {
    // Search in title, description, summary
    if (pattern.title.toLowerCase().includes(queryLower)) return true
    if (pattern.description.toLowerCase().includes(queryLower)) return true
    if (pattern.summary?.toLowerCase().includes(queryLower)) return true

    // Search in aliases
    if (pattern.aliases?.some((a) => a.toLowerCase().includes(queryLower))) {
      return true
    }

    return false
  })
}

/**
 * Clear the cache (useful for testing)
 */
export function clearCache(): void {
  cachedDocs = null
  lastLoadTime = 0
}
