export type PatternExampleVariant = "canonical" | "advanced";

export type PatternExamplePresentation = "inline" | "collapsed" | "hidden-code";

export interface PatternExampleDefinition {
	html: string;
	css?: string;
	js?: string;
	height?: string;
	title?: string;
	description?: string;
	variant?: PatternExampleVariant;
	presentation?: PatternExamplePresentation;
}

export interface ResolvedPatternExampleDefinition
	extends PatternExampleDefinition {
	variant: PatternExampleVariant;
	presentation: PatternExamplePresentation;
}

export interface PatternExampleCodeTab {
	code: string;
	lang: "html" | "css" | "js";
	value: string;
}

export function resolvePatternExample(
	example: PatternExampleDefinition,
	exampleName = "basic",
): ResolvedPatternExampleDefinition {
	const variant =
		example.variant ?? (exampleName === "basic" ? "canonical" : "advanced");
	const presentation =
		example.presentation ?? (variant === "canonical" ? "inline" : "collapsed");

	return {
		...example,
		presentation,
		variant,
	};
}

function escapeClosingTag(content: string, tagName: "script" | "style") {
	const pattern = new RegExp(`</${tagName}`, "gi");
	return content.replace(pattern, `<\\/${tagName}`);
}

export function composePatternExampleMarkup(
	example: PatternExampleDefinition,
): string {
	const sections = [
		example.css ? `<style>\n${example.css.trim()}\n</style>` : null,
		example.html.trim(),
		example.js ? `<script>\n${example.js.trim()}\n</script>` : null,
	].filter(Boolean);

	return sections.join("\n\n");
}

export function composePatternExampleDocument(
	example: PatternExampleDefinition,
): string {
	const css = example.css
		? `<style>${escapeClosingTag(example.css.trim(), "style")}</style>`
		: "";
	const js = example.js
		? `<script>${escapeClosingTag(example.js.trim(), "script")}</script>`
		: "";

	return [
		"<!doctype html>",
		'<html lang="en">',
		"<head>",
		'<meta charset="utf-8" />',
		'<meta name="viewport" content="width=device-width, initial-scale=1" />',
		css,
		"</head>",
		"<body>",
		example.html.trim(),
		js,
		"</body>",
		"</html>",
	]
		.filter(Boolean)
		.join("");
}

export function getPatternExampleCodeTabs(
	example: PatternExampleDefinition,
): PatternExampleCodeTab[] {
	const tabs: PatternExampleCodeTab[] = [
		{
			code: example.html.trim(),
			lang: "html",
			value: "html",
		},
	];

	if (example.css) {
		tabs.push({
			code: example.css.trim(),
			lang: "css",
			value: "css",
		});
	}

	if (example.js) {
		tabs.push({
			code: example.js.trim(),
			lang: "js",
			value: "js",
		});
	}

	return tabs;
}
