import { BASE_URL } from '@app/_constants/project';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function generateArticleSchema(
  title: string,
  description: string,
  path: string,
  image?: string
) {
  // Ensure image URL is absolute if provided
  const imageUrl = image && !image.startsWith('http') ? `${BASE_URL}${image}` : image;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: `${BASE_URL}${path}`,
    ...(imageUrl && { image: imageUrl }),
    author: {
      '@type': 'Person',
      name: 'David Dias',
      url: 'https://thedaviddias.com',
      sameAs: [
        'https://www.reddit.com/r/UXPatterns/',
        'https://x.com/thedaviddias',
        'https://github.com/thedaviddias',
        'https://linkedin.com/in/thedaviddias',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'UX Patterns for Devs',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}${path}`,
    },
  };
}
