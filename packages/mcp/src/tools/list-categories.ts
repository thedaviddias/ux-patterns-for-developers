/**
 * list_categories tool
 * Returns all pattern categories
 */

import { getCategories } from '../data'
import type { ListCategoriesResponse } from '../types'

export const listCategoriesDefinition = {
  name: 'list_categories',
  description: 'List all UX pattern categories with pattern counts',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [],
  },
}

export async function listCategories(): Promise<ListCategoriesResponse> {
  const categories = getCategories()

  return {
    categories: categories.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      patternCount: cat.patternCount,
    })),
  }
}
