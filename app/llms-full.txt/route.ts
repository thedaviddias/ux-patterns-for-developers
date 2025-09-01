import * as fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';

export const dynamic = 'force-dynamic';

// Regular expressions for cleaning up the content
const IMPORT_REGEX = /import\s+?(?:(?:{[^}]*}|\*|\w+)\s+from\s+)?['"](.*?)['"];?\n?/g;
const COMPONENT_USAGE_REGEX = /<[A-Z][a-zA-Z]*(?:\s+[^>]*)?(?:\/?>|>[^<]*<\/[A-Z][a-zA-Z]*>)/g;
const NEXTRA_COMPONENT_REGEX =
  /<(?:Callout|Steps|Tabs|Tab|FileTree)[^>]*>[^<]*<\/(?:Callout|Steps|Tabs|Tab|FileTree)>/g;
const MDX_EXPRESSION_REGEX = /{(?:[^{}]|{[^{}]*})*}/g;
const EXPORT_REGEX =
  /export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type)?\s+[a-zA-Z_$][0-9a-zA-Z_$]*[\s\S]*?(?:;|\n|$)/g;

async function processContent(content: string): Promise<string> {
  try {
    // Multi-step cleanup to handle different MDX constructs
    const cleanContent = content
      // Remove imports first
      .replace(IMPORT_REGEX, '')
      // Remove exports
      .replace(EXPORT_REGEX, '')
      // Remove Nextra components with their content
      .replace(NEXTRA_COMPONENT_REGEX, '')
      // Remove other React components
      .replace(COMPONENT_USAGE_REGEX, '')
      // Remove MDX expressions
      .replace(MDX_EXPRESSION_REGEX, '')
      // Clean up multiple newlines
      .replace(/\n{3,}/g, '\n\n')
      // Remove empty JSX expressions
      .replace(/{[\s]*}/g, '')
      // Clean up any remaining JSX-like syntax
      .replace(/<>[\s\S]*?<\/>/g, '')
      .replace(/{\s*\/\*[\s\S]*?\*\/\s*}/g, '')
      .trim();

    // Simple markdown processing without MDX
    const file = await remark().use(remarkGfm).use(remarkStringify).process(cleanContent);

    return String(file);
  } catch (error) {
    console.error('Error processing content:', error);
    // If processing fails, return a basic cleaned version
    return content
      .replace(IMPORT_REGEX, '')
      .replace(COMPONENT_USAGE_REGEX, '')
      .replace(MDX_EXPRESSION_REGEX, '')
      .trim();
  }
}

interface ProcessFileOptions {
  baseUrl: string;
}

async function processFile(file: string, options: ProcessFileOptions) {
  try {
    const fileContent = await fs.readFile(file);
    const { content, data } = matter(fileContent.toString());

    // Get the filename without extension to use as fallback title
    const basename = path.basename(file, '.mdx');

    // Extract category from file path
    const pathParts = path.dirname(file).split(path.sep);
    const category = pathParts.length > 3 && pathParts[3] ? pathParts[3] : 'general';

    // Skip if the file is marked as hidden or draft
    if (data.draft || data.hidden) {
      return null;
    }

    // Use filename as title if no title in frontmatter, and convert to Title Case
    const title =
      data.title ||
      basename
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const processed = await processContent(content);
    const patternUrl = new URL(
      `/patterns/${category}/${basename}`,
      options.baseUrl
    ).toString();

    return `# ${category.toUpperCase()}: [${title}](${patternUrl})

${data.description || ''}

${processed}`;
  } catch (error) {
    console.error(`Error processing file ${file}:`, error);
    return null;
  }
}

export async function GET(_request: Request) {
  try {
    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NODE_ENV === 'development'
        ? 'http://localhost:3060'
        : '';

    if (!baseUrl) {
      return NextResponse.json({ error: 'Base URL not configured' }, { status: 500 });
    }

    // Get files and process them
    const files = await fg(['content/patterns/**/*.mdx']);
    const options: ProcessFileOptions = { baseUrl };

    const scanned = (await Promise.all(files.map((file) => processFile(file, options)))).filter(
      Boolean
    );

    if (!scanned.length) {
      return NextResponse.json({ error: 'No content found' }, { status: 404 });
    }

    return new Response(scanned.join('\n\n'), {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error generating LLM content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
