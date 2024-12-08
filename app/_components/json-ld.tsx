import { BASE_URL } from '@app/_constants/project'

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function generateArticleSchema(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": `${BASE_URL}${path}`,
    "author": {
      "@type": "Person",
      "name": "David Dias",
      "url": "https://thedaviddias.com",
      "sameAs": [
        "https://x.com/thedaviddias",
        "https://github.com/thedaviddias",
        "https://linkedin.com/in/thedaviddias",
        "https://bsky.social/thedaviddias"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "UX Patterns for Devs",
      "url": BASE_URL
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}${path}`
    }
  }
}
