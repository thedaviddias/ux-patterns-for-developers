import {
	JsonLd,
	StructuredDataGenerator,
} from "@ux-patterns/seo/structured-data";
import { NewsletterForm } from "@ux-patterns/ui/components/custom/newsletter";
import type { Metadata } from "next";
import { ComingSoonPatterns } from "@/components/sections/coming-soon-patterns";
import { FAQ } from "@/components/sections/faq";
import { FeaturedPatterns } from "@/components/sections/featured-patterns";
import { Features } from "@/components/sections/features";
import { FinalCTA } from "@/components/sections/final-cta";
import Hero from "@/components/sections/hero";
import { MCPPromo } from "@/components/sections/mcp-promo";
import { StatsBar } from "@/components/sections/stats-bar";
import { siteConfig } from "@/lib/site.config";
import { getPatternCategories } from "@/utils/get-pattern-categories";

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

export default async function HomePage() {
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

	// Fetch pattern data for components that need it
	const categories = await getPatternCategories();
	const patternCount = categories.reduce(
		(acc, cat) => acc + cat.patterns.filter((p) => p.status !== "draft").length,
		0,
	);
	const categoryCount = categories.length;

	return (
		<>
			{schemas.map((schema, index) => (
				<JsonLd
					key={`${Array.isArray(schema["@type"]) ? schema["@type"].join("-") : schema["@type"]}-${index}`}
					data={schema}
				/>
			))}
			<main className="flex flex-1 flex-col">
				{/* Block 1: Hero - Value proposition + trust badge + primary CTA */}
				<Hero />

				{/* Block 2: Stats Bar - Quick credibility signals */}
				<StatsBar
					patternCount={patternCount}
					categoryCount={categoryCount}
					sectionsPerPattern={17}
				/>

				{/* Block 3: Features - Key differentiators */}
				<Features />

				{/* Block 4: Featured Patterns - Proof of content depth */}
				<FeaturedPatterns categories={categories} />

				{/* Block 5: Coming Soon - Show roadmap/upcoming patterns */}
				<ComingSoonPatterns categories={categories} />

				{/* Block 6: MCP Promo - AI integration highlight */}
				<MCPPromo />

				{/* Block 7: FAQ - Address objections */}
				<FAQ />

				{/* Block 8: Final CTA - Clear next action */}
				<FinalCTA />

				{/* Newsletter - Less prominent, at the end */}
				<NewsletterForm />
			</main>
		</>
	);
}
