import { Badge } from "@ux-patterns/ui/components/shadcn/badge";
import { Button } from "@ux-patterns/ui/components/shadcn/button";
import {
	Card,
	CardContent,
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
						UX Patterns for Developers
					</Badge>
					<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
						UP Kit
					</h1>
					<p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						A comprehensive collection of UX patterns and UI components for
						developers who want to build effective, accessible, and usable
						interfaces.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
						<Button asChild size="lg">
							<Link href="/docs">
								Get Started <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button variant="outline" size="lg" asChild>
							<Link href="/examples">View Examples</Link>
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

			{/* Patterns Preview */}
			<section className="container mx-auto px-4 py-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Available Patterns
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Explore our growing collection of UX patterns across different
						categories.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="text-lg">Forms</CardTitle>
							<CardDescription>
								Input fields, buttons, validation, and form patterns
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								<Badge variant="secondary">Button</Badge>
								<Badge variant="secondary">Text Field</Badge>
								<Badge variant="secondary">Autocomplete</Badge>
								<Badge variant="secondary">+5 more</Badge>
							</div>
						</CardContent>
					</Card>
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="text-lg">Navigation</CardTitle>
							<CardDescription>
								Menus, breadcrumbs, pagination, and navigation patterns
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								<Badge variant="secondary">Breadcrumb</Badge>
								<Badge variant="secondary">Pagination</Badge>
								<Badge variant="secondary">Back to Top</Badge>
								<Badge variant="secondary">+4 more</Badge>
							</div>
						</CardContent>
					</Card>
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="text-lg">Content Management</CardTitle>
							<CardDescription>
								Modals, tooltips, accordions, and content patterns
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								<Badge variant="secondary">Modal</Badge>
								<Badge variant="secondary">Tooltip</Badge>
								<Badge variant="secondary">Accordion</Badge>
								<Badge variant="secondary">+3 more</Badge>
							</div>
						</CardContent>
					</Card>
					<Card className="hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="text-lg">Data Display</CardTitle>
							<CardDescription>
								Tables, charts, lists, and data visualization patterns
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								<Badge variant="secondary">Table</Badge>
								<Badge variant="secondary">Chart</Badge>
								<Badge variant="secondary">Card Grid</Badge>
								<Badge variant="secondary">+2 more</Badge>
							</div>
						</CardContent>
					</Card>
				</div>
				<div className="text-center mt-8">
					<Button variant="outline" asChild>
						<Link href="/docs">
							View All Patterns <ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
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
								npx shadcn@latest add button card badge
							</code>
						</div>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg" asChild>
								<Link href="/docs">
									Get Started <ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button variant="outline" size="lg" asChild>
								<Link href="/examples">View Examples</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
