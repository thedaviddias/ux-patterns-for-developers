import { Sparkles } from "lucide-react";
import { getPatternCategories } from "@/utils/get-pattern-categories";
import { HeroCta } from "./hero-cta";

export default async function Hero() {
	const categories = await getPatternCategories();
	const patternCount = categories.reduce(
		(acc, cat) => acc + cat.patterns.filter((p) => p.status !== "draft").length,
		0,
	);
	const categoryCount = categories.length;

	return (
		<section className="relative overflow-hidden pt-14 pb-10 md:pt-20 md:pb-14 lg:pt-24 lg:pb-16">
			<div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.30),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.75))] dark:bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.96),rgba(2,6,23,0.72))]" />

			<div className="container mx-auto flex flex-col items-center px-6 text-center">
				<div className="max-w-4xl">
					<div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur">
						<Sparkles className="h-4 w-4 text-orange-500" />
						<span>
							{patternCount}+ patterns across {categoryCount} categories
						</span>
					</div>

					<h1 className="mx-auto mt-8 max-w-5xl text-balance text-5xl font-semibold leading-[0.97] text-foreground sm:text-6xl lg:text-7xl">
						UX patterns and reference tools for{" "}
						<span className="font-display italic text-orange-700 dark:text-orange-300">
							better interface decisions
						</span>
					</h1>

					<p className="mx-auto mt-6 max-w-3xl text-balance text-lg leading-8 text-muted-foreground md:text-xl">
						Study proven UI patterns, compare tradeoffs, learn the vocabulary,
						and read the thinking behind interaction design without bouncing
						between ten different resources.
					</p>

					<HeroCta />
				</div>
			</div>
		</section>
	);
}
