import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { MdxFile } from 'nextra';
import { getPageMap } from 'nextra/page-map';

export type PatternAssistantPage = {
  title: string;
  summary: string;
  icon?: LucideIcon;
  href: string;
  frontMatter?: Record<string, unknown>;
};

export async function getPatternAssistantPages(locale: string): Promise<PatternAssistantPage[]> {
  const pageMap = await getPageMap(`/${locale}/pattern-guide`);
  if (!pageMap) return [];

  const pages = pageMap.filter((page) => 'name' in page && page.name !== 'index') as MdxFile[];

  return pages.map((page) => {
    const iconName = page.frontMatter?.icon || 'GitBranch';
    // Exclude non-icon exports and cast the rest
    const IconComponent = Icons[
      iconName as keyof Omit<typeof Icons, 'createLucideIcon'>
    ] as LucideIcon;

    return {
      title: page.frontMatter?.title || page.name,
      summary: page.frontMatter?.summary || '',
      href: `/${locale}/pattern-guide/${page.name}`,
      icon: IconComponent,
      frontMatter: page.frontMatter || {},
    };
  });
}
