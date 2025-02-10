
import { GlossaryStructuredData } from './structured-data'

interface TermPageProps {
  frontMatter: {
    title: string
    description: string
    category: string[]
    related_patterns?: string[]
    synonyms?: string[]
  }
  children: React.ReactNode
}

export function TermPage({ frontMatter, children }: TermPageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <GlossaryStructuredData
        term={frontMatter.title}
        definition={frontMatter.description}
        category={frontMatter.category}
      />
      {children}
    </div>
  )
}

