import { BASE_URL } from '@app/_constants/project';

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  // Serialize and escape "<" characters to prevent script injection
  const serializedData = JSON.stringify(data).replace(/</g, '\\u003c');
  // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data injection with proper escaping
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializedData }} />;
}

// Author information reused across schemas
const AUTHOR_SCHEMA = {
  '@type': 'Person',
  name: 'David Dias',
  url: 'https://thedaviddias.com',
  sameAs: [
    'https://www.reddit.com/r/UXPatterns/',
    'https://x.com/thedaviddias',
    'https://github.com/thedaviddias',
    'https://linkedin.com/in/thedaviddias',
  ],
};

// Organization schema reused across schemas
export const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'UX Patterns for Devs',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/img/ux-logo.png`,
    width: 512,
    height: 512,
  },
  sameAs: [
    'https://github.com/thedaviddias/ux-patterns-for-developers',
    'https://www.reddit.com/r/UXPatterns/',
    'https://x.com/thedaviddias',
  ],
  founder: AUTHOR_SCHEMA,
};

// WebSite schema for homepage
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'UX Patterns for Devs',
    description:
      'A comprehensive collection of UX patterns for developers to build effective, accessible, and usable UI components.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
  };
}

// Enhanced Article schema with dates and sections
export function generateArticleSchema(
  title: string,
  description: string,
  path: string,
  image?: string,
  datePublished?: string,
  dateModified?: string,
  section?: string,
  wordCount?: number
) {
  const imageUrl = image && !image.startsWith('http') ? `${BASE_URL}${image}` : image;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: `${BASE_URL}${path}`,
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
    }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(section && { articleSection: section }),
    ...(wordCount && { wordCount }),
    author: AUTHOR_SCHEMA,
    publisher: ORGANIZATION_SCHEMA,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}${path}`,
    },
    inLanguage: 'en-US',
  };
}

// BlogPosting schema for blog posts
export function generateBlogPostingSchema(
  title: string,
  description: string,
  path: string,
  image?: string,
  datePublished?: string,
  dateModified?: string,
  tags?: string[],
  wordCount?: number
) {
  const imageUrl = image && !image.startsWith('http') ? `${BASE_URL}${image}` : image;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    url: `${BASE_URL}${path}`,
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
    }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(tags && tags.length > 0 && { keywords: tags.join(', ') }),
    ...(wordCount && { wordCount }),
    author: AUTHOR_SCHEMA,
    publisher: ORGANIZATION_SCHEMA,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}${path}`,
    },
    inLanguage: 'en-US',
  };
}

// HowTo schema for pattern pages
export function generateHowToSchema(
  title: string,
  description: string,
  path: string,
  steps: Array<{
    name: string;
    text: string;
    url?: string;
    image?: string;
  }>,
  totalTime?: string,
  image?: string
) {
  const imageUrl = image && !image.startsWith('http') ? `${BASE_URL}${image}` : image;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Implement ${title}`,
    description: description,
    url: `${BASE_URL}${path}`,
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
    }),
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image.startsWith('http') ? step.image : `${BASE_URL}${step.image}`,
        },
      }),
    })),
    author: AUTHOR_SCHEMA,
    publisher: ORGANIZATION_SCHEMA,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}${path}`,
    },
  };
}

// ItemList schema for category/listing pages
export function generateItemListSchema(
  title: string,
  description: string,
  path: string,
  items: Array<{
    name: string;
    url: string;
    description?: string;
    position?: number;
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description: description,
    url: `${BASE_URL}${path}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position || index + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
      ...(item.description && { description: item.description }),
    })),
  };
}

// CollectionPage schema for blog listing
export function generateCollectionPageSchema(
  title: string,
  description: string,
  path: string,
  items: Array<{
    name: string;
    url: string;
    datePublished?: string;
    description?: string;
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    url: `${BASE_URL}${path}`,
    hasPart: items.map((item) => ({
      '@type': 'BlogPosting',
      headline: item.name,
      url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
      ...(item.datePublished && { datePublished: item.datePublished }),
      ...(item.description && { description: item.description }),
      author: AUTHOR_SCHEMA,
      publisher: ORGANIZATION_SCHEMA,
    })),
    mainEntity: {
      '@type': 'Blog',
      name: 'UX Patterns for Devs Blog',
      description: 'Articles and insights about UX patterns and developer experience',
      url: `${BASE_URL}/blog`,
      publisher: ORGANIZATION_SCHEMA,
    },
  };
}

// SoftwareSourceCode schema for code examples
export function generateSoftwareSourceCodeSchema(
  name: string,
  description: string,
  programmingLanguage: string,
  codeText: string,
  codeRepository?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: name,
    description: description,
    programmingLanguage: {
      '@type': 'ComputerLanguage',
      name: programmingLanguage,
    },
    text: codeText,
    ...(codeRepository && { codeRepository }),
    author: AUTHOR_SCHEMA,
    publisher: ORGANIZATION_SCHEMA,
  };
}

// Course/LearningResource schema for educational content
export function generateCourseSchema(
  title: string,
  description: string,
  path: string,
  educationalLevel?: string,
  timeRequired?: string,
  prerequisites?: string[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description: description,
    url: `${BASE_URL}${path}`,
    provider: ORGANIZATION_SCHEMA,
    author: AUTHOR_SCHEMA,
    ...(educationalLevel && { educationalLevel }),
    ...(timeRequired && { timeRequired }),
    ...(prerequisites &&
      prerequisites.length > 0 && {
        coursePrerequisites: prerequisites.map((prereq) => ({
          '@type': 'AlignmentObject',
          targetName: prereq,
        })),
      }),
    inLanguage: 'en-US',
    learningResourceType: 'Tutorial',
    teaches: {
      '@type': 'DefinedTerm',
      name: 'UX Patterns',
      description: 'User experience patterns for web development',
    },
  };
}

// Person schema for author pages
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/about#author`,
    name: 'David Dias',
    url: 'https://thedaviddias.com',
    image: 'https://thedaviddias.com/avatar.jpg',
    jobTitle: 'Frontend Developer & UX Enthusiast',
    description:
      'Creator of UX Patterns for Devs, helping developers build better user experiences.',
    sameAs: [
      'https://www.reddit.com/r/UXPatterns/',
      'https://x.com/thedaviddias',
      'https://github.com/thedaviddias',
      'https://linkedin.com/in/thedaviddias',
    ],
    knowsAbout: [
      'User Experience Design',
      'Frontend Development',
      'React',
      'TypeScript',
      'Accessibility',
      'Web Performance',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'UX Patterns for Devs',
      url: BASE_URL,
    },
  };
}

// Helper to combine multiple schemas
export function combineSchemas(...schemas: Record<string, unknown>[]): Record<string, unknown>[] {
  return schemas.filter(Boolean);
}
