import Link from "next/link";
import { getPatternCategories, getPatternCategory } from "@/lib/pattern-utils";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface BrowseNavigationProps {
	className?: string;
	currentPlatform?: string;
	currentQuality?: string;
}

export async function BrowseNavigation({
	className,
	currentQuality = "all",
	currentPlatform = "web",
}: BrowseNavigationProps) {
	const patternData = await getPatternCategories();

	return (
		<div className={cn("bg-fd-card", className)}>
			<div className="container-responsive py-8">
				{/* Pattern Categories Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Categories */}
					<div>
						<div className="text-sm text-fd-muted-foreground mb-4">
							Categories
						</div>
						<ul className="space-y-3">
							{patternData.categories.map((category) => {
								// Convert category title to slug format for URL
								const categorySlug = category.title
									.toLowerCase()
									.replace(/\s+/g, "-");

								return (
									<li key={category.title}>
										<Link
											href={
												currentQuality !== "all"
													? ROUTES.withQuality(
															ROUTES.category(
																currentPlatform as "web" | "mobile",
																categorySlug,
															),
															currentQuality as "do" | "dont",
														)
													: ROUTES.category(
															currentPlatform as "web" | "mobile",
															categorySlug,
														)
											}
											className="text-lg font-semibold text-fd-foreground hover:text-fd-muted-foreground transition-colors"
										>
											{category.title}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>

					{/* Pages & Views */}
					<div>
						<div className="text-sm text-fd-muted-foreground mb-4">
							Pages & Views
						</div>
						<ul className="space-y-3">
							{
								await Promise.all(
									patternData.screens.map(async (screen: string) => {
										const patternSlug = screen
											.toLowerCase()
											.replace(/\s+/g, "-");
										// Dynamically find which category this pattern belongs to
										const categoryTitle = await getPatternCategory(patternSlug);
										if (!categoryTitle) return null;

										const categorySlug = categoryTitle
											.toLowerCase()
											.replace(/\s+/g, "-");

										return (
											<li key={screen}>
												<Link
													href={
														currentQuality !== "all"
															? ROUTES.quality(
																	currentPlatform as "web" | "mobile",
																	categorySlug,
																	patternSlug,
																	currentQuality as "do" | "dont",
																)
															: ROUTES.pattern(
																	currentPlatform as "web" | "mobile",
																	categorySlug,
																	patternSlug,
																)
													}
													className="text-lg font-semibold text-fd-foreground hover:text-fd-muted-foreground transition-colors"
												>
													{screen}
												</Link>
											</li>
										);
									}),
								)
							}
						</ul>
					</div>

					{/* Components */}
					<div>
						<div className="text-sm text-fd-muted-foreground mb-4">
							Components
						</div>
						<ul className="space-y-3">
							{
								await Promise.all(
									patternData.uiElements.map(async (element: string) => {
										const patternSlug = element
											.toLowerCase()
											.replace(/\s+/g, "-");
										// Dynamically find which category this pattern belongs to
										const categoryTitle = await getPatternCategory(patternSlug);
										if (!categoryTitle) return null;

										const categorySlug = categoryTitle
											.toLowerCase()
											.replace(/\s+/g, "-");

										return (
											<li key={element}>
												<Link
													href={
														currentQuality !== "all"
															? ROUTES.quality(
																	currentPlatform as "web" | "mobile",
																	categorySlug,
																	patternSlug,
																	currentQuality as "do" | "dont",
																)
															: ROUTES.pattern(
																	currentPlatform as "web" | "mobile",
																	categorySlug,
																	patternSlug,
																)
													}
													className="text-lg font-semibold text-fd-foreground hover:text-fd-muted-foreground transition-colors"
												>
													{element}
												</Link>
											</li>
										);
									}),
								)
							}
						</ul>
					</div>

					{/* User Flows */}
					<div>
						<div className="text-sm text-fd-muted-foreground mb-4">
							User Flows
						</div>
						<ul className="space-y-3">
							{
								await Promise.all(
									patternData.flows.map(async (flow: string) => {
										const patternSlug = flow.toLowerCase().replace(/\s+/g, "-");
										// Dynamically find which category this pattern belongs to
										const categoryTitle = await getPatternCategory(patternSlug);
										if (!categoryTitle) return null;

										const categorySlug = categoryTitle
											.toLowerCase()
											.replace(/\s+/g, "-");

										return (
											<li key={flow}>
												<Link
													href={
														currentQuality !== "all"
															? ROUTES.quality(
																	currentPlatform as "web" | "mobile",
																	categorySlug,
																	patternSlug,
																	currentQuality as "do" | "dont",
																)
															: ROUTES.pattern(
																	currentPlatform as "web" | "mobile",
																	categorySlug,
																	patternSlug,
																)
													}
													className="text-lg font-semibold text-fd-foreground hover:text-fd-muted-foreground transition-colors"
												>
													{flow}
												</Link>
											</li>
										);
									}),
								)
							}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
