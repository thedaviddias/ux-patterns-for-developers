import { getPatternCoverSrc } from "@/lib/pattern-cover-assets";

const DEFAULT_OG_IMAGE = "/og/opengraph-image.png";

export function resolveOgImageUrl(options: {
	isHomepage: boolean;
	isPatternPage: boolean;
	pageOgImage?: string | null;
	patternSlug?: string;
}): string {
	const customOgImage =
		typeof options.pageOgImage === "string" ? options.pageOgImage.trim() : "";

	if (customOgImage) {
		return customOgImage;
	}

	if (options.isHomepage) {
		return DEFAULT_OG_IMAGE;
	}

	if (options.isPatternPage && options.patternSlug) {
		return getPatternCoverSrc(options.patternSlug) || DEFAULT_OG_IMAGE;
	}

	return DEFAULT_OG_IMAGE;
}

export { DEFAULT_OG_IMAGE };
