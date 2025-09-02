import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

// Type-safe icon access
function getIconComponent(iconName: string): LucideIcon | undefined {
  return (Icons as unknown as Record<string, LucideIcon>)[iconName];
}

import type { MdxFile } from 'nextra';
import { getPageMap } from 'nextra/page-map';
import { PATTERNS_MAP } from '@/app/_constants/patterns';

import 'server-only';

export type PatternStatus = 'complete' | 'draft' | 'coming-soon';

export type PatternCategory = {
  name: string;
  path: string;
  description: string;
  patterns: Pattern[];
};

export type Pattern = {
  title: string;
  summary: string;
  description: string;
  href: string;
  icon?: LucideIcon;
  status: PatternStatus;
  frontMatter?: Record<string, unknown>;
};

export async function getPatternCategories(_locale: string = 'en'): Promise<PatternCategory[]> {
  // Get all pattern categories - let Nextra handle directory existence checking
  const categories = Object.values(PATTERNS_MAP);

  const categoryData = await Promise.all(
    categories.map(async (category) => {
      try {
        // Since contentDirBasePath is '/en', paths are relative to that
        const pageMap = await getPageMap(`/patterns/${category.path}`);
        if (!pageMap) return null;

        const pages = pageMap.filter((page) => 'name' in page && page.name !== 'index') as MdxFile[];

      return {
        name: category.name,
        path: category.path,
        description: category.description || '',
        patterns: pages.map((page) => {
          const iconName = page.frontMatter?.icon;
          const status = (page.frontMatter?.status as PatternStatus) || 'coming-soon';

          return {
            title: page.frontMatter?.title || page.name,
            summary: page.frontMatter?.summary || '',
            description: page.frontMatter?.description || '',
            href: `/patterns/${category.path}/${page.name}`, // No locale in URL
            icon: iconName ? getIconComponent(iconName) : undefined,
            status,
            frontMatter: page.frontMatter || {},
          };
        }),
      };
      } catch (error) {
        // If getPageMap fails for this category, skip it
        console.warn(`Failed to load category ${category.path}:`, error);
        return null;
      }
    })
  );

  return categoryData.filter((category) => category !== null);
}
