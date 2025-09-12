import { PROJECT } from "@ux-patterns/constants/author";
import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { StarsWrapper } from "@/components/stars/stars-wrapper";

export const linkItems: LinkItemType[] = [
	// see https://fumadocs.dev/docs/ui/navigation/links
	{
		text: "Blog",
		url: "/blog",
		active: "nested-url",
	},
	{
		text: "Kit",
		url: "https://kit.uxpatterns.dev",
		external: true,
	},
	{
		type: "icon",
		url: PROJECT.repository.url,
		text: "GitHub Stars",
		icon: (
			<div className="scale-90 -mx-2">
				<StarsWrapper variant="small" />
			</div>
		),
		external: true,
	},
	// {
	// 	text: "Gallery",
	// 	url: "https://gallery.uxpatterns.dev",
	// 	external: true,
	// },
];

export function baseOptions(): BaseLayoutProps {
	return {
		// githubUrl: PROJECT.repository.url,
		nav: {
			title: (
				<>
					{/** biome-ignore lint/performance/noImgElement: logo image */}
					<img
						src="/img/ux-logo.png"
						alt="UX Patterns for Devs"
						className="w-6 h-6 rounded-full"
					/>
					UX Patterns for Devs
				</>
			),
			transparentMode: "top",
		},
	};
}
