import { GitHubStarsWrapper } from "@ux-patterns/ui/components/custom/github-stars-wrapper";
import type { ReactNode } from "react";
import { DocsLayout } from "@/components/layout";
import { SearchToggle } from "@/components/search";
import {
	getGlossaryPageTree,
	getPatternGuidePageTree,
	getPatternsPageTree,
} from "@/lib/content";
import { TRACKING_EVENTS } from "@/lib/tracking";

interface LayoutProps {
	children: ReactNode;
	params: Promise<{ slug: string[] }>;
}

export default async function Layout({ children, params }: LayoutProps) {
	const { slug } = await params;
	const section = slug[0];

	// Get section-specific page tree
	let tree = getPatternsPageTree();
	switch (section) {
		case "patterns":
			tree = getPatternsPageTree();
			break;
		case "pattern-guide":
			tree = getPatternGuidePageTree();
			break;
		case "glossary":
			tree = getGlossaryPageTree();
			break;
	}

	return (
		<DocsLayout
			tree={tree}
			githubStars={
				<GitHubStarsWrapper
					variant="small"
					asLink={true}
					trackingEvent={TRACKING_EVENTS.GITHUB_STAR_CLICK}
				/>
			}
			searchToggle={<SearchToggle />}
			defaultOpenLevel={2}
		>
			{children}
		</DocsLayout>
	);
}
