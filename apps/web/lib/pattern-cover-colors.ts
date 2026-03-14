export const LEGACY_PATTERN_COVER_COLORS = {
	autocomplete: "#bf6160",
	"back-to-top": "#e80058",
	breadcrumb: "#80a7ff",
	button: "#408054",
	"load-more": "#64748b",
	modal: "#ffb000",
	pagination: "#e80058",
	"rich-text-editor": "#e7e8e3",
	table: "#ffb000",
	"text-field": "#edf3e6",
} as const;

export const CATEGORY_PATTERN_COVER_COLORS = {
	advanced: "#64748b",
	"ai-intelligence": "#80a7ff",
	authentication: "#bf6160",
	"content-management": "#ffb000",
	"data-display": "#ffb000",
	"e-commerce": "#ffb000",
	forms: "#edf3e6",
	media: "#64748b",
	navigation: "#80a7ff",
	social: "#e80058",
	"user-feedback": "#64748b",
} as const;

export const CATEGORY_PATTERN_COVER_ACCENT_COLORS = {
	advanced: "#98a4b7",
	"ai-intelligence": "#8c88ff",
	authentication: "#cf8078",
	"content-management": "#d7a241",
	"data-display": "#d9b64c",
	"e-commerce": "#d59a45",
	forms: "#7f9570",
	media: "#8796aa",
	navigation: "#89a7ff",
	social: "#ff5f97",
	"user-feedback": "#9aa7b6",
} as const;

export const DEFAULT_PATTERN_COVER_COLOR = LEGACY_PATTERN_COVER_COLORS.modal;

export const APPROVED_PATTERN_COVER_COLORS = Array.from(
	new Set([
		...Object.values(LEGACY_PATTERN_COVER_COLORS),
		...Object.values(CATEGORY_PATTERN_COVER_COLORS),
	]),
);

export const APPROVED_PATTERN_COVER_ACCENT_COLORS = Array.from(
	new Set(Object.values(CATEGORY_PATTERN_COVER_ACCENT_COLORS)),
);

export function getPatternCoverBackgroundColor(
	slug: string,
	categorySlug: string,
): string {
	return (
		LEGACY_PATTERN_COVER_COLORS[
			slug as keyof typeof LEGACY_PATTERN_COVER_COLORS
		] ||
		CATEGORY_PATTERN_COVER_COLORS[
			categorySlug as keyof typeof CATEGORY_PATTERN_COVER_COLORS
		] ||
		DEFAULT_PATTERN_COVER_COLOR
	);
}

export function getPatternCoverAccentColor(categorySlug: string): string {
	return (
		CATEGORY_PATTERN_COVER_ACCENT_COLORS[
			categorySlug as keyof typeof CATEGORY_PATTERN_COVER_ACCENT_COLORS
		] || "#d7a241"
	);
}
