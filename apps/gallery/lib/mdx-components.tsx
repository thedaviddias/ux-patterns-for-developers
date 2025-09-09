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

			// Default link behavior
			return (
				<a href={href} {...props}>
					{children}
				</a>
			);
		},
	};
}
