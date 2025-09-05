import { cn } from "@/app/_utils/cn";
import { getPatternAssistantPages } from "@/app/_utils/get-pattern-assistant";
import type { Pattern } from "@/app/_utils/get-pattern-categories";
import { PatternWrapper } from "./overview-grid";

function shuffleArray<T>(array: T[]): T[] {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = newArray[i];
		if (temp !== undefined && newArray[j] !== undefined) {
			newArray[i] = newArray[j];
			newArray[j] = temp;
		}
	}
	return newArray;
}

export const RandomDecisionFlows = async ({
	lang,
	limit = 3,
}: {
	lang: string;
	limit?: number;
}) => {
	const pages = await getPatternAssistantPages(lang);
	const randomPages = shuffleArray(pages).slice(0, limit);

	return (
		<div className={limit === 1 ? "h-full" : "mt-16"}>
			<div
				className={cn(
					"grid gap-6",
					limit === 1
						? "grid-cols-1"
						: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
				)}
			>
				{randomPages.map((page) => {
					const pattern: Pattern = {
						title: page.title,
						summary: page.summary,
						href: page.href,
						icon: page.icon,
						status: "complete" as const,
						description: page.summary,
					};
					return <PatternWrapper key={page.title} pattern={pattern} />;
				})}
			</div>
		</div>
	);
};
