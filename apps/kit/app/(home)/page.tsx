import { Badge } from "@ux-patterns/ui/components/shadcn/badge";
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
	Palette,
	Shield,
	Smartphone,
	Zap,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
	return (
		<main className="flex flex-1 flex-col">
			{/* Hero Section */}
			<section className="container mx-auto px-4 py-16 md:py-24 text-center">
				<div className="max-w-4xl mx-auto">
					<Badge variant="secondary" className="mb-6">
						Copy & Paste Ready
					</Badge>
					<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
						UP Kit
					</h1>
					<p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
						Ship better UX than most design teams. Without the meetings. Production-ready components with all the UX decisions already made. Every pattern, animation, and interaction battle-tested. Copy the excellence, skip the committees.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
						<Button asChild size="lg">
							<Link href="/docs">
								Get Started <ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
						<Button variant="outline" size="lg" asChild>
							<Link href="/docs/components/button">View Components</Link>
						</Button>
						<Button variant="ghost" size="lg" asChild>
							<Link href="https://uxpatterns.dev">
								Learn the Patterns <ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
					</div>
					<div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Code className="h-4 w-4" />
							<span>React + TypeScript</span>
						</div>
						<div className="flex items-center gap-2">
							<Palette className="h-4 w-4" />
							<span>Tailwind CSS</span>
						</div>
						<div className="flex items-center gap-2">
							<Shield className="h-4 w-4" />
							<span>WCAG 2.2 Compliant</span>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="container mx-auto px-4 py-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
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
								Copy-paste components with TypeScript support and comprehensive
								code examples.
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
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
							<code className="text-sm">
								npx shadcn@latest add @upkit/button
							</code>
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
	);
}
