import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import { BASE_URL } from '../_constants/project';

const contentDirectory = path.join(process.cwd(), 'content/patterns');

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

function getAllPatterns(): PatternsByCategory {
  // Get all directories under patterns
  const categories = fs.readdirSync(contentDirectory);

  const allPatterns: PatternsByCategory = {};

  for (const category of categories) {
    const categoryPath = path.join(contentDirectory, category);

    // Skip if not a directory
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    // Read all MDX files in the category
    const files = fs.readdirSync(categoryPath).filter((file) => file.endsWith('.mdx'));

    const categoryPatterns = files.map((file) => {
      const fullPath = path.join(categoryPath, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      const slug = file.replace('.mdx', '');

      return {
        category,
        title: data.title || slug,
        summary: data.summary || '',
        status: data.status || 'coming soon',
        slug,
      };
    });

    allPatterns[category] = categoryPatterns;
  }

  return allPatterns;
}

export async function GET(_request: Request) {
  try {
    const patterns = getAllPatterns();

    // Get base URL
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3060' : BASE_URL;

    // Generate the text content
    let content = `# UX Patterns for Developers

## Overview
This is an automatically generated overview of all UX patterns documented in this project.

## Pattern Categories\n`;

    // Add patterns by category
    for (const [category, categoryPatterns] of Object.entries(patterns)) {
      content += `\n### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
      for (const pattern of categoryPatterns) {
        const patternUrl = new URL(
          `/patterns/${category}/${pattern.slug}`,
          baseUrl
        ).toString();
        content += `- [${pattern.title}](${patternUrl})${pattern.summary ? `: ${pattern.summary}` : ''} [${pattern.status}]\n`;
      }
    }

    content += `\n## Additional Resources
- [Blog posts and articles about UX patterns](${new URL('/blog', baseUrl).toString()})
- [Comprehensive glossary of UX terms](${new URL('/glossary', baseUrl).toString()})

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
