export function getPatternCoverSrc(patternSlug: string): string | null {
	const normalizedSlug = patternSlug.trim();
	return normalizedSlug ? `/covers/patterns/${normalizedSlug}.png` : null;
}
