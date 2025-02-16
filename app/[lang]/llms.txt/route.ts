import fg from 'fast-glob';
import matter from 'gray-matter';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';

export const revalidate = false;

// Regular expressions for cleaning up the content
const IMPORT_REGEX = /import\s+?(?:(?:{[^}]*}|\*|\w+)\s+from\s+)?['"](.*?)['"];?\n?/g;
const COMPONENT_USAGE_REGEX = /<[A-Z][a-zA-Z]*(?:\s+[^>]*)?(?:\/?>|>[^<]*<\/[A-Z][a-zA-Z]*>)/g;
const NEXTRA_COMPONENT_REGEX = /<(?:Callout|Steps|Tabs|Tab|FileTree)[^>]*>[^<]*<\/(?:Callout|Steps|Tabs|Tab|FileTree)>/g;
const MDX_EXPRESSION_REGEX = /{(?:[^{}]|{[^{}]*})*}/g;
const EXPORT_REGEX = /export\s+(?:default\s+)?(?:const|let|var|function|class|interface|type)?\s+[a-zA-Z_$][0-9a-zA-Z_$]*[\s\S]*?(?:;|\n|$)/g;

export async function GET() {
  try {
    const files = await fg(['content/en/patterns/**/*.mdx']);

    const scan = files.map(async (file) => {
      try {
        const fileContent = await fs.readFile(file);
        const { content, data } = matter(fileContent.toString());

        // Get the filename without extension to use as fallback title
        const basename = path.basename(file, '.mdx');

        // Extract category from file path
        const pathParts = path.dirname(file).split(path.sep);
        let category = 'general';
        if (pathParts.length > 3 && pathParts[3]) {
          category = pathParts[3];
        }

        // Skip if the file is marked as hidden or draft
        if (data.draft || data.hidden) {
          return null;
        }

        // Use filename as title if no title in frontmatter, and convert to Title Case
        const title = data.title || basename.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const processed = await processContent(content);
        return `File: ${file}
# ${category.toUpperCase()}: ${title}

${data.description || ''}

${processed}`;
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
        return null;
      }
    });

    const scanned = (await Promise.all(scan)).filter(Boolean);

    if (!scanned.length) {
      return new Response('No content found', { status: 404 });
    }

    return new Response(scanned.join('\n\n'));
  } catch (error) {
    console.error('Error generating LLM content:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

async function processContent(content: string): Promise<string> {
  try {
    // Multi-step cleanup to handle different MDX constructs
    let cleanContent = content
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
    const file = await remark()
      .use(remarkGfm)
      .use(remarkStringify)
      .process(cleanContent);

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
