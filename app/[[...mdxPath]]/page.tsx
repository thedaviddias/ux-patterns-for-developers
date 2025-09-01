/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents are not react hooks */

import {
  generateArticleSchema,
  generateBlogPostingSchema,
  generateCollectionPageSchema,
  generateCourseSchema,
  generateHowToSchema,
  generateItemListSchema,
  generatePersonSchema,
  generateWebSiteSchema,
  JsonLd,
  ORGANIZATION_SCHEMA,
} from '@app/_components/json-ld';
import { generateBreadcrumbSchema } from '@app/_utils/generate-breadcrumb-schema';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { useMDXComponents } from '../../mdx-components';

// Type definitions for pattern and blog items
interface PatternItem {
  title?: string;
  name?: string;
  href?: string;
  url?: string;
  slug?: string;
  description?: string;
  summary?: string;
}

interface BlogPost {
  title?: string;
  name?: string;
  href?: string;
  url?: string;
  slug?: string;
  date?: string;
  datePublished?: string;
  description?: string;
  summary?: string;
}

// Extended metadata type for our custom properties
interface ExtendedMetadata {
  title?: string;
  description?: string;
  date?: string;
  datePublished?: string;
  lastModified?: string;
  dateModified?: string;
  tags?: string[];
  keywords?: string[];
  wordCount?: number;
  steps?: Array<{
    name: string;
    text: string;
    url?: string;
    image?: string;
  }>;
  totalTime?: string;
  patterns?: PatternItem[];
  items?: PatternItem[];
  posts?: BlogPost[];
}

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata({ params }): Promise<Metadata> {
  const resolvedParams = await params;

  // Ensure mdxPath is an array
  const pathSegments = Array.isArray(resolvedParams.mdxPath) ? resolvedParams.mdxPath : [];

  // Skip importing for special paths that don't have content
  if (pathSegments[0] === '.well-known' || pathSegments[0] === 'api') {
    return {
      title: 'UX Patterns for Devs',
      description:
        'A collection of UX patterns for developers to build effective, accessible, and usable UI components.',
    };
  }

  // Import page directly without locale prefix
  let result: Awaited<ReturnType<typeof importPage>> | undefined;
  try {
    result = await importPage(pathSegments);
  } catch (_error) {
    // Return default metadata if page not found
    return {
      title: 'Page Not Found | UX Patterns for Devs',
      description: 'The requested page could not be found.',
    };
  }
  const isHomepage = !resolvedParams.mdxPath || resolvedParams.mdxPath.length === 0;
  const baseUrl = 'https://uxpatterns.dev';
  const path = resolvedParams.mdxPath?.join('/') || '';

  // Shared metadata - handle new Nextra structure
  const title = result.metadata?.title || 'UX Patterns for Devs';
  const description = result.metadata?.description || '';

  // Page type detection
  const isPatternPage = resolvedParams.mdxPath?.[0] === 'patterns';
  const isGlossaryPage = resolvedParams.mdxPath?.[0] === 'glossary';

  // Title with context
  const titleWithContext = isPatternPage
    ? `${title} Pattern`
    : isGlossaryPage
      ? `${title} - UX Glossary Term`
      : title;

  // OG image handling
  const patternName = isPatternPage
    ? resolvedParams.mdxPath?.[resolvedParams.mdxPath.length - 1]
    : null;
  const ogImageUrl = isHomepage
    ? '/og/opengraph-image.png'
    : `/api/og?title=${encodeURIComponent(titleWithContext)}`;

  return {
    title: titleWithContext,
    description,
    openGraph: {
      title: titleWithContext,
      description,
      type: isHomepage ? 'website' : 'article',
      images:
        isPatternPage && patternName
          ? [
              {
                url: `/covers/patterns/${patternName}.png`,
                width: 800,
                height: 400,
                alt: `Example of ${patternName} pattern`,
              },
            ]
          : [
              {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: description || title,
              },
            ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@thedaviddias',
      creator: '@thedaviddias',
      images:
        isPatternPage && patternName
          ? [
              {
                url: `/covers/patterns/${patternName}.png`,
                alt: `Example of ${patternName} pattern`,
              },
            ]
          : [
              {
                url: ogImageUrl,
                alt: description || title,
              },
            ],
    },
    alternates: {
      canonical: `${baseUrl}/${path ? `${path}` : ''}`,
    },
  };
}

type PageProps = Readonly<{
  params: Promise<{
    mdxPath: string[];
  }>;
}>;

export default async function Page(props: PageProps) {
  const params = await props.params;
  const mdxComponents = useMDXComponents({});

  // Ensure mdxPath is an array
  const pathSegments = Array.isArray(params.mdxPath) ? params.mdxPath : [];

  // Skip rendering for special paths that don't have content
  if (pathSegments[0] === '.well-known' || pathSegments[0] === 'api') {
    notFound();
  }

  // Import page directly without locale prefix
  let result: Awaited<ReturnType<typeof importPage>> | undefined;
  try {
    result = await importPage(pathSegments);
  } catch (_error) {
    notFound();
  }

  if (!result) {
    notFound();
  }

  const { default: MDXContent, toc, metadata } = result;
  const extendedMetadata = metadata as ExtendedMetadata;
  const Wrapper = mdxComponents.wrapper;

  // Determine page type and properties
  const isHomepage = !params.mdxPath || params.mdxPath.length === 0;
  const isBlogPost = pathSegments[0] === 'blog' && pathSegments.length > 1;
  const isBlogListing = pathSegments[0] === 'blog' && pathSegments.length === 1;
  const isPatternPage = pathSegments[0] === 'patterns' && pathSegments.length > 2;
  const isPatternCategory = pathSegments[0] === 'patterns' && pathSegments.length === 2;
  const isPatternsIndex = pathSegments[0] === 'patterns' && pathSegments.length === 1;
  const isGettingStarted = pathSegments.join('/') === 'patterns/getting-started';
  const isAboutPage = pathSegments[0] === 'about';
  const isGlossaryPage = pathSegments[0] === 'glossary';

  const title = extendedMetadata?.title || 'UX Patterns for Devs';
  const description = extendedMetadata?.description || '';
  const path = `/${params.mdxPath?.join('/') || ''}`;
  const ogImageUrl = isHomepage
    ? '/og/opengraph-image.png'
    : `/api/og?title=${encodeURIComponent(title)}`;

  // Generate appropriate schemas based on page type
  const schemas: Record<string, unknown>[] = [];

  if (isHomepage) {
    // Homepage gets WebSite and Organization schemas
    schemas.push(generateWebSiteSchema());
    schemas.push(ORGANIZATION_SCHEMA);
  } else if (isBlogPost) {
    // Blog posts get BlogPosting schema
    const datePublished = extendedMetadata?.date || extendedMetadata?.datePublished;
    const dateModified =
      extendedMetadata?.lastModified || extendedMetadata?.dateModified || datePublished;
    const tags = extendedMetadata?.tags || extendedMetadata?.keywords || [];

    schemas.push(
      generateBlogPostingSchema(
        title,
        description,
        path,
        ogImageUrl,
        datePublished,
        dateModified,
        tags,
        extendedMetadata?.wordCount
      )
    );
  } else if (isPatternPage) {
    // Pattern pages get both Article and HowTo schemas
    const category = pathSegments[1];
    const _patternName = pathSegments[2];

    // Generate HowTo steps from metadata or default steps
    const steps = extendedMetadata?.steps || [
      {
        name: 'Understand the pattern',
        text: `Learn when and why to use the ${title} pattern in your application.`,
      },
      {
        name: 'Review the anatomy',
        text: `Examine the key components and structure of the ${title} pattern.`,
      },
      {
        name: 'Implement the pattern',
        text: `Follow the code examples to implement the ${title} pattern in your project.`,
      },
      {
        name: 'Apply best practices',
        text: `Ensure accessibility, performance, and user experience best practices.`,
      },
    ];

    schemas.push(
      generateHowToSchema(
        title,
        description,
        path,
        steps,
        extendedMetadata?.totalTime || 'PT30M',
        ogImageUrl
      )
    );

    // Also add Article schema for patterns
    schemas.push(
      generateArticleSchema(
        title,
        description,
        path,
        ogImageUrl,
        extendedMetadata?.datePublished,
        extendedMetadata?.dateModified,
        category,
        extendedMetadata?.wordCount
      )
    );
  } else if (isGettingStarted) {
    // Getting Started page gets Course schema
    schemas.push(
      generateCourseSchema(title, description, path, 'Beginner', 'PT1H', [
        'Basic HTML',
        'Basic CSS',
        'Basic JavaScript',
      ])
    );
  } else if (isAboutPage) {
    // About page gets Person and Organization schemas
    schemas.push(generatePersonSchema());
    schemas.push(ORGANIZATION_SCHEMA);
  } else if (isPatternsIndex || isPatternCategory) {
    // Pattern index and category pages get ItemList schema
    const items = extendedMetadata?.patterns || extendedMetadata?.items || [];

    if (items.length > 0) {
      schemas.push(
        generateItemListSchema(
          title,
          description,
          path,
          items.map((item: PatternItem, index: number) => ({
            name: item.title || item.name || 'Untitled Pattern',
            url: item.href || item.url || `${path}/${item.slug}`,
            description: item.description || item.summary,
            position: index + 1,
          }))
        )
      );
    }

    // Also add Article schema
    schemas.push(
      generateArticleSchema(
        title,
        description,
        path,
        ogImageUrl,
        extendedMetadata?.datePublished,
        extendedMetadata?.dateModified,
        'Patterns',
        extendedMetadata?.wordCount
      )
    );
  } else if (isBlogListing) {
    // Blog listing page gets CollectionPage schema
    const posts = extendedMetadata?.posts || extendedMetadata?.items || [];

    if (posts.length > 0) {
      schemas.push(
        generateCollectionPageSchema(
          'UX Patterns Blog',
          'Articles and insights about UX patterns and developer experience',
          path,
          posts.map((post: BlogPost) => ({
            name: post.title || post.name || 'Untitled Post',
            url: post.href || post.url || `/blog/${post.slug}`,
            datePublished: post.date || post.datePublished,
            description: post.description || post.summary,
          }))
        )
      );
    } else {
      // Fallback to Article schema if no posts
      schemas.push(
        generateArticleSchema(
          title,
          description,
          path,
          ogImageUrl,
          extendedMetadata?.datePublished,
          extendedMetadata?.dateModified,
          'Blog',
          extendedMetadata?.wordCount
        )
      );
    }
  } else if (isGlossaryPage && pathSegments.length === 1) {
    // Glossary index gets Article schema
    schemas.push(
      generateArticleSchema(
        title,
        description,
        path,
        ogImageUrl,
        extendedMetadata?.datePublished,
        extendedMetadata?.dateModified,
        'Glossary',
        extendedMetadata?.wordCount
      )
    );
  } else {
    // Default to Article schema for other pages
    schemas.push(
      generateArticleSchema(
        title,
        description,
        path,
        ogImageUrl,
        extendedMetadata?.datePublished,
        extendedMetadata?.dateModified,
        pathSegments[0],
        extendedMetadata?.wordCount
      )
    );
  }

  // Generate breadcrumb items
  const breadcrumbs: Array<{ title: string; url: string }> = [];

  if (params.mdxPath) {
    let currentPath = '';
    for (const segment of params.mdxPath) {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        url: `${currentPath}`,
      });
    }
  }

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  if (breadcrumbs.length > 0) {
    schemas.push(breadcrumbSchema);
  }

  const pageKey = `${params.mdxPath?.join('-') || 'home'}`;

  return (
    <>
      {schemas.map((schema) => {
        const schemaType = (schema as { '@type'?: string })['@type'] || 'Schema';
        const schemaId = (schema as { '@id'?: string })['@id'] || '';
        const uniqueKey = schemaId
          ? `${schemaType}-${schemaId.split('#')[1] || schemaId.split('/').pop()}`
          : `${schemaType}-${JSON.stringify(schema).slice(0, 50)}`;
        return <JsonLd key={uniqueKey} data={schema} />;
      })}
      <div className="nextra-content">
        <Wrapper key={pageKey} toc={toc} metadata={metadata} sourceCode={result.sourceCode}>
          <MDXContent {...props} params={params} />
        </Wrapper>
      </div>
    </>
  );
}
