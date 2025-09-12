import { AUTHOR } from "@ux-patterns/constants/author";
import type { MDXComponents } from "mdx/types";

const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:3060";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		a: ({ href, children, ...props }) => {
			// Transform relative documentation links to absolute URLs
			if (href && typeof href === "string" && href.startsWith("/patterns/")) {
				const finalUrl = `${DOCS_URL}${href}`;

				return (
					<a href={finalUrl} {...props}>
						{children}
					</a>
				);
			}

			// Check if it's an external link (not your own domains)
			const authorDomain = new URL(AUTHOR.website).hostname;
			const isExternal =
				href &&
				typeof href === "string" &&
				(href.startsWith("http://") || href.startsWith("https://")) &&
				!href.includes("uxpatterns.dev") &&
				!href.includes("kit.uxpatterns.dev") &&
				!href.includes(authorDomain);

			// Add nofollow to external links
			const rel = isExternal ? "nofollow" : undefined;

			return (
				<a href={href} rel={rel} {...props}>
					{children}
				</a>
			);
		},
	};
}
