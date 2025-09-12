import { PROJECT } from "@ux-patterns/constants/author";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metadataSEO } from "@/app/metadata";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDXContent = page.data.body;

	return (
		<DocsPage toc={page.data.toc} full={page.data.full}>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<div className="flex flex-row gap-2 items-center border-b pt-2 pb-6">
				<LLMCopyButton markdownUrl={`${page.url}.mdx`} />
				<ViewOptions
					markdownUrl={`${page.url}.mdx`}
					githubUrl={`${PROJECT.repository.url}/blob/main/apps/kit/content/docs/${page.path}`}
				/>
			</div>
			<DocsBody>
				<MDXContent
					components={getMDXComponents({
						// this allows you to link to other pages with relative file paths
						a: createRelativeLink(source, page),
					})}
				/>
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(
	props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const title = page.data.title || "Documentation";
	const description =
		page.data.description || "UP Kit documentation and component guides.";
	const url = `https://kit.uxpatterns.dev/docs/${params.slug?.join("/") || ""}`;

	return {
		...metadataSEO,
		title,
		description,
		openGraph: {
			...metadataSEO.openGraph,
			title,
			description,
			url,
		},
		twitter: {
			...metadataSEO.twitter,
			title,
			description,
		},
	};
}
