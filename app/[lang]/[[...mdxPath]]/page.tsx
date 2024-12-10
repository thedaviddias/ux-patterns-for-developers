/* eslint-disable react-hooks/rules-of-hooks -- false positive, useMDXComponents are not react hooks */

import { SuggestPattern } from '@/app/_components/suggest-pattern'
import { JsonLd, generateArticleSchema } from '@app/_components/json-ld'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath, params.lang)
  return metadata
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

  const schemaData = generateArticleSchema(
    metadata.title || '',
    metadata.description || '',
    `/${params.lang}/${params.mdxPath?.join('/') || ''}`
  )

  return (
    <>
      <JsonLd data={schemaData} />
      <Wrapper toc={toc} metadata={metadata}>
        <MDXContent {...props} params={params} />
        <SuggestPattern />
      </Wrapper>
    </>
  )
}
