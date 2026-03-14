import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
	buildCoverPrompt,
	createDefaultCoverPromptsConfig,
	filterPublishedPatternCoverDocs,
	getPatternCoverDocs,
	type PatternCoverDoc,
	resolveRequestedPatternDocs,
	seedCoverPromptEntries,
	shouldGenerateCover,
} from "./lib";

function createDoc(overrides: Partial<PatternCoverDoc> = {}): PatternCoverDoc {
	return {
		accentColor: "#89a7ff",
		categoryLabel: "Layout & Navigation",
		categorySlug: "navigation",
		coverBackgroundColor: "#e80058",
		description:
			"Help users move through long collections with clear next steps.",
		fullSlug: "navigation/pagination",
		slug: "pagination",
		status: "complete",
		title: "Pagination",
		...overrides,
	};
}

describe("ux-covers lib", () => {
	it("builds the final prompt in the expected order", () => {
		const prompt = buildCoverPrompt({
			basePrompt: "BASE",
			doc: createDoc(),
			entry: {
				locked: false,
				promptAddon: "ADDON",
				subjectPrompt: "SUBJECT",
			},
		});

		expect(prompt).toContain("BASE");
		expect(prompt).toContain("Title: Pagination");
		expect(prompt).toContain("Required background color: #e80058");
		expect(prompt).toContain("Required accent color: #89a7ff");
		expect(prompt).toContain(
			"You must use only approved background colors from this palette:",
		);
		expect(prompt).toContain(
			"background must be a single unified field of #e80058",
		);
		expect(prompt).toContain(
			"Do not introduce a second large background color region, shape, stripe, spotlight, ribbon, or abstract object behind the card.",
		);
		expect(prompt).toContain("SUBJECT");
		expect(prompt).toContain("ADDON");
		expect(prompt.indexOf("BASE")).toBeLessThan(
			prompt.indexOf("Title: Pagination"),
		);
		expect(prompt.indexOf("Title: Pagination")).toBeLessThan(
			prompt.indexOf("SUBJECT"),
		);
		expect(prompt.indexOf("SUBJECT")).toBeLessThan(prompt.indexOf("ADDON"));
	});

	it("seeds missing prompt entries and preserves customized existing values", () => {
		const config = createDefaultCoverPromptsConfig();
		const docs = [createDoc()];

		const firstSeed = seedCoverPromptEntries(config, docs);
		expect(firstSeed.changed).toBe(true);
		expect(config.patterns.pagination).toBeDefined();

		config.patterns.pagination = {
			locked: true,
			promptAddon: "Keep the background electric blue.",
			subjectPrompt: "Show pagination controls below a dense results grid.",
		};

		const secondSeed = seedCoverPromptEntries(config, docs);
		expect(secondSeed.changed).toBe(false);
		expect(config.patterns.pagination).toEqual({
			locked: true,
			promptAddon: "Keep the background electric blue.",
			subjectPrompt: "Show pagination controls below a dense results grid.",
		});
	});

	it("filters docs by status and resolves requested patterns by slug or full slug", () => {
		const docs = filterPublishedPatternCoverDocs([
			createDoc(),
			createDoc({
				fullSlug: "navigation/tabs",
				slug: "tabs",
				status: "draft",
				title: "Tabs",
			}),
			createDoc({
				fullSlug: "content-management/modal",
				slug: "modal",
				title: "Modal",
				categoryLabel: "Content Management",
				categorySlug: "content-management",
			}),
		]);

		expect(docs.map((doc) => doc.slug)).toEqual(["pagination", "modal"]);
		expect(
			resolveRequestedPatternDocs("modal", docs).map((doc) => doc.slug),
		).toEqual(["modal"]);
		expect(
			resolveRequestedPatternDocs("navigation/pagination", docs).map(
				(doc) => doc.slug,
			),
		).toEqual(["pagination"]);
	});

	it("applies generation selection rules for lock and force flags", () => {
		expect(
			shouldGenerateCover({
				fileExists: false,
				force: false,
				forceAll: false,
				locked: false,
			}),
		).toBe(true);

		expect(
			shouldGenerateCover({
				fileExists: true,
				force: false,
				forceAll: false,
				locked: false,
			}),
		).toBe(false);

		expect(
			shouldGenerateCover({
				fileExists: true,
				force: true,
				forceAll: false,
				locked: false,
			}),
		).toBe(true);

		expect(
			shouldGenerateCover({
				fileExists: false,
				force: false,
				forceAll: false,
				locked: true,
			}),
		).toBe(false);

		expect(
			shouldGenerateCover({
				fileExists: true,
				force: false,
				forceAll: true,
				locked: true,
			}),
		).toBe(true);
	});

	it("reads pattern docs from content files", async () => {
		const rootDir = await mkdtemp(path.join(os.tmpdir(), "ux-covers-"));
		const patternDir = path.join(rootDir, "content", "patterns", "navigation");
		await mkdir(patternDir, { recursive: true });
		await writeFile(
			path.join(patternDir, "pagination.mdx"),
			`---
title: Pagination
description: Move across long sets of results.
status: published
---

Body`,
			"utf8",
		);

		const docs = await getPatternCoverDocs(rootDir);
		expect(docs).toHaveLength(1);
		expect(docs[0]).toMatchObject({
			accentColor: "#89a7ff",
			categoryLabel: "Layout & Navigation",
			coverBackgroundColor: "#e80058",
			description: "Move across long sets of results.",
			fullSlug: "navigation/pagination",
			slug: "pagination",
			status: "published",
			title: "Pagination",
		});
	});
});
