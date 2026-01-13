import type { ReactNode } from "react";
import { DocsLayout } from "@/components/layout";
import { SearchToggle } from "@/components/search";
import {
	getPatternsPageTree,
	getPatternGuidePageTree,
	getGlossaryPageTree,
} from "@/lib/content";
import { GitHubStarsWrapper } from "@ux-patterns/ui/components/custom/github-stars-wrapper";
import { TRACKING_EVENTS } from "@/lib/tracking";

interface LayoutProps {
	children: ReactNode;
	params: Promise<{ slug: string[] }>;
}

export default async function Layout({ children, params }: LayoutProps) {
	const { slug } = await params;
	const section = slug[0];

	// Get section-specific page tree
	let tree;
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
		default:
			tree = getPatternsPageTree();
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
