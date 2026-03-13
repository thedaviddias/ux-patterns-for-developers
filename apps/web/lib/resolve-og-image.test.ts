import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, resolveOgImageUrl } from "./resolve-og-image";

describe("resolveOgImageUrl", () => {
	it("prefers a per-page ogImage when present", () => {
		expect(
			resolveOgImageUrl({
				isHomepage: false,
				isPatternPage: true,
				pageOgImage: "/og/patterns/modal.png",
				patternSlug: "modal",
			}),
		).toBe("/og/patterns/modal.png");
	});

	it("falls back to the pattern og route when no custom image exists", () => {
		expect(
			resolveOgImageUrl({
				isHomepage: false,
				isPatternPage: true,
				patternSlug: "modal",
			}),
		).toBe("/og/patterns/modal.png");
	});

	it("falls back to the site og image for non-pattern pages", () => {
		expect(
			resolveOgImageUrl({
				isHomepage: false,
				isPatternPage: false,
			}),
		).toBe(DEFAULT_OG_IMAGE);
	});

	it("ignores blank custom ogImage values", () => {
		expect(
			resolveOgImageUrl({
				isHomepage: false,
				isPatternPage: true,
				pageOgImage: "  ",
				patternSlug: "modal",
			}),
		).toBe("/og/patterns/modal.png");
	});
});
