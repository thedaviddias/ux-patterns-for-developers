import Link from "next/link";
import type { FC } from "react";
import { source } from "@/lib/source";

export async function generateMetadata() {
	return {
		title: "Blog",
		description: "Blog",
	};
}

export const Blog: FC<{ lang: string }> = async ({ lang }) => {
	// Get all pages from the source
	const allPages = source.getPages();

	// Filter for blog pages (pages that start with 'blog/')
	const blogPages = allPages.filter(
		(page) => page.slugs[0] === "blog" && page.slugs.length > 1,
	);

	// Sort by date (newest first)
	const sortedPages = blogPages.sort((a, b) => {
		const aData = a.data as any;
		const bData = b.data as any;
		const dateA = new Date(aData.date || 0).getTime();
		const dateB = new Date(bData.date || 0).getTime();
		return dateB - dateA;
	});

	return sortedPages.map((page) => {
		const pageData = page.data as any;
		const { title, description, date } = pageData;

		return (
			<div key={page.url} className="mt-12">
				<h3 className="text-2xl font-semibold">
					<Link href={page.url} className="after:content-['_→']">
						{title}
					</Link>
				</h3>
				<p className="my-6 leading-7 opacity-80">{description}</p>
				<time
					dateTime={new Date(date || 0).toISOString()}
					className="text-sm opacity-50"
				>
					{new Date(date || 0).toLocaleDateString(lang, {
						month: "long",
						day: "numeric",
						year: "numeric",
					})}
				</time>
			</div>
		);
	});
};
