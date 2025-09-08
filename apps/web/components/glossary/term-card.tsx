"use client";

import defaultMdxComponents from "fumadocs-ui/mdx";

interface TermCardProps {
	title: string;
	description: string;
	category: string[];
	url: string;
}

export function TermCard({ title, description, category, url }: TermCardProps) {
	const Card = defaultMdxComponents.Card;

	return (
		<Card title={title} href={url}>
			<div className="flex flex-col gap-2">
				<p className="text-sm text-fd-muted-foreground line-clamp-2">
					{description}
				</p>
				{category.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-2">
						{category.map((cat) => (
							<span
								key={cat}
								className="px-2 py-1 text-xs rounded-full bg-fd-accent text-fd-accent-foreground"
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
