import { readdir, readFile } from 'fs/promises'
import matter from 'gray-matter'
import { join } from 'path'

interface GlossaryTerm {
  title: string
  description: string
  category: string[]
  slug: string
}

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  const glossaryPath = join(process.cwd(), 'content/en/glossary')
  const files = await readdir(glossaryPath)

  const terms = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx') && file !== 'index.mdx')
      .map(async (file) => {
        const filePath = join(glossaryPath, file)
        const content = await readFile(filePath, 'utf-8')
        const { data } = matter(content)

        return {
          title: data.title,
          description: data.description,
          category: data.category,
          slug: file.replace('.mdx', '')
        }
      })
  )

  return terms
}
