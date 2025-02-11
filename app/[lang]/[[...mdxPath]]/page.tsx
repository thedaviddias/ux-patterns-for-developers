/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents are not react hooks */

import { JsonLd, generateArticleSchema } from '@app/_components/json-ld'
import { generateBreadcrumbSchema } from '@app/_utils/generate-breadcrumb-schema'
import { Metadata } from 'next'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata({ params }): Promise<Metadata> {
  const { frontMatter, metadata } = await importPage(params.mdxPath || [], params.lang)
  const isHomepage = !params.mdxPath || params.mdxPath.length === 0
  const baseUrl = 'https://uxpatterns.dev'
  const path = params.mdxPath?.join('/') || ''

  // Shared metadata
  const title = frontMatter?.title || metadata?.title || 'UX Patterns for Devs'
  const description = frontMatter?.description || metadata?.description || ''
  const summary = frontMatter?.summary || ''

  // Page type detection
  const isPatternPage = params.mdxPath?.[0] === 'patterns'
  const isGlossaryPage = params.mdxPath?.[0] === 'glossary'

  // Title with context
  const titleWithContext = isPatternPage
    ? `${title} Pattern`
    : isGlossaryPage
      ? `${title} - UX Glossary Term`
      : title

  // OG image handling
  const patternName = isPatternPage ? params.mdxPath?.[params.mdxPath.length - 1] : null
  const ogImageUrl = isHomepage
    ? '/og/opengraph-image.png'
    : `/api/og?title=${encodeURIComponent(titleWithContext)}`

  return {
    title: titleWithContext,
    description,
    openGraph: {
      title: titleWithContext,
      description,
      type: isHomepage ? 'website' : 'article',
      images: isPatternPage && patternName ? [{
        url: `/covers/patterns/${patternName}.png`,
        width: 800,
        height: 400,
        alt: `Example of ${patternName} pattern`,
      }] : [{
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: description || title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@thedaviddias',
      creator: '@thedaviddias',
      images: isPatternPage && patternName ? [{
        url: `/covers/patterns/${patternName}.png`,
        alt: `Example of ${patternName} pattern`,
      }] : [{
        url: ogImageUrl,
        alt: description || title,
      }],
    },
    alternates: {
      canonical: `${baseUrl}/en/${path ? `${path}` : ''}`,
    },
  }
}

type PageProps = Readonly<{
  params: Promise<{
    mdxPath: string[]
    lang: string
  }>
}>

const Wrapper = useMDXComponents().wrapper

export default async function Page(props: PageProps) {
  const params = await props.params
  const { default: MDXContent, toc, metadata } = await importPage(params.mdxPath, params.lang)

  // Use the same logic for OG image as in generateMetadata
  const isHomepage = !params.mdxPath || params.mdxPath.length === 0
  const title = metadata?.title || 'UX Patterns for Devs'
  const description = metadata?.description || ''
  const ogImageUrl = isHomepage
    ? '/og/opengraph-image.png'
    : `/api/og?title=${encodeURIComponent(title)}`

  const schemaData = generateArticleSchema(
    title,
    description,
    `/en/${params.mdxPath?.join('/') || ''}`,
    ogImageUrl
  )

  // Generate breadcrumb items for patterns only
  const breadcrumbs: Array<{ title: string; url: string }> = []

  if (params.mdxPath) {
    let currentPath = ''
    for (const segment of params.mdxPath) {
      currentPath += `/${segment}`
      breadcrumbs.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        url: `/en${currentPath}`
      })
    }
  }

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)
  const pageKey = `en-${params.mdxPath?.join('-') || 'home'}`

  return (
    <>
      <JsonLd data={schemaData} />
      {breadcrumbs.length > 0 && <JsonLd data={breadcrumbSchema} />}
      <div className="nextra-content">
        <Wrapper key={pageKey} toc={toc} metadata={metadata}>
          <MDXContent {...props} params={params} />
        </Wrapper>
      </div>
    </>
  )
}
