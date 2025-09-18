import { Badge } from "@ux-patterns/ui/components/shadcn/badge";
import { cn } from "@/lib/cn";
import type { Pattern } from "@/utils/get-pattern-categories";
import { getPatterns } from "@/utils/get-patterns";
import { LinkCustom } from "../link-custom";

export type PatternWrapperProps = {
	pattern: Pattern;
};

export const OverviewGrid = async () => {
	const categories = await getPatterns();

	return (
		<div className="container space-y-10 my-10">
			{categories.map((category) => (
				<div key={category.name}>
					<div className="mb-5">
						<h2 className="mb-2 text-4xl md:text-5xl font-bold leading-[1.2] tracking-tighter text-foreground">
							{category.name}
						</h2>
						<p className="mt-2 text-xl text-muted-foreground">
							{category.description}
						</p>
					</div>
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{category.patterns.map((pattern) => (
							<PatternWrapper key={pattern.title} pattern={pattern} />
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export const PatternWrapper = ({ pattern }: PatternWrapperProps) => {
	const wrapperClasses = cn(
		"relative rounded-xl border border-neutral-200 dark:border-neutral-800",
		pattern.status !== "draft" &&
			"border-neutral-400 dark:border-neutral-600 hover:bg-neutral-100 hover:border-neutral-200 dark:hover:bg-neutral-900 dark:hover:border-neutral-400 hover:scale-105 transition-all duration-100 ease-in-out",
	);

	const content = <PatternContent pattern={pattern} />;

	return (
		<div className={wrapperClasses}>
			{pattern.status !== "draft" ? (
				<LinkCustom
					href={pattern.href}
					className="!no-underline w-full"
					icon={false}
				>
					{content}
				</LinkCustom>
			) : (
				content
			)}
		</div>
	);
};

const PatternContent = ({ pattern }: PatternWrapperProps) => (
	<div
		className={cn(
			"relative flex flex-col gap-4 overflow-hidden rounded-xl p-5 transition-all duration-300",
			pattern.status !== "draft"
				? "hover:animate-card-hover cursor-pointer"
				: "opacity-60 cursor-not-allowed",
		)}
	>
		<div className="flex items-center justify-between">
			{pattern.icon && <pattern.icon className="h-8 w-8 text-primary" />}
			{pattern.status === "draft" && (
				<Badge variant="outline">
					<span className="text-[10px]">Coming soon</span>
				</Badge>
			)}
		</div>
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<h3 className="font-display text-xl font-semibold text-foreground">
					{pattern.title}
				</h3>
			</div>
			<p className="mb-3 text-sm text-foreground leading-6!">
				{pattern.summary}
			</p>
		</div>
	</div>
);
