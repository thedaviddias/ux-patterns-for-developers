import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { i18n, type Locale } from '@app/_dictionaries/i18n-config';
import * as Sentry from '@sentry/nextjs';
import { type NextRequest, NextResponse } from 'next/server';
import type { Heading, MdxFile } from 'nextra';
import { getPageMap } from 'nextra/page-map';
import { importPage } from 'nextra/pages';
import { PATTERNS_MAP } from '@/app/_constants/patterns';

type MdxContent = {
  route: string;
  name: string;
  frontMatter: Record<string, unknown> | null;
  metadata: {
    title?: string;
    description?: string | null;
    [key: string]: unknown;
  };
  toc: Heading[];
  content: string;
};

async function getAllMdxContent(locale: string) {
  try {
    const blogPages = ((await getPageMap(`/blog`)) || []).filter(
      (page) => 'name' in page
    ) as MdxFile[];

    // Get all pattern categories and check if they exist first
    const patternCategories = Object.values(PATTERNS_MAP)
      .map((p) => p.path)
      .filter((category) => {
        const categoryPath = join(process.cwd(), 'content', 'patterns', category);
        return existsSync(categoryPath);
      });

    const patternPages = (
      await Promise.all(
        patternCategories.map(async (category) => {
          try {
            const pageMap = await getPageMap(`/patterns/${category}`);
            return (pageMap || []).filter((page) => 'name' in page);
          } catch (error) {
            console.warn(`No content found for category: ${category}`, error);
            return [];
          }
        })
      )
    ).flat() as MdxFile[];

    const allContent: MdxContent[] = [];

    const processPages = async (pages: MdxFile[]) => {
      for (const page of pages) {
        if (page.name === 'index') continue;

        try {
          const path = page.route.split('/').filter(Boolean);
          const result = await importPage(path);

          const filePath = `${join(process.cwd(), 'content', ...path)}.mdx`;
          const rawContent = readFileSync(filePath, 'utf-8');

          // Clean the content but preserve markdown
          const cleanContent = rawContent
            .replace(/import\s+.*?;/g, '') // Remove import statements
            .replace(/<[^>]*>/g, '') // Remove JSX/HTML tags
            .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n +/g, '\n') // Remove spaces after newlines
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .trim();

          if (result) {
            allContent.push({
              route: page.route,
              name: page.name,
              frontMatter: 'frontMatter' in page && page.frontMatter ? page.frontMatter : null,
              metadata: result.metadata,
              toc: result.toc,
              content: cleanContent,
            });
          }
        } catch (error) {
          console.error(`Error importing page ${page.route}:`, error);
        }
      }
    };

    await Promise.all([processPages(blogPages), processPages(patternPages)]);

    return allContent;
  } catch (error) {
    console.error('Error in getAllMdxContent:', error);
    throw new Error('Failed to get MDX content');
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check API key
    const authHeader = req.headers.get('authorization');
    const apiKey = process.env.MDX_API_KEY;

    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get locale from query params or default to 'en'
    const searchParams = req.nextUrl.searchParams;
    const locale = (searchParams.get('locale') || i18n.defaultLocale) as Locale;

    if (!i18n.locales.includes(locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    const content = await getAllMdxContent(locale);

    return NextResponse.json({
      content,
      success: true,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
