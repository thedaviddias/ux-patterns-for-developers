/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents are not react hooks */

import { SuggestPattern } from '@/app/_components/suggest-pattern'
import { JsonLd, generateArticleSchema } from '@app/_components/json-ld'
import { Metadata } from 'next'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: PageProps): Promise<Metadata | null> {
  try {
    const params = await props.params
    const { metadata } = await importPage(params.mdxPath || [], params.lang)

    // Check if this is the homepage
    const isHomepage = !params.mdxPath || params.mdxPath.length === 0

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

  const pageKey = `${params.lang}-${params.mdxPath?.join('-') || 'home'}`

  return (
    <div className="nextra-content">
      <JsonLd data={schemaData} />
      <Wrapper key={pageKey} toc={toc} metadata={metadata}>
        <MDXContent {...props} params={params} />
        {!isHomepage && <SuggestPattern />}
      </Wrapper>
    </div>
  )
}
