import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { siDiscord, siInstagram, siX } from "simple-icons";
import { SimpleIconComponent } from "../components/simple-icon";
import { StarsWrapper } from "../components/stars-wrapper";

export const linkItems: LinkItemType[] = [
	// see https://fumadocs.dev/docs/ui/navigation/links
	{
		text: "Changelog",
		url: "/changelog",
		active: "nested-url",
	},
	{
		text: "UX Patterns",
		url: "https://uxpatterns.dev",
		external: false,
	},
	{
		type: "icon",
		url: "https://github.com/thedaviddias/ux-patterns-for-developers",
		text: "GitHub Stars",
		icon: (
			<div className="scale-90 -mx-2">
				<StarsWrapper variant="small" />
			</div>
		),
		external: true,
	},
];

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: (
				<>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-label="UP Kit Logo"
						className="text-primary"
					>
						<title>UP Kit Logo</title>
						{/* UX/UI focused icon - layers representing patterns */}
						<rect
							x="3"
							y="4"
							width="18"
							height="3"
							rx="1.5"
							fill="currentColor"
							opacity="0.9"
						/>
						<rect
							x="3"
							y="10"
							width="12"
							height="3"
							rx="1.5"
							fill="currentColor"
							opacity="0.7"
						/>
						<rect
							x="3"
							y="16"
							width="15"
							height="3"
							rx="1.5"
							fill="currentColor"
							opacity="0.5"
						/>
					</svg>
					<span className="font-bold">UP Kit</span>
					<div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
						Alpha
					</div>
				</>
			),
		},
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
				type: "icon",
				url: "https://github.com/thedaviddias/ux-patterns-for-developers",
				text: "GitHub Stars",
				icon: (
					<div className="scale-90 -mx-2">
						<StarsWrapper variant="small" />
					</div>
				),
				external: true,
			},
			{
				type: "icon",
				url: "https://discord.gg/8fsJFcCGbq",
				text: "Discord",
				icon: <SimpleIconComponent icon={siDiscord} className="w-5 h-5" />,
				external: true,
			},
			{
				type: "icon",
				url: "https://x.com/thedaviddias",
				text: "X",
				icon: <SimpleIconComponent icon={siX} className="w-5 h-5" />,
				external: true,
			},
			{
				type: "icon",
				url: "https://www.instagram.com/uxpatternsfordevs",
				text: "Instagram",
				icon: <SimpleIconComponent icon={siInstagram} className="w-5 h-5" />,
				external: true,
			},
		],
	};
}
