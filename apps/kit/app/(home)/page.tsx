import {
	JsonLd,
	StructuredDataGenerator,
} from "@ux-patterns/seo/structured-data";
import { NewsletterForm } from "@ux-patterns/ui/components/custom/newsletter";
import { Button } from "@ux-patterns/ui/components/shadcn/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ux-patterns/ui/components/shadcn/card";
import {
	ArrowRight,
	BookOpen,
	Code,
	Globe,
	Shield,
	Smartphone,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/sections/hero";
import { siteConfig } from "@/lib/site.config";

export const metadata: Metadata = {
	title: `${siteConfig.name} - ${siteConfig.pages.home.title}`,
	description: siteConfig.pages.home.description,
	keywords: siteConfig.keywords,
	alternates: {
		canonical: siteConfig.url,
	},
	openGraph: {
		title: `${siteConfig.name} - ${siteConfig.pages.home.title}`,
		description: siteConfig.pages.home.description,
		url: siteConfig.url,
	},
};

export default function HomePage() {
	const structuredData = new StructuredDataGenerator({
		baseUrl: siteConfig.url,
		organizationName: siteConfig.name,
		organizationLogo: `${siteConfig.url}${siteConfig.logo}`,
	});

	const schemas = [
		structuredData.website({
			name: siteConfig.name,
			description: siteConfig.description,
			url: siteConfig.url,
		}),
		structuredData.softwareApplication({
			name: siteConfig.name,
			description: siteConfig.description,
			applicationCategory: "DeveloperApplication",
			operatingSystem: "Any",
			offers: {
				price: "0",
				priceCurrency: "USD",
			},
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
				{/* Hero Section */}
				<Hero />

				{/* Features Section */}
				<section className="container mx-auto px-4 py-16">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2] tracking-tighter">
							Everything you need to build great UX
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							From simple components to complex patterns, UP Kit provides the
							tools and guidance to create exceptional user experiences.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<Card>
							<CardHeader>
								<BookOpen className="h-8 w-8 mb-2 text-primary" />
								<CardTitle>Comprehensive Documentation</CardTitle>
								<CardDescription>
									Detailed guides for each pattern with best practices and
									real-world examples.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<Shield className="h-8 w-8 mb-2 text-primary" />
								<CardTitle>Accessibility First</CardTitle>
								<CardDescription>
									Every pattern follows WCAG guidelines and includes ARIA best
									practices out of the box.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<Zap className="h-8 w-8 mb-2 text-primary" />
								<CardTitle>Performance Focused</CardTitle>
								<CardDescription>
									Optimized components with performance guidelines and best
									practices for each pattern.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<Smartphone className="h-8 w-8 mb-2 text-primary" />
								<CardTitle>Mobile First</CardTitle>
								<CardDescription>
									Responsive patterns designed with mobile-first approach and
									cross-device compatibility.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<Globe className="h-8 w-8 mb-2 text-primary" />
								<CardTitle>SEO Optimized</CardTitle>
								<CardDescription>
									Guidelines for making each pattern search-engine friendly with
									proper semantic markup.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<Code className="h-8 w-8 mb-2 text-primary" />
								<CardTitle>Developer Experience</CardTitle>
								<CardDescription>
									Copy-paste components with TypeScript support and
									comprehensive code examples.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</section>

				{/* Newsletter Section */}
				<section className="container mx-auto px-4 py-16">
					<NewsletterForm />
				</section>

				{/* Getting Started */}
				<section className="bg-muted/50 py-16">
					<div className="container mx-auto px-4">
						<div className="max-w-3xl mx-auto text-center">
							<h2 className="text-3xl md:text-4xl font-bold mb-4">
								Ready to get started?
							</h2>
							<p className="text-xl text-muted-foreground mb-8">
								Install UP Kit components and start building better user
								experiences today.
							</p>
							<div className="bg-background rounded-lg p-6 mb-8">
								<code className="text-sm">{siteConfig.installCommand}</code>
							</div>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" asChild>
									<Link href="/docs">
										Get Started <ArrowRight className="h-4 w-4" />
									</Link>
								</Button>
								<Button variant="outline" size="lg" asChild>
									<Link href="/docs/components/button">View Components</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
