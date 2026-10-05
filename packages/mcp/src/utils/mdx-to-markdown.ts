/**
 * Convert MDX content to plain Markdown
 * Strips JSX components and import statements
 */

/**
 * Remove MDX-specific syntax from content
 */
export function mdxToMarkdown(content: string): string {
	// Protect literals in place so inline code does not split enclosing JSX tags.
	let marker = "\uE000UX_MCP_LITERAL_";
	while (content.includes(marker)) marker += "_";
	const literals: string[] = [];
	const protect = (literal: string) =>
		`${marker}${literals.push(literal) - 1}\uE001`;
	const openings = /^ {0,3}(`{3,}|~{3,})[^\n]*\n/gm;
	let protectedContent = "";
	let cursor = 0;
	for (
		let match = openings.exec(content);
		match;
		match = openings.exec(content)
	) {
		const fence = match[1];
		const closing = new RegExp(
			`^ {0,3}${fence[0]}{${fence.length},}[ \\t]*\\r?$`,
			"gm",
		);
		closing.lastIndex = openings.lastIndex;
		const end = closing.exec(content);
		const blockEnd = end ? end.index + end[0].length : content.length;
		protectedContent +=
			content.slice(cursor, match.index) +
			protect(content.slice(match.index, blockEnd));
		cursor = blockEnd;
		openings.lastIndex = blockEnd;
	}
	protectedContent += content.slice(cursor);
	protectedContent = protectedContent.replace(/`[^`\n]*`/g, protect);
	return stripMdxMarkup(protectedContent)
		.replace(
			new RegExp(`${marker}(\\d+)\uE001`, "g"),
			(_, index) => literals[Number(index)],
		)
		.trim();
}

function stripMdxMarkup(content: string): string {
	let result = content;

	// Remove import statements
	result = result.replace(
		/^import\s+.*?(?:from\s+['"][^'"]+['"])?;?\s*$/gm,
		"",
	);

	// Remove export statements (but keep exported content)
	result = result.replace(/^export\s+(?:default\s+)?/gm, "");

	// Remove JSX self-closing components like <Component />
	result = result.replace(/<[A-Z][a-zA-Z0-9]*\s*(?:\{[^}]*\}|[^>])*\/>/g, "");

	// Remove JSX components with children like <Component>...</Component>
	// This is a simplified version - handles single-level nesting
	result = result.replace(
		/<([A-Z][a-zA-Z0-9]*)[^>]*>[\s\S]*?<\/\1>/g,
		(match) => {
			// Extract text content from within the component
			const textContent = match
				.replace(/<[^>]+>/g, "") // Remove all tags
				.trim();
			return textContent;
		},
	);

	// Remove any remaining JSX opening/closing tags
	result = result.replace(/<\/?[A-Z][a-zA-Z0-9]*[^>]*>/g, "");

	// Remove JSX expressions {expression} but keep simple text
	result = result.replace(/\{['"`]([^'"`]+)['"`]\}/g, "$1");
	result = result.replace(/\{[^}]+\}/g, "");

	// Clean up extra whitespace
	result = result.replace(/\n{3,}/g, "\n\n");
	return result;
}

/**
 * Extract frontmatter from MDX content
 */
export function extractFrontmatter(content: string): {
	frontmatter: Record<string, unknown>;
	body: string;
} {
	const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

	if (!frontmatterMatch) {
		return { frontmatter: {}, body: content };
	}

	const [, frontmatterStr, body] = frontmatterMatch;

	// Simple YAML-like parsing (for basic key: value pairs)
	const frontmatter: Record<string, unknown> = {};
	const lines = frontmatterStr.split("\n");

	for (const line of lines) {
		const colonIndex = line.indexOf(":");
		if (colonIndex > 0) {
			const key = line.slice(0, colonIndex).trim();
			let value: unknown = line.slice(colonIndex + 1).trim();

			// Parse basic types
			if (value === "true") value = true;
			else if (value === "false") value = false;
			else if (/^\d+$/.test(value as string))
				value = parseInt(value as string, 10);
			else if (/^\d+\.\d+$/.test(value as string))
				value = parseFloat(value as string);
			else if (
				(value as string).startsWith("[") &&
				(value as string).endsWith("]")
			) {
				// Simple array parsing
				value = (value as string)
					.slice(1, -1)
					.split(",")
					.map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
			} else {
				// Remove quotes from strings
				value = (value as string).replace(/^['"]|['"]$/g, "");
			}

			frontmatter[key] = value;
		}
	}

	return { frontmatter, body };
}

/**
 * Truncate content to a maximum length while preserving word boundaries
 */
export function truncateContent(content: string, maxLength: number): string {
	if (content.length <= maxLength) {
		return content;
	}

	// Find the last space before maxLength
	const truncated = content.slice(0, maxLength);
	const lastSpace = truncated.lastIndexOf(" ");

	if (lastSpace > maxLength * 0.8) {
		return truncated.slice(0, lastSpace) + "...";
	}

	return truncated + "...";
}
