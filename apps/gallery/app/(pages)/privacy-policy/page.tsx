import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useMDXComponents } from "@/lib/mdx-components";
import { siteConfig } from "@/lib/site.config";
import { pagesSource } from "@/lib/source";

export const metadata: Metadata = {
	title: `${siteConfig.pages.privacyPolicy.title} - ${siteConfig.name}`,
	description: siteConfig.pages.privacyPolicy.description,
	alternates: {
		canonical: `${siteConfig.url}/privacy-policy`,
	},
	openGraph: {
		title: `${siteConfig.pages.privacyPolicy.title} - ${siteConfig.name}`,
		description: siteConfig.pages.privacyPolicy.description,
		url: `${siteConfig.url}/privacy-policy`,
		type: "website",
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				type: "image/png",
				alt: `${siteConfig.pages.privacyPolicy.title} - ${siteConfig.name}`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${siteConfig.pages.privacyPolicy.title} - ${siteConfig.name}`,
		description: siteConfig.pages.privacyPolicy.description,
		images: [
			{
				url: siteConfig.ogImage,
				alt: `${siteConfig.pages.privacyPolicy.title} - ${siteConfig.name}`,
			},
		],
	},
};

export default function PrivacyPolicyPage() {
	const page = pagesSource.getPage(["privacy-policy"]);
	if (!page) notFound();

	const MDXContent = page.data.body;

	return (
		<div className="container-responsive py-16">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold mb-8">{page.data.title}</h1>
				<div className="prose prose-fd max-w-none">
					<MDXContent components={useMDXComponents({})} />
				</div>
			</div>
		</div>
	);
}
