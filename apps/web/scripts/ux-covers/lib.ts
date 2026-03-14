import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { PATTERNS_MAP } from "../../constants/patterns";
import {
	APPROVED_PATTERN_COVER_ACCENT_COLORS,
	APPROVED_PATTERN_COVER_COLORS,
	getPatternCoverAccentColor,
	getPatternCoverBackgroundColor,
} from "../../lib/pattern-cover-colors";

export interface CoverPromptEntry {
	locked: boolean;
	promptAddon: string;
	subjectPrompt: string;
}

export interface CoverPromptsConfig {
	basePrompt: string;
	patterns: Record<string, CoverPromptEntry>;
}

export interface PatternCoverDoc {
	accentColor: string;
	categoryLabel: string;
	categorySlug: string;
	coverBackgroundColor: string;
	description: string;
	fullSlug: string;
	slug: string;
	status: string;
	title: string;
}

export const DEFAULT_COVER_BASE_PROMPT = `Create a premium cover illustration for a UX design pattern.

Visual direction:
- Single-color editorial background with depth, lighting, and strong contrast, but still reading as one unified field of color.
- One polished product UI scene that feels specific to the pattern instead of a generic dashboard.
- Editorial, high-end, software product aesthetic.
- Clean composition, minimal clutter, crisp spacing, intentional hierarchy.

Avoid:
- No people, hands, devices floating in space, or photorealistic stock scenes.
- No brand logos, watermarks, UI labels added for decoration, or large marketing text.
- No collage of many unrelated screens.
- No low-detail wireframes or placeholder-only mockups.
- No background ribbons, blobs, beams, floating shapes, geometric overlays, aurora effects, or second-color background elements.`;

export function createDefaultCoverPromptsConfig(): CoverPromptsConfig {
	return {
		basePrompt: DEFAULT_COVER_BASE_PROMPT,
		patterns: {},
	};
}

export function getCoverPromptsFilePath(rootDir = process.cwd()) {
	return path.join(rootDir, "scripts", "ux-covers", "prompts.json");
}

export function slugToTitle(slug: string) {
	return slug
		.split("-")
		.map((part) => {
			if (part.toUpperCase() === "AI") return "AI";
			return part.charAt(0).toUpperCase() + part.slice(1);
		})
		.join(" ");
}

export function createDefaultCoverPromptEntry(
	doc: Pick<
		PatternCoverDoc,
		| "accentColor"
		| "categoryLabel"
		| "coverBackgroundColor"
		| "description"
		| "title"
	>,
): CoverPromptEntry {
	return {
		locked: false,
		promptAddon: "",
		subjectPrompt: `Show ${doc.title} as a realistic ${doc.categoryLabel.toLowerCase()} interface with one clear hero interaction. Use ${doc.coverBackgroundColor} as the unified background color and ${doc.accentColor} as the main UI accent inside the interface only. Make the scene feel product-ready and immediately recognizable from the UI structure, controls, and state shown.`,
	};
}

export async function loadCoverPromptsConfig(
	filePath = getCoverPromptsFilePath(),
): Promise<CoverPromptsConfig> {
	if (!existsSync(filePath)) {
		return createDefaultCoverPromptsConfig();
	}

	try {
		const parsed = JSON.parse(
			await readFile(filePath, "utf8"),
		) as Partial<CoverPromptsConfig>;
		return {
			basePrompt:
				typeof parsed.basePrompt === "string" && parsed.basePrompt.trim()
					? parsed.basePrompt
					: DEFAULT_COVER_BASE_PROMPT,
			patterns:
				parsed.patterns && typeof parsed.patterns === "object"
					? Object.fromEntries(
							Object.entries(parsed.patterns).map(([slug, entry]) => {
								const normalized =
									entry && typeof entry === "object"
										? (entry as Partial<CoverPromptEntry>)
										: {};
								return [
									slug,
									{
										locked: Boolean(normalized.locked),
										promptAddon:
											typeof normalized.promptAddon === "string"
												? normalized.promptAddon
												: "",
										subjectPrompt:
											typeof normalized.subjectPrompt === "string"
												? normalized.subjectPrompt
												: "",
									},
								];
							}),
						)
					: {},
		};
	} catch {
		return createDefaultCoverPromptsConfig();
	}
}

export async function saveCoverPromptsConfig(
	config: CoverPromptsConfig,
	filePath = getCoverPromptsFilePath(),
) {
	await mkdir(path.dirname(filePath), { recursive: true });
	await writeFile(filePath, JSON.stringify(config, null, 2), "utf8");
}

export async function getPatternCoverDocs(
	rootDir = process.cwd(),
): Promise<PatternCoverDoc[]> {
	const files = await fg("content/patterns/*/*.mdx", {
		absolute: true,
		cwd: rootDir,
	});

	const docs = await Promise.all(
		files.map(async (filePath) => {
			const raw = await readFile(filePath, "utf8");
			const { data } = matter(raw);
			const categorySlug = path.basename(path.dirname(filePath));
			const slug = path.basename(filePath, ".mdx");
			const category = PATTERNS_MAP[categorySlug as keyof typeof PATTERNS_MAP];

			return {
				accentColor: getPatternCoverAccentColor(categorySlug),
				categoryLabel: category?.name || slugToTitle(categorySlug),
				categorySlug,
				coverBackgroundColor: getPatternCoverBackgroundColor(
					slug,
					categorySlug,
				),
				description: String(data.description || ""),
				fullSlug: `${categorySlug}/${slug}`,
				slug,
				status: String(data.status || "complete"),
				title: String(data.title || slugToTitle(slug)),
			};
		}),
	);

	return docs.sort((left, right) =>
		left.fullSlug.localeCompare(right.fullSlug),
	);
}

export function filterPublishedPatternCoverDocs(docs: PatternCoverDoc[]) {
	return docs.filter((doc) => {
		return doc.status === "complete" || doc.status === "published";
	});
}

export function resolveRequestedPatternDocs(
	pattern: string | null,
	docs: PatternCoverDoc[],
) {
	if (!pattern || pattern === "all") {
		return docs;
	}

	const lowered = pattern.toLowerCase();
	const matches = docs.filter((doc) => {
		return (
			doc.slug.toLowerCase() === lowered ||
			doc.fullSlug.toLowerCase() === lowered
		);
	});

	if (matches.length === 0) {
		throw new Error(`No pattern matched "${pattern}".`);
	}

	return matches;
}

export function seedCoverPromptEntries(
	config: CoverPromptsConfig,
	docs: PatternCoverDoc[],
) {
	let changed = false;

	for (const doc of docs) {
		const defaultEntry = createDefaultCoverPromptEntry(doc);
		const existing = config.patterns[doc.slug];

		if (!existing) {
			config.patterns[doc.slug] = defaultEntry;
			changed = true;
			continue;
		}

		const normalized: CoverPromptEntry = {
			locked: Boolean(existing.locked),
			promptAddon:
				typeof existing.promptAddon === "string" ? existing.promptAddon : "",
			subjectPrompt:
				typeof existing.subjectPrompt === "string" &&
				existing.subjectPrompt.trim()
					? existing.subjectPrompt
					: defaultEntry.subjectPrompt,
		};

		if (
			existing.locked !== normalized.locked ||
			existing.promptAddon !== normalized.promptAddon ||
			existing.subjectPrompt !== normalized.subjectPrompt
		) {
			config.patterns[doc.slug] = normalized;
			changed = true;
		}
	}

	return { changed, config };
}

export function buildCoverPrompt(params: {
	basePrompt: string;
	doc: PatternCoverDoc;
	entry: CoverPromptEntry;
}) {
	const sections = [
		params.basePrompt.trim(),
		`Pattern metadata:
- Title: ${params.doc.title}
- Category: ${params.doc.categoryLabel}
- Description: ${params.doc.description || "No description provided."}
- Required background color: ${params.doc.coverBackgroundColor}
- Required accent color: ${params.doc.accentColor}`,
		`Color system:
- You must use only approved background colors from this palette: ${APPROVED_PATTERN_COVER_COLORS.join(", ")}.
- You must use only approved accent colors from this palette: ${APPROVED_PATTERN_COVER_ACCENT_COLORS.join(", ")}.
- For this specific pattern, the background must be a single unified field of ${params.doc.coverBackgroundColor}.
- For this specific pattern, the primary accent should be ${params.doc.accentColor} and should live in the UI elements, not as a second background layer.
- Do not invent a new dominant hue outside these palettes.
- Do not introduce a second large background color region, shape, stripe, spotlight, ribbon, or abstract object behind the card.`,
		`Subject instructions:
${params.entry.subjectPrompt.trim()}`,
		params.entry.promptAddon.trim()
			? `Prompt addon:
${params.entry.promptAddon.trim()}`
			: "",
		`Output constraints:
- Landscape cover image for a documentation site.
- 16:9 composition with a single strong focal area and enough breathing room near the edges.
- High-detail UI, legible structure, consistent spacing, and believable component states.
- Background should feel vivid and art-directed while staying visually unified as one color field.
- Any variation in the background must be extremely subtle tonal shading of the same required background color only.
- No embedded titles, captions, labels, browser chrome, watermark text, or split-panel comparison layout.`,
	];

	return sections.filter(Boolean).join("\n\n");
}

export function shouldGenerateCover(params: {
	fileExists: boolean;
	force: boolean;
	forceAll: boolean;
	locked: boolean;
}) {
	if (params.locked && !params.forceAll) {
		return false;
	}

	if (params.fileExists && !params.force && !params.forceAll) {
		return false;
	}

	return true;
}
