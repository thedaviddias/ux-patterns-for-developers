import { SOCIAL_LINKS } from "@ux-patterns/constants/social";
import { GitHubStarsWrapper } from "@ux-patterns/ui/components/custom/github-stars-wrapper";
import type { HomeLayoutProps } from "@ux-patterns/ui/components/custom/header";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SearchButton } from "@/components/header/search-button";
import { GALLERY_TRACKING_EVENTS } from "./tracking";

/**
 * Shared layout configurations
 *
 */
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
							Gallery
						</Link>
					</div>
				</>
			),
		},
		searchToggle: {
			enabled: true,
			components: {
				lg: <SearchButton />,
				sm: <SearchButton />,
			},
		},
		githubStars: (
			<GitHubStarsWrapper
				variant="small"
				asLink={true}
				trackingEvent={GALLERY_TRACKING_EVENTS.GITHUB_STAR_CLICK}
			/>
		),
		links: [
			{
				text: "Websites",
				url: "/website",
				active: "nested-url",
			},
			{
				text: "Kit",
				url: "https://kit.uxpatterns.dev",
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
		],
	};
}
