/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents are not react hooks */

import { BASE_URL } from '@/app/_constants/project'
import { JsonLd, generateArticleSchema } from '@app/_components/json-ld'
import { generateBreadcrumbSchema } from '@app/_utils/generate-breadcrumb-schema'
import { Metadata } from 'next'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: PageProps): Promise<Metadata | null> {
  try {
    const params = await props.params
    const { metadata } = await importPage(params.mdxPath || [], params.lang)
    const isHomepage = !params.mdxPath || params.mdxPath.length === 0

    // Include the language prefix in the canonical path
    const canonicalPath = `/${params.lang}${params.mdxPath ? `/${params.mdxPath.join('/')}` : ''}`

    const ogImage = {
      url: isHomepage
        ? '/og/opengraph-image.png'
        : `/api/og?title=${encodeURIComponent(metadata.title || '')}`,
      width: 1200,
      height: 630,
      type: 'image/png',
    }

    return {
      ...metadata,
      openGraph: {
        ...metadata.openGraph,
        images: [ogImage]
      },
      alternates: {
        canonical: `${BASE_URL}${canonicalPath}`
      }
    }
  } catch (e) {
    console.error('Error generating metadata:', e)
    return null
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
  const result = await importPage(params.mdxPath, params.lang)
  const { default: MDXContent, toc, metadata } = result

  // Get the OG image URL from metadata
  const isHomepage = !params.mdxPath || params.mdxPath.length === 0
  const ogImageUrl = isHomepage
    ? '/og/opengraph-image.png'
    : `/api/og?title=${encodeURIComponent(metadata.title || '')}`

  const schemaData = generateArticleSchema(
    metadata.title || '',
    metadata.description || '',
    `/${params.lang}/${params.mdxPath?.join('/') || ''}`,
    ogImageUrl
  )

  // Generate breadcrumb items
  const breadcrumbs = [
    { title: 'Home', url: `/${params.lang}` }
  ]

  if (params.mdxPath) {
    let currentPath = ''
    for (const segment of params.mdxPath) {
      currentPath += `/${segment}`
      breadcrumbs.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        url: `/${params.lang}${currentPath}`
      })
    }
  }

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs)
  const pageKey = `${params.lang}-${params.mdxPath?.join('-') || 'home'}`

  return (
    <>
      <JsonLd data={schemaData} />
      <JsonLd data={breadcrumbSchema} />
      <div className="nextra-content">
        <Wrapper key={pageKey} toc={toc} metadata={metadata}>
          <MDXContent {...props} params={params} />
        </Wrapper>
      </div>
    </>
  )
}
