import {
	JsonLd,
	StructuredDataGenerator,
} from "@ux-patterns/seo/structured-data";
import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import { OverviewGrid } from "@/components/sections/overview-grid";
import { siteConfig } from "@/lib/site.config";

export const metadata: Metadata = {
	title: `${siteConfig.name} - ${siteConfig.pages.home.title}`,
	description: siteConfig.pages.home.description,
	keywords: siteConfig.keywords,
	alternates: {
		canonical: siteConfig.url,
	},
	openGraph: {
		title: siteConfig.name,
		description: siteConfig.pages.home.description,
		url: siteConfig.url,
	},
};

export default function HomePage() {
	const structuredData = new StructuredDataGenerator({
		baseUrl: siteConfig.url,
		organizationName: siteConfig.name,
		organizationLogo: `${siteConfig.url}${siteConfig.logo}`,
		authorName: siteConfig.author.name,
		authorUrl: siteConfig.author.url,
	});

	const schemas = [
		structuredData.website({
			name: siteConfig.name,
			description: siteConfig.description,
			url: siteConfig.url,
		}),
		structuredData.organization({
			name: siteConfig.name,
			logo: `${siteConfig.url}${siteConfig.logo}`,
			sameAs: [siteConfig.links.github, siteConfig.links.twitter],
		}),
	];

	return (
		<>
			{schemas.map((schema, index) => (
				<JsonLd
					key={`${Array.isArray(schema["@type"]) ? schema["@type"].join("-") : schema["@type"]}-${index}`}
					data={schema}
				/>
			))}
			<main className="flex flex-1 flex-col">
				<Hero />
				<OverviewGrid />
			</main>
		</>
	);
}
