import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const contentDirectory = path.join(process.cwd(), 'content/en/patterns');

interface Pattern {
  category: string;
  title: string;
  summary: string;
  status: string;
  slug: string;
}

interface PatternsByCategory {
  [category: string]: Pattern[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getAllPatterns(): PatternsByCategory {
  // Get all directories under patterns
  const categories = fs.readdirSync(contentDirectory);

  const allPatterns: PatternsByCategory = {};

  for (const category of categories) {
    const categoryPath = path.join(contentDirectory, category);

    // Skip if not a directory
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    // Read all MDX files in the category
    const files = fs.readdirSync(categoryPath)
      .filter(file => file.endsWith('.mdx'));

    const categoryPatterns = files.map(file => {
      const fullPath = path.join(categoryPath, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      const slug = file.replace('.mdx', '');

      return {
        category,
        title: data.title || slug,
        summary: data.summary || '',
        status: data.status || 'coming soon',
        slug
      };
    });

    allPatterns[category] = categoryPatterns;
  }

  return allPatterns;
}

export async function GET(
  request: Request,
  { params }: { params: { lang: string } }
) {
  try {
    const patterns = getAllPatterns();

    // Get base URL and await params
    const [baseUrl, { lang }] = await Promise.all([
      Promise.resolve(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : `https://${process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000'}`
      ),
      params
    ]);

    // Generate the text content
    let content = `# UX Patterns for Developers

## Overview
This is an automatically generated overview of all UX patterns documented in this project.

## Pattern Categories\n`;

    // Add patterns by category
    for (const [category, categoryPatterns] of Object.entries(patterns)) {
      content += `\n### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
      for (const pattern of categoryPatterns) {
        const patternUrl = `${baseUrl}/${lang}/patterns/${category}/${pattern.slug}`;
        content += `- [${pattern.title}](${patternUrl})${pattern.summary ? `: ${pattern.summary}` : ''} [${pattern.status}]\n`;
      }
    }

    content += `\n## Additional Resources
- [Blog posts and articles about UX patterns](${baseUrl}/${lang}/blog)
- [Comprehensive glossary of UX terms](${baseUrl}/${lang}/glossary)

## Technical Implementation
- Built with Next.js and TypeScript
- MDX-based pattern documentation
- Accessibility-first approach
- Comprehensive testing guidelines`;

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
