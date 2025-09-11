import { Feed } from "feed";
import { NextResponse } from "next/server";
import { blog } from "@/lib/source";

interface BlogData {
	title: string;
	description: string;
	date?: string;
	author?: string;
}

export const revalidate = false;

const baseUrl = "https://uxpatterns.dev";

export function GET() {
	const feed = new Feed({
		title: "UX Patterns for Devs Blog",
		id: `${baseUrl}/blog`,
		link: `${baseUrl}/blog`,
		language: "en",
		image: `${baseUrl}/banner.png`,
		favicon: `${baseUrl}/icon.png`,
		copyright: "All rights reserved 2025, UX Patterns for Devs",
	});

	for (const page of blog.getPages().sort((a, b) => {
		const dataA = a.data as BlogData;
		const dataB = b.data as BlogData;
		const dateA = dataA.date ? new Date(dataA.date) : new Date();
		const dateB = dataB.date ? new Date(dataB.date) : new Date();
		return dateB.getTime() - dateA.getTime();
	})) {
		const data = page.data as BlogData;
		feed.addItem({
			id: page.url,
			title: data.title,
			description: data.description,
			link: `${baseUrl}${page.url}`,
			date: data.date ? new Date(data.date) : new Date(),
			author: [
				{
					name: data.author || "UX Patterns for Devs",
				},
			],
		});
	}

	return new NextResponse(feed.rss2());
}
