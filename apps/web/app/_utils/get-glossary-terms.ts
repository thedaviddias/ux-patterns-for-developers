import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

export interface GlossaryTerm {
  title: string;
  description: string;
  category: string[];
  slug: string;
}

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  try {
    const glossaryPath = join(process.cwd(), 'content/glossary');

    if (!existsSync(glossaryPath)) {
      console.warn('Glossary directory not found:', glossaryPath);
      return [];
    }

    const files = await readdir(glossaryPath);

    const terms = await Promise.all(
      files
        .filter((file) => file.endsWith('.mdx') && file !== 'index.mdx')
        .map(async (file) => {
          try {
            const filePath = join(glossaryPath, file);
            const content = await readFile(filePath, 'utf-8');
            const { data } = matter(content);

            return {
              title: data.title || '',
              description: data.description || '',
              category: Array.isArray(data.category) ? data.category : [],
              slug: file.replace('.mdx', ''),
            };
          } catch (error) {
            console.error(`Error processing file ${file}:`, error);
            return null;
          }
        })
    );

    return terms.filter((term): term is GlossaryTerm => term !== null);
  } catch (error) {
    console.error('Error fetching glossary terms:', error);
    return [];
  }
}
