"use client";

import { siInstagram, siReddit } from "simple-icons";
import { SimpleIconComponent } from "./browser-support";

type SocialIconLink = {
	label: string;
	href: string;
	icon: typeof siInstagram;
};

const socialLinks: SocialIconLink[] = [
	{
		label: "Instagram",
		href: "https://www.instagram.com/uxpatternsfordevs",
		icon: siInstagram,
	},
	{
		label: "Reddit",
		href: "https://www.reddit.com/r/UXPatterns/",
		icon: siReddit,
	},
];

export const HeaderIcons = () => {
	const handleClick = (href: string) => {
		window.open(href, "_blank", "noopener,noreferrer");
	};

	return (
		<div className="flex items-center gap-3">
			{socialLinks.map((link) => (
				<button
					key={link.label}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						handleClick(link.href);
					}}
					className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors p-0 bg-transparent border-none cursor-pointer"
					aria-label={link.label}
					type="button"
				>
					<SimpleIconComponent icon={link.icon} className="w-5 h-5" />
				</button>
			))}
		</div>
	);
};
