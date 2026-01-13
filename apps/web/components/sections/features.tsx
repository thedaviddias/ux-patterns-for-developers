import { Accessibility, BookOpen, Bot, Compass } from "lucide-react";

const FEATURES = [
	{
		icon: BookOpen,
		title: "Comprehensive Documentation",
		description:
			"17 sections per pattern including anatomy, best practices, accessibility, testing, and design tokens.",
	},
	{
		icon: Compass,
		title: "Decision Guidance",
		description:
			"Know exactly when to use each pattern with dedicated 'When to Use' and 'When Not to Use' sections.",
	},
	{
		icon: Accessibility,
		title: "Accessibility-First",
		description:
			"Every pattern includes WCAG guidelines, keyboard navigation specs, and screen reader considerations.",
	},
	{
		icon: Bot,
		title: "AI Patterns Included",
		description:
			"Modern patterns for AI interfaces: chat, streaming responses, prompt inputs, and more.",
	},
] as const;

export function Features() {
	return (
		<section
			aria-labelledby="features-heading"
			className="py-16 sm:py-20 lg:py-24"
		>
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="text-center mb-12">
					<h2
						id="features-heading"
						className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight"
					>
						Why developers use this resource
					</h2>
					<p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
						More than just component examples—comprehensive guidance for
						building better interfaces.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{FEATURES.map((feature) => (
						<div
							key={feature.title}
							className="relative rounded-xl border border-border bg-card p-6"
						>
							<div className="flex items-start gap-4">
								{/* Icon */}
								<div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
									<feature.icon className="h-5 w-5" aria-hidden="true" />
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<h3 className="text-base font-semibold text-foreground mb-1">
										{feature.title}
									</h3>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
