import { PATTERNS_MAP } from '@/app/_constants/patterns'
import * as Icons from 'lucide-react'
import { type LucideIcon } from 'lucide-react'
import type { MdxFile } from 'nextra'
import { getPageMap } from 'nextra/page-map'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import 'server-only'
import { PatternCategory } from '../_utils/get-pattern-categories'

export type PatternStatus = 'complete' | 'draft' | 'coming-soon'

export type Pattern = {
  title: string
  description: string
  href: string
  icon?: LucideIcon
  status: PatternStatus
  frontMatter?: Record<string, unknown>
}

export async function getRandomPatternServer(locale: string = 'en'): Promise<Pattern | null> {
  const categories = await getPatternCategories(locale)

  const allPatterns = categories.flatMap(category => category.patterns)

  const availablePatterns = allPatterns.filter(pattern =>
    pattern.href && pattern.status !== 'coming-soon'
  )

  if (availablePatterns.length === 0) return null

  const randomIndex = Math.floor(Math.random() * availablePatterns.length)
  const pattern = availablePatterns[randomIndex]

  return pattern || null
}

export async function getPatternCategories(locale: string): Promise<PatternCategory[]> {

  // Get all pattern categories and check if they exist first
  const categories = Object.values(PATTERNS_MAP)
    .filter(category => {
      const categoryPath = join(process.cwd(), 'content', locale, 'patterns', category.path)
      return existsSync(categoryPath)
    })

  const categoryData = await Promise.all(
    categories.map(async (category) => {
      const pageMap = await getPageMap(`/${locale}/patterns/${category.path}`)
      if (!pageMap) return null

      const pages = pageMap.filter(page =>
        'name' in page &&
        page.name !== 'index'
      ) as MdxFile[]

      return {
        name: category.name,
        path: category.path,
        patterns: pages.map(page => {
          const iconName = page.frontMatter?.icon
          const status = (page.frontMatter?.status as PatternStatus) || 'coming-soon'

          return {
            title: page.frontMatter?.title || page.name,
            description: page.frontMatter?.description || '',
            href: `/${locale}/patterns/${category.path}/${page.name}`,
            icon: iconName ? Icons[iconName] : undefined,
            status,
            frontMatter: page.frontMatter || {}
          }
        })
      }
    })
  )

  return categoryData.filter((category) => category !== null)
}
