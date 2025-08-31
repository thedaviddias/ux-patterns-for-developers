/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents are not react hooks */

import { generateArticleSchema, JsonLd } from '@app/_components/json-ld';
import { generateBreadcrumbSchema } from '@app/_utils/generate-breadcrumb-schema';
import type { Metadata } from 'next';
import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { useMDXComponents } from '../../../mdx-components';

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata({ params }): Promise<Metadata> {
  const resolvedParams = await params;

  // Ensure lang is a string and provide fallback
  const locale = typeof resolvedParams.lang === 'string' ? resolvedParams.lang : 'en';
  // Ensure mdxPath is an array
  const pathSegments = Array.isArray(resolvedParams.mdxPath) ? resolvedParams.mdxPath : [];

  // For importPage, the lang parameter should be the locale string
  const result = await importPage(pathSegments, locale);
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
      canonical: `${baseUrl}/en/${path ? `${path}` : ''}`,
    },
  };
}

type PageProps = Readonly<{
  params: Promise<{
    mdxPath: string[];
    lang: string;
  }>;
}>;

export default async function Page(props: PageProps) {
  const params = await props.params;
  // Ensure lang is a string and provide fallback
  const locale = typeof params.lang === 'string' ? params.lang : 'en';
  // Ensure mdxPath is an array
  const pathSegments = Array.isArray(params.mdxPath) ? params.mdxPath : [];
  // For importPage, the lang parameter should be the locale string
  const result = await importPage(pathSegments, locale);
  const { default: MDXContent, toc, metadata } = result;

  const mdxComponents = useMDXComponents({});
  const Wrapper = mdxComponents.wrapper;

  // Use the same logic for OG image as in generateMetadata
  const isHomepage = !params.mdxPath || params.mdxPath.length === 0;
  const title = metadata?.title || 'UX Patterns for Devs';
  const description = metadata?.description || '';
  const ogImageUrl = isHomepage
    ? '/og/opengraph-image.png'
    : `/api/og?title=${encodeURIComponent(title)}`;

  const schemaData = generateArticleSchema(
    title,
    description,
    `/en/${params.mdxPath?.join('/') || ''}`,
    ogImageUrl
  );

  // Generate breadcrumb items for patterns only
  const breadcrumbs: Array<{ title: string; url: string }> = [];

  if (params.mdxPath) {
    let currentPath = '';
    for (const segment of params.mdxPath) {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        url: `/en${currentPath}`,
      });
    }
  }

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const pageKey = `en-${params.mdxPath?.join('-') || 'home'}`;

  return (
    <>
      <JsonLd data={schemaData} />
      {breadcrumbs.length > 0 && <JsonLd data={breadcrumbSchema} />}
      <div className="nextra-content">
        <Wrapper key={pageKey} toc={toc} metadata={metadata} sourceCode={result.sourceCode}>
          <MDXContent {...props} params={params} />
        </Wrapper>
      </div>
    </>
  );
}
