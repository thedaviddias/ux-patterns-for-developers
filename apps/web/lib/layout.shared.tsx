import { SOCIAL_LINKS } from "@ux-patterns/constants/social";
import { GitHubStarsWrapper } from "@ux-patterns/ui/components/custom/github-stars-wrapper";
import type { HomeLayoutProps } from "@ux-patterns/ui/components/custom/header";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import Link from "next/link";
import { TRACKING_EVENTS } from "./tracking";

export const linkItems: LinkItemType[] = [
	// see https://fumadocs.dev/docs/ui/navigation/links
	{
		text: "Patterns",
		url: "/patterns/getting-started",
		active: "nested-url",
	},
	{
		text: "Patterns Guide",
		url: "/pattern-guide",
		active: "nested-url",
	},
	{
		text: "Glossary",
		url: "/glossary",
		active: "nested-url",
	},
	{
		text: "Blog",
		url: "/blog",
		active: "nested-url",
	},
	{
		text: "Kit",
		url: "https://kit.uxpatterns.dev",
		external: false,
	},
	{
		text: "Gallery",
		url: "https://gallery.uxpatterns.dev",
		external: false,
	},
	...SOCIAL_LINKS.map((social) => ({
		type: "icon" as const,
		label: social.label,
		icon: social.icon,
		text: social.label,
		url: social.link,
		external: true,
	})),
];

export function baseOptions(): HomeLayoutProps {
	return {
		wide: true,
		nav: {
			title: (
				<>
					{/** biome-ignore lint/performance/noImgElement: logo image */}
					<img
						src="/img/ux-logo.png"
						alt="UX Patterns for Devs"
						className="w-6 h-6 rounded-full"
					/>
					<div className="inline-flex items-center">
						{/* Desktop: Full breadcrumb */}
						<Link
							href="/"
							className="flex items-center gap-1 text-xl font-bold text-fd-primary hover:text-fd-primary/90 transition-colors"
						>
							UX Patterns
						</Link>
					</div>
				</>
			),
			transparentMode: "top",
		},
		githubStars: (
			<GitHubStarsWrapper
				variant="small"
				asLink={true}
				trackingEvent={TRACKING_EVENTS.GITHUB_STAR_CLICK}
			/>
		),
		links: linkItems,
	};
}
