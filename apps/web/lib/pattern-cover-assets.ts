const AVAILABLE_PATTERN_COVER_SLUGS = new Set([
	"autocomplete",
	"back-to-top",
	"breadcrumb",
	"button",
	"load-more",
	"modal",
	"pagination",
	"rich-text-editor",
	"table",
	"text-field",
]);

export function getPatternCoverSrc(patternSlug: string): string | null {
	return AVAILABLE_PATTERN_COVER_SLUGS.has(patternSlug)
		? `/covers/patterns/${patternSlug}.png`
		: null;
}
