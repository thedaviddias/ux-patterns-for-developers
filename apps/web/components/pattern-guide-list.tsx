import { getPageTreePeers } from "fumadocs-core/server";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { source } from "@/lib/source";

export function PatternGuideList() {
	// Get all pages in the pattern-guide directory
	const peerPages = getPageTreePeers(source.pageTree, "/pattern-guide");

	// Filter out the index page and separator items
	const guidePages = peerPages.filter(
		(page) =>
			page.url !== "/pattern-guide" &&
			typeof page.name === "string" &&
			!page.name.startsWith("---") &&
			page.url.startsWith("/pattern-guide/"),
	);

	const Cards = defaultMdxComponents.Cards;
	const Card = defaultMdxComponents.Card;

	return (
		<Cards>
			{guidePages.map((page) => (
				<Card key={page.url} title={page.name} href={page.url}>
					{page.description ||
						"Compare similar patterns and make informed decisions based on your specific use case and requirements."}
				</Card>
			))}
		</Cards>
	);
}
