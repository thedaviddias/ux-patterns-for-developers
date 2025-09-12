"use client";

import Link from "next/link";
import { usePlausible } from "next-plausible";
import { trackFooterClick } from "@/lib/tracking";

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
	const plausible = usePlausible();

	const handleClick = () => {
		trackFooterClick(plausible, linkType, label);
	};

	// Merge rel attribute to preserve security tokens for external links
	const mergedRel = rel ? `${rel} noopener noreferrer` : undefined;

	return (
		<Link
			href={path || shortlink || "#"}
			rel={mergedRel}
			onClick={handleClick}
			className="text-gray-500 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white hover:underline transition-colors text-sm"
		>
			{label}
		</Link>
	);
};
