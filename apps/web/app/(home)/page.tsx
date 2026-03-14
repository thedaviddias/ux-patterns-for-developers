import {
	JsonLd,
	StructuredDataGenerator,
} from "@ux-patterns/seo/structured-data";
import type { Metadata } from "next";
import { BlogHighlights } from "@/components/sections/blog-highlights";
import { ContentEntryPoints } from "@/components/sections/content-entry-points";
import { FAQ } from "@/components/sections/faq";
import { FeaturedGuides } from "@/components/sections/featured-guides";
import { FeaturedPatterns } from "@/components/sections/featured-patterns";
import { FinalCTA } from "@/components/sections/final-cta";
import { GlossarySpotlight } from "@/components/sections/glossary-spotlight";
import Hero from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { SubscribeForm } from "@/components/subscribe";
import { getBlogPosts, getPages } from "@/lib/content";
import { siteConfig } from "@/lib/site.config";
import { getGlossaryTerms } from "@/utils/get-glossary-terms";
import { getPatternCategories } from "@/utils/get-pattern-categories";

const FEATURED_GUIDE_SLUGS = [
	"pattern-guide/modal-vs-popover-guide",
	"pattern-guide/pagination-vs-infinite-scroll-vs-load-more",
	"pattern-guide/search-field-vs-command-palette",
	"pattern-guide/table-vs-list-vs-cards",
];

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
	const allGuides = getPages({
		filter: (page) =>
			page.slug.startsWith("pattern-guide/") && page.slug !== "pattern-guide",
	});
	const allBlogPosts = getBlogPosts();
	const featuredGuides = FEATURED_GUIDE_SLUGS.map((slug) =>
		allGuides.find((guide) => guide.slug === slug),
	).filter((guide): guide is (typeof allGuides)[number] => Boolean(guide));
	const glossaryTerms = await getGlossaryTerms();
	const glossaryHighlights = [...glossaryTerms]
		.sort((a, b) => b.relatedPatterns.length - a.relatedPatterns.length)
		.slice(0, 4);
	const blogPosts = allBlogPosts.slice(0, 3);
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
				<Hero />
				<ContentEntryPoints
					patternCount={patternCount}
					glossaryCount={glossaryTerms.length}
					guideCount={allGuides.length}
					blogCount={allBlogPosts.length}
				/>
				<FeaturedPatterns categories={categories} />
				<FeaturedGuides guides={featuredGuides} />
				<GlossarySpotlight terms={glossaryHighlights} />
				<BlogHighlights posts={blogPosts} />
				<StatsBar
					patternCount={patternCount}
					categoryCount={categoryCount}
					sectionsPerPattern={17}
				/>
				<FAQ />
				<FinalCTA />
				<SubscribeForm />
			</main>
		</>
	);
}
