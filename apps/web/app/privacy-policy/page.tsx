import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metadataSEO } from "@/app/metadata";
import { MobileTableOfContents } from "@/components/blog/mobile-toc";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { generateArticleSchema, JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/lib/site.config";
import { source } from "@/lib/source";
import { generateBreadcrumbSchema } from "@/utils/generate-breadcrumb-schema";

export default async function PrivacyPolicyPage() {
	// Get the privacy policy page from the pages directory
	const page = source.getPage(["pages", "privacy-policy"]);
	if (!page) notFound();

	// Cast to any to access custom frontmatter fields
	const pageData = page.data as any;
	const MDX = pageData.body;
	const title = pageData.title || "Privacy Policy";
	const description =
		pageData.description || "Privacy policy for UX Patterns for Devs";

	// Generate schemas
	const schemas = [
		generateArticleSchema(
			title,
			description,
			"/privacy-policy",
			undefined, // image
			pageData.datePublished instanceof Date
				? pageData.datePublished.toISOString()
				: pageData.datePublished,
			pageData.dateModified instanceof Date
				? pageData.dateModified.toISOString()
				: pageData.dateModified,
			"Page",
			pageData.wordCount,
		),
		generateBreadcrumbSchema([
			{ name: "Home", url: "/" },
			{ name: title, url: "/privacy-policy" },
		]),
	];

	return (
		<>
			{/* Render JSON-LD schemas */}
			{schemas.map((schema, index) => (
				<JsonLd
					key={`schema-${JSON.stringify(schema).slice(0, 50)}-${index}`}
					data={schema}
				/>
			))}

			<div className="min-h-screen bg-background relative">
				<div className="space-y-4 border-b border-border relative z-10">
					<div className="max-w-7xl mx-auto flex flex-col gap-6 p-6">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-balance">
							{title}
						</h1>

						{description && (
							<p className="text-muted-foreground max-w-4xl md:text-lg md:text-balance">
								{description}
							</p>
						)}
					</div>
				</div>
				<div className="flex divide-x divide-border relative max-w-7xl mx-auto px-4 md:px-0 z-10">
					<div className="absolute max-w-7xl mx-auto left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] lg:w-full h-full border-x border-border p-0 pointer-events-none" />
					<main className="w-full p-0 overflow-hidden">
						<div className="p-6 lg:p-10">
							<div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance prose-lg">
								<MDX />
							</div>
						</div>
					</main>

					<aside className="hidden lg:block w-[350px] flex-shrink-0 p-6 lg:p-10 bg-muted/60 dark:bg-muted/20">
						<div className="sticky top-20 space-y-8">
							<div className="border border-border rounded-lg p-6 bg-card">
								<TableOfContents />
							</div>
						</div>
					</aside>
				</div>

				<MobileTableOfContents />
			</div>
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	const page = source.getPage(["pages", "privacy-policy"]);
	if (!page) notFound();

	const title = page.data.title || "Privacy Policy";
	const description =
		page.data.description || "Privacy policy for UX Patterns for Devs";

	return {
		...metadataSEO,
		title,
		description,
		alternates: {
			canonical: `${siteConfig.url}/privacy-policy`,
		},
		openGraph: {
			...metadataSEO.openGraph,
			title,
			description,
			url: `${siteConfig.url}/privacy-policy`,
			images: [
				{
					url: "/og/opengraph-image.png",
					width: 1200,
					height: 630,
					type: "image/png",
					alt: `${title} - UX Patterns for Developers`,
				},
			],
		},
		twitter: {
			...metadataSEO.twitter,
			title,
			description,
			images: [
				{
					url: "/og/opengraph-image.png",
					alt: `${title} - UX Patterns for Developers`,
				},
			],
		},
	};
}
