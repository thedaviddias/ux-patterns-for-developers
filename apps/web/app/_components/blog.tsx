import type { MdxFile } from "nextra";
import { getPageMap } from "nextra/page-map";
import { Link } from "nextra-theme-docs";
import type { FC } from "react";

export async function generateMetadata() {
	return {
		title: "Blog",
		description: "Blog",
	};
}

export const Blog: FC<{ lang: string }> = async ({ lang }) => {
	const pageMap = (await getPageMap(`/blog`)) as unknown as MdxFile[];

	const sortedPages = pageMap
		.filter((page) => page.name !== "index")
		.sort((a, b) => {
			const dateA = new Date(a.frontMatter?.date).getTime();
			const dateB = new Date(b.frontMatter?.date).getTime();
			return dateB - dateA;
		});

	return sortedPages.map((page) => {
		const { title, description, date } = page.frontMatter || {};

		return (
			<div key={page.route} className="mt-12">
				<h3 className="text-2xl font-semibold">
					<Link href={page.route} className="after:content-['_→']">
						{title}
					</Link>
				</h3>
				<p className="my-6 leading-7 opacity-80">{description}</p>
				<time
					dateTime={new Date(date).toISOString()}
					className="text-sm opacity-50"
				>
					{new Date(date).toLocaleDateString(lang, {
						month: "long",
						day: "numeric",
						year: "numeric",
					})}
				</time>
			</div>
		);
	});
};
