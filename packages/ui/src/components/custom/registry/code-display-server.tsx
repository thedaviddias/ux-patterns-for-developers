import { Index } from "@ux-patterns/registry/.generated";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import undent from "undent";

interface CodeDisplayServerProps {
	name: string;
	extractJSX?: boolean;
	showHTML?: boolean;
}

// Format JSX with proper indentation
function formatJSX(jsxCode: string): string {
	const normalized = undent(jsxCode);
	const lines = normalized.split("\n");
	const result: string[] = [];

	// Track depth by analyzing the structure
	let depth = 0;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line === undefined) continue;
		const trimmed = line.trim();

		if (trimmed === "") {
			result.push("");
			continue;
		}

		// Count tag changes on this line
		const openingTags = (
			trimmed.match(/<[A-Za-z][^>]*>/g) || ([] as string[])
		).filter((tag: string) => !tag.endsWith("/>")).length;
		const closingTags = (trimmed.match(/<\/[^>]*>/g) || []).length;
		const fragments = (trimmed.match(/<>/g) || []).length;
		const closingFragments = (trimmed.match(/<\/>/g) || []).length;

		// If line starts with closing tag, decrease depth first
		if (/^<\//.test(trimmed) || trimmed === "</>") {
			depth = Math.max(0, depth - 1);
		}

		// Add line with current depth
		const indent = "  ".repeat(depth);
		result.push(indent + trimmed);

		// Calculate net depth change for this line (only for non-closing-only lines)
		if (!(/^<\//.test(trimmed) || trimmed === "</>")) {
			const netChange =
				openingTags + fragments - closingTags - closingFragments;

			// Apply depth change for future lines
			if (netChange > 0) {
				depth += netChange;
			}
		}
	}

	return result.join("\n");
}

// Function to convert JSX to HTML-like syntax
function convertJSXToHTML(jsxCode: string): string {
	const html = jsxCode
		// Convert className to class
		.replace(/className=/g, "class=")
		// Convert React components to HTML elements
		.replace(/<Button\b/g, "<button")
		.replace(/<\/Button>/g, "</button>")
		// Handle self-closing tags
		.replace(/(<[^>]+)\s*\/>/g, "$1></$1>")
		// Remove React-specific props
		.replace(/\s*onClick=\{[^}]*\}/g, "")
		.replace(/\s*disabled=\{[^}]*\}/g, " disabled")
		.replace(/\s*variant="[^"]*"/g, "")
		.replace(/\s*size="[^"]*"/g, "")
		// Clean up extra whitespace
		.trim();

	return html;
}

// Function to format HTML with proper indentation
function formatHTML(html: string): string {
	// First, add line breaks around tags and handle text content properly
	const formatted = html
		.replace(/></g, ">\n<") // Add line breaks between adjacent tags
		.replace(/>([^<\n]+)</g, ">\n$1\n<") // Put text content on separate lines
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	let depth = 0;
	const result: string[] = [];

	for (const line of formatted) {
		const trimmed = line.trim();

		// Check if this line is a closing tag
		const isClosingTag = /^<\//.test(trimmed);

		// Decrease depth for closing tags
		if (isClosingTag) {
			depth = Math.max(0, depth - 1);
		}

		// Add line with indentation
		const indent = "  ".repeat(depth);
		result.push(indent + trimmed);

		// Increase depth for opening tags that aren't self-closing or don't close on same line
		const hasOpeningTag = /<[A-Za-z]/.test(trimmed);
		const isSelfClosing = trimmed.endsWith("/>");
		const hasClosingOnSameLine = /<\//.test(trimmed);

		if (
			hasOpeningTag &&
			!isSelfClosing &&
			!hasClosingOnSameLine &&
			!isClosingTag
		) {
			depth++;
		}
	}

	return result.join("\n");
}

// Function to extract JSX from component code using regex
function extractJSXFromComponent(code: string): string | null {
	try {
		// First, unescape the content from JSON format
		const unescapedCode = code
			.replace(/\\n/g, "\n")
			.replace(/\\t/g, "\t")
			.replace(/\\"/g, '"')
			.replace(/\\\\/g, "\\");

		// Find the return statement using a more robust pattern
		const returnPattern = /return\s*(?:\([\s\S]*?\)|[\s\S]*?);?\s*}?\s*$/m;
		const returnMatch = unescapedCode.match(returnPattern);

		if (!returnMatch) {
			return null;
		}

		const content = returnMatch[0];

		// Extract just the JSX part after "return"
		const jsxMatch = content.match(
			/return\s*(?:\(\s*)?([\s\S]*?)(?:\s*\))?\s*;?\s*}?\s*$/,
		);
		if (!jsxMatch || !jsxMatch[1]) {
			return null;
		}

		let jsxContent = jsxMatch[1].trim();

		// Remove trailing semicolon and closing brace if present
		jsxContent = jsxContent.replace(/[;}]+\s*$/, "").trim();

		// Format the JSX with proper indentation
		const result = formatJSX(jsxContent);

		return result;
	} catch (error) {
		console.error("Error extracting JSX:", error);
		return null;
	}
}

export async function CodeDisplayServer({
	name,
	extractJSX = true,
	showHTML = false,
}: CodeDisplayServerProps) {
	let codeContent: string | null = null;

	try {
		// Get source from bundled index
		const registryItem = Index[name];
		const fullContent = registryItem?.source;

		if (fullContent) {
			if (showHTML) {
				// First extract JSX
				const jsxContent = extractJSXFromComponent(fullContent);

				if (jsxContent) {
					// Convert JSX to HTML-like syntax
					const htmlLike = convertJSXToHTML(jsxContent);
					// Format the HTML
					const formattedHTML = formatHTML(htmlLike);
					codeContent = formattedHTML;
				} else {
					codeContent = `<!-- Could not extract JSX from component ${name} -->`;
				}
			} else if (extractJSX) {
				// Extract only the JSX part
				const jsxContent = extractJSXFromComponent(fullContent);
				codeContent = jsxContent || fullContent; // Fallback to full content if extraction fails
			} else {
				// Show full component code
				codeContent = fullContent;
			}
		}
	} catch (error) {
		console.error(`Failed to read code for ${name}:`, error);
		// In case of error, return null or a fallback message
		codeContent = null;
	}

	if (!codeContent) {
		return null;
	}

	return (
		<DynamicCodeBlock
			lang={showHTML ? "html" : "tsx"}
			code={codeContent}
			options={{
				themes: {
					light: "github-light",
					dark: "github-dark",
				},
			}}
		/>
	);
}
