import { ArrowRight, Bot, Code, Search, Shield } from "lucide-react";
import Link from "next/link";

const features = [
	{
		icon: Search,
		title: "11 Tools",
		description: "Pattern discovery, search, and suggestions",
	},
	{
		icon: Shield,
		title: "WCAG Checking",
		description: "Built-in accessibility compliance",
	},
	{
		icon: Code,
		title: "Code Review",
		description: "Check against UX best practices",
	},
];

export function MCPPromo() {
	return (
		<section
			className="py-12 sm:py-16"
			aria-labelledby="mcp-promo-heading"
		>
			<div className="container mx-auto px-4 md:px-6">
				<div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/20 p-6 sm:p-8 md:p-10 lg:p-12">
					<div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
						{/* Content */}
						<div className="space-y-6">
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
								<Bot className="size-4" />
								<span>AI Integration</span>
							</div>

							<h2
								id="mcp-promo-heading"
								className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-balance"
							>
								AI-Powered Pattern Assistant
							</h2>

							<p className="text-muted-foreground text-lg max-w-xl">
								Integrate UX Patterns directly into Claude, Cursor, and other
								AI-powered development tools using the Model Context Protocol.
							</p>

							<div className="flex flex-wrap gap-3">
								<Link
									href="/mcp"
									className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg font-medium text-sm hover:bg-foreground/90 transition-colors group"
								>
									Setup MCP Server
									<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
								</Link>
								<Link
									href="/mcp#tools"
									className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg font-medium text-sm hover:bg-accent transition-colors"
								>
									View All Tools
								</Link>
							</div>
						</div>

						{/* Feature Cards */}
						<div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
							{features.map((feature) => (
								<div
									key={feature.title}
									className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/50"
								>
									<div className="flex-shrink-0 p-2 rounded-lg bg-muted">
										<feature.icon className="size-4 text-foreground" />
									</div>
									<div>
										<h3 className="font-medium text-sm">{feature.title}</h3>
										<p className="text-xs text-muted-foreground mt-0.5">
											{feature.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
