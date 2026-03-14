"use client";

import { Card } from "@/components/mdx";

interface TermCardProps {
	title: string;
	description: string;
	category: string[];
	url: string;
}

export function TermCard({ title, description, category, url }: TermCardProps) {
	return (
		<Card
			title={title}
			href={url}
			className="rounded-[1.5rem] border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,250,249,0.82))] p-5 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.72))]"
		>
			<div className="flex flex-col gap-3">
				<p className="text-sm leading-6 text-muted-foreground line-clamp-3">
					{description}
				</p>
				{category.length > 0 && (
					<div className="mt-2 flex flex-wrap gap-2">
						{category.map((cat) => (
							<span
								key={cat}
								className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"
							>
								{cat}
							</span>
						))}
					</div>
				)}
			</div>
		</Card>
	);
}
