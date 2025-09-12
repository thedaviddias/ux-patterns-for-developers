import { SOCIAL_LINKS } from "@ux-patterns/constants/social";
import { GitHubStarsWrapper } from "@ux-patterns/ui/components/custom/github-stars-wrapper";
import type { HomeLayoutProps } from "@ux-patterns/ui/components/custom/header";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { TRACKING_EVENTS } from "@/lib/tracking";

export const linkItems: LinkItemType[] = [
	// see https://fumadocs.dev/docs/ui/navigation/links
	{
		text: "Docs",
		url: "/docs",
		active: "nested-url",
	},
	{
		text: "Changelog",
		url: "/changelog",
		active: "nested-url",
	},
];

export function baseOptions(): HomeLayoutProps {
	return {
		wide: true,
		nav: {
			title: (
				<>
					<div className="inline-flex items-center">
						<Link
							href="https://uxpatterns.dev"
							className="hidden md:flex items-center gap-1 text-xl font-bold text-fd-muted-foreground hover:text-fd-primary transition-colors group"
							title="Go to UX Patterns main site"
						>
							UX Patterns
							<ArrowUpRight className="w-3 h-3" />
						</Link>
						<span className="hidden md:block mx-2 text-fd-muted-foreground">
							/
						</span>
						<Link
							href="/"
							className="text-xl font-bold text-fd-primary hover:text-fd-primary/90 transition-colors"
						>
							Kit
						</Link>
						<div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
							Alpha
						</div>
					</div>
				</>
			),
		},
		githubStars: (
			<GitHubStarsWrapper
				variant="small"
				asLink={true}
				trackingEvent={TRACKING_EVENTS.GITHUB_STAR_CLICK}
			/>
		),
		links: [
			{
				text: "Docs",
				url: "/docs",
				active: "nested-url",
			},
			{
				text: "Components",
				url: "/docs/components/button",
				active: "nested-url",
			},
			{
				text: "Changelog",
				url: "/changelog",
				active: "nested-url",
			},
			...SOCIAL_LINKS.map((social) => ({
				type: "icon" as const,
				label: social.label,
				icon: social.icon,
				text: social.label,
				url: social.link,
				external: true,
			})),
		],
	};
}
