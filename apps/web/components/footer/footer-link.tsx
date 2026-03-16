"use client";

import { trackFooterClick } from "@/lib/tracking";
import { LinkCustom } from "../link-custom";

interface FooterLinkProps {
	label: string;
	path?: string;
	shortlink?: string;
	rel?: string;
	linkType: "general" | "resource" | "social";
}

export const FooterLink = ({
	label,
	path,
	shortlink,
	rel,
	linkType,
}: FooterLinkProps) => {
	const handleClick = () => {
		trackFooterClick(linkType, label);
	};

	// Merge rel attribute to preserve security tokens for external links
	const mergedRel = rel ? `${rel} noopener noreferrer` : undefined;

	return (
		<LinkCustom
			href={path || shortlink || "#"}
			rel={mergedRel}
			onClick={handleClick}
			className="text-gray-500 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white hover:underline transition-colors text-sm"
		>
			{label}
		</LinkCustom>
	);
};
