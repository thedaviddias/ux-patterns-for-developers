import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import { config as loadEnv } from "dotenv";
import fg from "fast-glob";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.join(__dirname, "..");
const CONTENT_ROOT = path.join(APP_ROOT, "content");
const PATTERNS_ROOT = path.join(CONTENT_ROOT, "patterns");
const GLOSSARY_ROOT = path.join(CONTENT_ROOT, "glossary");
const OUTPUT_ROOT = path.join(APP_ROOT, ".generated", "glossary-sync");

for (const envPath of [
	path.join(APP_ROOT, ".env.local"),
	path.join(APP_ROOT, ".env"),
]) {
	loadEnv({ path: envPath, override: false, quiet: true });
}

const SECTION_WEIGHTS = new Map([
	["Overview", 5],
	["Anatomy", 4],
	["Accessibility", 4],
	["Performance", 4],
	["Best Practices", 4],
	["Frequently Asked Questions", 4],
	["Examples", 1],
	["Resources", 0],
]);

const STOPWORDS = new Set([
	"a",
	"an",
	"and",
	"are",
	"as",
	"at",
	"be",
	"because",
	"but",
	"by",
	"can",
	"do",
	"for",
	"from",
	"get",
	"has",
	"have",
	"how",
	"if",
	"in",
	"into",
	"is",
	"it",
	"its",
	"may",
	"more",
	"not",
	"of",
	"on",
	"or",
	"our",
	"should",
	"that",
	"the",
	"their",
	"them",
	"there",
	"these",
	"this",
	"those",
	"to",
	"use",
	"users",
	"using",
	"when",
	"with",
	"your",
]);

const STRUCTURAL_TOKENS = new Set([
	"answer",
	"description",
	"example",
	"faq",
	"item",
	"note",
	"problem",
	"question",
	"require",
	"section",
]);

const BLOCKED_NORMALIZED_PHRASES = new Set([
	"the problem",
	"item question",
	"question what",
	"description require",
	"remove focu",
	"state change",
]);

const LEADING_INSTRUCTIONAL_TOKENS = new Set([
	"add",
	"allow",
	"announce",
	"avoid",
	"consider",
	"ensure",
	"include",
	"keep",
	"make",
	"provide",
	"show",
	"support",
	"test",
	"use",
]);

const MIN_NEW_TERM_PATTERN_COUNT = 2;
const MIN_NEW_TERM_WEIGHT = 6;
const HIGH_CONFIDENCE = 0.9;
const BORDERLINE_CONFIDENCE = 0.74;
const MIN_CONFIDENCE_GAP = 0.08;
const MAX_CANDIDATE_WORDS = 3;
const MAX_AI_MATCH_DECISIONS = 25;
const MAX_AI_NEW_TERM_SUMMARIES = 10;

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-{2,}/g, "-");
}

function isAcronym(token) {
	return /^[A-Z0-9]{2,8}$/.test(token);
}

function singularizeToken(token) {
	if (token.endsWith("ies") && token.length > 4) {
		return `${token.slice(0, -3)}y`;
	}
	if (token.endsWith("ses") && token.length > 4) {
		return token.slice(0, -2);
	}
	if (token.endsWith("s") && token.length > 3 && !token.endsWith("ss")) {
		return token.slice(0, -1);
	}
	return token;
}

function normalizeToken(token) {
	const normalized = token
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "");
	return singularizeToken(normalized);
}

export function normalizePhrase(value) {
	return value
		.split(/[\s/_-]+/)
		.map((token) => normalizeToken(token))
		.filter(Boolean)
		.join(" ");
}

function titleCaseToken(token) {
	if (isAcronym(token)) return token;
	return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

function titleCasePhrase(value) {
	return value
		.split(/\s+/)
		.filter(Boolean)
		.map((token) => titleCaseToken(token))
		.join(" ");
}

function categoryForPhrase(phrase) {
	const upper = phrase.toUpperCase();
	if (["ARIA", "DOM", "CLS", "SEO", "API", "HTML", "CSS"].includes(upper)) {
		return ["Technical"];
	}
	if (upper.includes("ARIA") || upper.includes("SCREEN")) {
		return ["Accessibility"];
	}
	if (upper.includes("LOAD") || upper.includes("CLS") || upper.includes("PERFORMANCE")) {
		return ["Performance"];
	}
	return ["UX"];
}

function findFrontmatterEnd(source) {
	if (!source.startsWith("---\n")) {
		return 0;
	}

	const endIndex = source.indexOf("\n---\n", 4);
	return endIndex === -1 ? 0 : endIndex + 5;
}

function isTableLine(trimmed) {
	return (
		trimmed.startsWith("|") ||
		(/^\|?[\s:-]+\|[\s|:-]*$/.test(trimmed) && trimmed.includes("|"))
	);
}

function isJsxLine(trimmed) {
	return /^<\/?[A-Z][A-Za-z0-9.]*/.test(trimmed) || /^<[^>]+>$/.test(trimmed);
}

function cleanParagraphText(text) {
	return text
		.replace(/!\[[^\]]*]\([^)]+\)/g, " ")
		.replace(/\[[^\]]+\]\([^)]+\)/g, " ")
		.replace(/`[^`]+`/g, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/https?:\/\/\S+/g, " ")
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/\*([^*]+)\*/g, "$1")
		.replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
		.replace(/\s+/g, " ")
		.trim();
}

function extractEligibleParagraphs(body) {
	const lines = body.split("\n");
	const paragraphs = [];
	let offset = 0;
	let currentSection = "Introduction";
	let inFence = false;
	let paragraphStart = null;
	let paragraphLines = [];

	const flushParagraph = (endOffset) => {
		if (paragraphStart === null || paragraphLines.length === 0) {
			paragraphStart = null;
			paragraphLines = [];
			return;
		}

		const raw = paragraphLines.join("\n").trim();
		const text = cleanParagraphText(raw);
		if (text) {
			paragraphs.push({
				section: currentSection,
				start: paragraphStart,
				end: endOffset,
				raw,
				text,
				weight: SECTION_WEIGHTS.get(currentSection) ?? 1,
			});
		}

		paragraphStart = null;
		paragraphLines = [];
	};

	for (const line of lines) {
		const lineStart = offset;
		const trimmed = line.trim();

		if (trimmed.startsWith("```")) {
			flushParagraph(lineStart);
			inFence = !inFence;
			offset += line.length + 1;
			continue;
		}

		if (inFence) {
			offset += line.length + 1;
			continue;
		}

		if (/^##\s+/.test(trimmed)) {
			flushParagraph(lineStart);
			currentSection = trimmed.replace(/^##\s+/, "").trim();
			offset += line.length + 1;
			continue;
		}

		const skippedLine =
			trimmed === "" ||
			trimmed.startsWith("#") ||
			trimmed.startsWith(">") ||
			trimmed.startsWith("import ") ||
			trimmed.startsWith("export ") ||
			isTableLine(trimmed) ||
			isJsxLine(trimmed);

		if (skippedLine) {
			flushParagraph(lineStart);
			offset += line.length + 1;
			continue;
		}

		if (paragraphStart === null) {
			paragraphStart = lineStart;
		}
		paragraphLines.push(line);
		offset += line.length + 1;
	}

	flushParagraph(body.length);
	return paragraphs;
}

function findBoldPhrases(paragraph) {
	return [...paragraph.raw.matchAll(/\*\*([^*\n]{3,80})\*\*/g)]
		.map((match) => match[1].trim())
		.filter(Boolean);
}

function tokenizeWithRaw(text) {
	return [...text.matchAll(/[A-Za-z0-9][A-Za-z0-9-]*/g)].map((match) => ({
		raw: match[0],
		normalized: normalizeToken(match[0]),
	}));
}

function isNoisePhrase(phrase) {
	if (!phrase) return true;
	if (/^\d+$/.test(phrase)) return true;
	if (phrase.length < 3) return true;

	const words = phrase.split(/\s+/).filter(Boolean);
	if (words.length === 0 || words.length > MAX_CANDIDATE_WORDS) return true;

	let meaningfulWords = 0;
	for (const word of words) {
		const normalized = normalizeToken(word);
		if (!normalized) return true;
		if (STOPWORDS.has(normalized)) continue;
		if (normalized.length >= 3 || isAcronym(word)) {
			meaningfulWords += 1;
		}
	}

	return meaningfulWords === 0;
}

function isBoilerplatePhrase(phrase) {
	const normalized = normalizePhrase(phrase);
	if (!normalized) return true;
	if (BLOCKED_NORMALIZED_PHRASES.has(normalized)) return true;

	const tokens = normalized.split(" ").filter(Boolean);
	if (tokens.length === 0) return true;

	if (STOPWORDS.has(tokens[0]) || STOPWORDS.has(tokens.at(-1))) {
		return true;
	}

	if (tokens.every((token) => STRUCTURAL_TOKENS.has(token))) {
		return true;
	}

	if (
		tokens.some((token) => STRUCTURAL_TOKENS.has(token)) &&
		tokens.every((token) => STRUCTURAL_TOKENS.has(token) || STOPWORDS.has(token))
	) {
		return true;
	}

	return false;
}

function simplifyCandidatePhrase(phrase) {
	const cleaned = phrase.replace(/[:.,;!?]+$/g, "").trim();
	if (!cleaned) return cleaned;

	const words = cleaned.split(/\s+/).filter(Boolean);
	let index = 0;
	while (
		index < words.length - 1 &&
		LEADING_INSTRUCTIONAL_TOKENS.has(normalizeToken(words[index]))
	) {
		index += 1;
	}

	return words.slice(index).join(" ").trim() || cleaned;
}

function extractNgramCandidates(text, weight) {
	if (weight < 4) {
		return [];
	}

	const tokens = tokenizeWithRaw(text);
	const phrases = new Map();

	for (let index = 0; index < tokens.length; index += 1) {
		for (
			let size = 2;
			size <= MAX_CANDIDATE_WORDS && index + size <= tokens.length;
			size += 1
		) {
			const slice = tokens.slice(index, index + size);
			const first = slice[0];
			const last = slice.at(-1);
			if (!first?.normalized || !last?.normalized) continue;
			if (STOPWORDS.has(first.normalized) || STOPWORDS.has(last.normalized)) {
				continue;
			}

			const phrase = slice.map((token) => token.raw).join(" ").trim();
			if (isNoisePhrase(phrase)) continue;
			if (
				slice.some(
					(token) => STOPWORDS.has(token.normalized) || token.normalized.length < 3,
				)
			) {
				continue;
			}
			if (!slice.some((token) => token.normalized.length >= 5 || isAcronym(token.raw))) {
				continue;
			}

			phrases.set(normalizePhrase(phrase), phrase);
		}
	}

	return [...phrases.values()];
}

function addAggregatedCandidate(map, phrase, occurrence) {
	const cleanedPhrase = phrase.replace(/[()[\]{}]/g, "").trim();
	if (isNoisePhrase(cleanedPhrase)) return;

	const normalized = normalizePhrase(cleanedPhrase);
	if (!normalized) return;

	const existing =
		map.get(normalized) ??
		{
			phrase: cleanedPhrase,
			normalized,
			patternSlugs: new Set(),
			sourcePatterns: [],
			occurrences: [],
			weightedScore: 0,
			hasFrontmatterSignal: false,
		};

	if (!existing.sourcePatterns.includes(occurrence.patternSlug)) {
		existing.sourcePatterns.push(occurrence.patternSlug);
	}
	existing.patternSlugs.add(occurrence.patternSlug);
	existing.occurrences.push(occurrence);
	existing.weightedScore += occurrence.weight;
	existing.hasFrontmatterSignal =
		existing.hasFrontmatterSignal || occurrence.section === "Frontmatter";

	if (cleanedPhrase.length > existing.phrase.length) {
		existing.phrase = cleanedPhrase;
	}

	map.set(normalized, existing);
}

function buildAliasIndex(glossaryEntries) {
	const aliasIndex = [];

	for (const entry of glossaryEntries) {
		const aliases = new Map();
		aliases.set(entry.title, "title");
		aliases.set(entry.slug.replace(/-/g, " "), "slug");

		for (const synonym of entry.synonyms) {
			aliases.set(synonym, "synonym");
		}

		for (const [alias, origin] of aliases.entries()) {
			const normalized = normalizePhrase(alias);
			if (!normalized) continue;

			aliasIndex.push({
				entry,
				alias,
				normalized,
				origin,
				wordCount: alias.trim().split(/\s+/).length,
			});
		}
	}

	return aliasIndex.sort(
		(a, b) => b.wordCount - a.wordCount || b.alias.length - a.alias.length,
	);
}

function countWholePhraseMatches(text, phrase) {
	const regex = new RegExp(
		`(^|[^A-Za-z0-9])(${escapeRegExp(phrase)})(?=$|[^A-Za-z0-9])`,
		"gi",
	);
	return [...text.matchAll(regex)].length;
}

function extractPatternCandidates(patternDoc, aliasIndex) {
	const directMatches = new Map();
	const discoveredCandidates = new Map();

	for (const paragraph of patternDoc.paragraphs) {
		const paragraphLower = paragraph.text.toLowerCase();
		const matchedCanonicals = new Set();

		for (const alias of aliasIndex) {
			const aliasLower = alias.alias.toLowerCase();
			if (!paragraphLower.includes(aliasLower)) continue;

			const occurrenceCount = countWholePhraseMatches(paragraph.text, alias.alias);
			if (occurrenceCount === 0) continue;

			const key = `${patternDoc.slug}:${alias.entry.slug}`;
			const confidence =
				alias.origin === "title"
					? 1
					: alias.origin === "slug"
						? 0.98
						: 0.97;

			const previous = directMatches.get(key);
			const next = {
				phrase: alias.alias,
				normalized: alias.normalized,
				patternSlug: patternDoc.slug,
				section: paragraph.section,
				occurrences: occurrenceCount,
				matchType: `exact-${alias.origin}`,
				confidence,
				action: "link-pattern",
				canonicalTerm: alias.entry.title,
				canonicalSlug: alias.entry.slug,
				sourcePatterns: [patternDoc.slug],
				usedAI: false,
				weight: paragraph.weight,
			};

			if (!previous || next.confidence > previous.confidence) {
				directMatches.set(key, next);
			}
			matchedCanonicals.add(alias.entry.slug);
		}

		for (const phrase of findBoldPhrases(paragraph)) {
			addAggregatedCandidate(discoveredCandidates, phrase, {
				patternSlug: patternDoc.slug,
				section: paragraph.section,
				occurrences: 1,
				weight: paragraph.weight + 2,
			});
		}

		for (const phrase of extractNgramCandidates(paragraph.text, paragraph.weight)) {
			if (matchedCanonicals.has(slugify(phrase))) continue;
			addAggregatedCandidate(discoveredCandidates, phrase, {
				patternSlug: patternDoc.slug,
				section: paragraph.section,
				occurrences: 1,
				weight: paragraph.weight,
			});
		}
	}

	for (const field of ["keywords", "tags", "aliases"]) {
		for (const value of patternDoc.frontmatter[field] ?? []) {
			addAggregatedCandidate(discoveredCandidates, value, {
				patternSlug: patternDoc.slug,
				section: "Frontmatter",
				occurrences: 1,
				weight: 4,
			});
		}
	}

	return {
		directMatches: [...directMatches.values()],
		discoveredCandidates,
	};
}

function tokenOverlapScore(left, right) {
	const leftTokens = new Set(left.split(" ").filter(Boolean));
	const rightTokens = new Set(right.split(" ").filter(Boolean));

	if (leftTokens.size === 0 || rightTokens.size === 0) return 0;

	let intersection = 0;
	for (const token of leftTokens) {
		if (rightTokens.has(token)) {
			intersection += 1;
		}
	}

	return intersection / Math.max(leftTokens.size, rightTokens.size);
}

function editDistance(left, right) {
	const rows = Array.from({ length: left.length + 1 }, () =>
		Array(right.length + 1).fill(0),
	);

	for (let row = 0; row <= left.length; row += 1) rows[row][0] = row;
	for (let column = 0; column <= right.length; column += 1) {
		rows[0][column] = column;
	}

	for (let row = 1; row <= left.length; row += 1) {
		for (let column = 1; column <= right.length; column += 1) {
			const cost = left[row - 1] === right[column - 1] ? 0 : 1;
			rows[row][column] = Math.min(
				rows[row - 1][column] + 1,
				rows[row][column - 1] + 1,
				rows[row - 1][column - 1] + cost,
			);
		}
	}

	return rows[left.length][right.length];
}

function similarityScore(left, right) {
	if (!left || !right) return 0;
	if (left === right) return 1;

	const overlap = tokenOverlapScore(left, right);
	const distance = editDistance(left, right);
	const maxLength = Math.max(left.length, right.length);
	const editScore = maxLength === 0 ? 1 : 1 - distance / maxLength;

	return Math.max(overlap, (overlap + editScore) / 2);
}

export function matchGlossaryPhrase(phrase, glossaryEntries) {
	const normalizedPhrase = normalizePhrase(phrase);
	const scoredCandidates = [];

	for (const entry of glossaryEntries) {
		const aliasCandidates = [
			{ value: entry.title, origin: "title" },
			{ value: entry.slug.replace(/-/g, " "), origin: "slug" },
			...entry.synonyms.map((synonym) => ({ value: synonym, origin: "synonym" })),
		];

		let best = { score: 0, origin: "fuzzy", value: entry.title };

		for (const candidate of aliasCandidates) {
			const normalizedCandidate = normalizePhrase(candidate.value);
			if (!normalizedCandidate) continue;

			if (normalizedCandidate === normalizedPhrase) {
				const score =
					candidate.origin === "title"
						? 1
						: candidate.origin === "slug"
							? 0.98
							: 0.97;
				if (score > best.score) {
					best = { score, origin: `exact-${candidate.origin}`, value: candidate.value };
				}
				continue;
			}

			const score = similarityScore(normalizedPhrase, normalizedCandidate);
			if (score > best.score) {
				best = { score, origin: "fuzzy", value: candidate.value };
			}
		}

		scoredCandidates.push({
			entry,
			score: best.score,
			matchType: best.origin,
			matchedValue: best.value,
		});
	}

	scoredCandidates.sort((left, right) => right.score - left.score);
	return scoredCandidates;
}

function needsSynonymAppend(phrase, entry) {
	const lowerPhrase = phrase.toLowerCase();
	if (entry.title.toLowerCase() === lowerPhrase) return false;
	if (entry.slug.replace(/-/g, " ").toLowerCase() === lowerPhrase) return false;
	return !entry.synonyms.some((synonym) => synonym.toLowerCase() === lowerPhrase);
}

async function maybeAdjudicateWithAI({
	ai,
	phrase,
	contexts,
	candidates,
}) {
	if (!ai || candidates.length === 0) return null;

	const prompt = `You are resolving glossary terminology for a UX patterns documentation site.

Phrase: ${phrase}
Contexts:
${contexts.map((context) => `- ${context}`).join("\n")}

Candidate canonical glossary terms:
${candidates
	.map(
		(candidate) =>
			`- slug=${candidate.entry.slug}; title=${candidate.entry.title}; description=${candidate.entry.description}`,
	)
	.join("\n")}

Return JSON only:
{"slug":"candidate-slug-or-null","confidence":0.0,"reason":"short reason"}`;

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: prompt,
		});
		const text = response.text ?? "";
		const match = text.match(/\{[\s\S]*\}/);
		if (!match) return null;
		const parsed = JSON.parse(match[0]);
		if (!parsed?.slug) return null;
		return parsed;
	} catch (_error) {
		return null;
	}
}

async function maybeSummarizeNewTerm({
	ai,
	phrase,
	contexts,
	relatedPatterns,
}) {
	if (!ai) return null;

	const prompt = `You are generating a draft glossary entry for a UX patterns documentation site.

Phrase: ${phrase}
Contexts:
${contexts.map((context) => `- ${context}`).join("\n")}

Related patterns:
${relatedPatterns.join("\n")}

Return JSON only:
{
  "title": "canonical title",
  "description": "one-sentence definition",
  "definition": "short paragraph",
  "synonyms": ["optional synonym"],
  "category": ["UX" | "Technical" | "Accessibility" | "Performance"]
}`;

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: prompt,
		});
		const text = response.text ?? "";
		const match = text.match(/\{[\s\S]*\}/);
		if (!match) return null;
		return JSON.parse(match[0]);
	} catch (_error) {
		return null;
	}
}

function createAIClientFromEnv() {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) return null;
	return new GoogleGenAI({ apiKey });
}

function rankFindingAction({ candidate, match, runnerUp, glossaryEntries }) {
	const topScore = match?.score ?? 0;
	const gap = topScore - (runnerUp?.score ?? 0);

	if (!match || topScore < BORDERLINE_CONFIDENCE) {
		return {
			action: "review",
			confidence: topScore,
			matchType: "unresolved",
			entry: null,
		};
	}

	if (
		match.matchType.startsWith("exact-") ||
		(topScore >= HIGH_CONFIDENCE && gap >= MIN_CONFIDENCE_GAP)
	) {
		return {
			action: "link-pattern",
			confidence: topScore,
			matchType: match.matchType,
			entry: match.entry,
			appendSynonym:
				candidate.simplifiedPhrase === candidate.phrase &&
				needsSynonymAppend(candidate.phrase, match.entry) &&
				candidate.patternSlugs.size >= MIN_NEW_TERM_PATTERN_COUNT,
		};
	}

	return {
		action: "review",
		confidence: topScore,
		matchType: match.matchType,
		entry: match.entry,
	};
}

export function insertGlossaryLink(text, phrase, slug) {
	const protectedRanges = [];

	for (const regex of [
		/\[[^\]]+\]\([^)]+\)/g,
		/`[^`]+`/g,
		/https?:\/\/\S+/g,
	]) {
		for (const match of text.matchAll(regex)) {
			protectedRanges.push([match.index, match.index + match[0].length]);
		}
	}

	const regex = new RegExp(
		`(^|[^A-Za-z0-9/])(${escapeRegExp(phrase)})(?=$|[^A-Za-z0-9-])`,
		"i",
	);
	const match = regex.exec(text);
	if (!match || match.index === undefined) {
		return { changed: false, text };
	}

	const phraseStart = match.index + match[1].length;
	const phraseEnd = phraseStart + match[2].length;
	const protectedRange = protectedRanges.find(
		([start, end]) => phraseStart >= start && phraseEnd <= end,
	);
	if (protectedRange) {
		return { changed: false, text };
	}

	const replacement = `[${match[2]}](/glossary/${slug})`;
	return {
		changed: true,
		text:
			text.slice(0, phraseStart) + replacement + text.slice(phraseEnd),
	};
}

function findEligibleLinkParagraph(patternDoc, phrase, slug) {
	const overviewParagraphs = patternDoc.paragraphs.filter(
		(paragraph) => paragraph.section === "Overview",
	);
	const candidates = [...overviewParagraphs, ...patternDoc.paragraphs];

	for (const paragraph of candidates) {
		if (paragraph.raw.includes(`](/glossary/${slug})`)) continue;
		const attempt = insertGlossaryLink(paragraph.raw, phrase, slug);
		if (attempt.changed) {
			return {
				paragraph,
				nextRaw: attempt.text,
			};
		}
	}

	return null;
}

export function appendSynonymToSource(source, synonym) {
	const frontmatterEnd = findFrontmatterEnd(source);
	if (frontmatterEnd === 0) {
		return { changed: false, source };
	}

	const frontmatter = source.slice(0, frontmatterEnd);
	if (new RegExp(escapeRegExp(synonym), "i").test(frontmatter)) {
		return { changed: false, source };
	}

	if (/^synonyms:\s*\[[^\]]*\]\s*$/m.test(frontmatter)) {
		const nextFrontmatter = frontmatter.replace(
			/^synonyms:\s*\[([^\]]*)\]\s*$/m,
			(_match, values) => {
				const trimmed = values.trim();
				if (!trimmed) return `synonyms: ["${synonym}"]`;
				return `synonyms: [${trimmed}, "${synonym}"]`;
			},
		);
		return {
			changed: nextFrontmatter !== frontmatter,
			source: nextFrontmatter + source.slice(frontmatterEnd),
		};
	}

	if (/^synonyms:\s*$/m.test(frontmatter)) {
		const nextFrontmatter = frontmatter.replace(
			/^synonyms:\s*$/m,
			`synonyms:\n  - "${synonym}"`,
		);
		return {
			changed: nextFrontmatter !== frontmatter,
			source: nextFrontmatter + source.slice(frontmatterEnd),
		};
	}

	const insertionPoint =
		frontmatter.match(/^status:.*$/m)?.index ??
		frontmatter.lastIndexOf("---");
	const nextFrontmatter =
		frontmatter.slice(0, insertionPoint) +
		`synonyms: ["${synonym}"]\n` +
		frontmatter.slice(insertionPoint);

	return {
		changed: nextFrontmatter !== frontmatter,
		source: nextFrontmatter + source.slice(frontmatterEnd),
	};
}

export function createGlossaryDraftSource({
	title,
	description,
	definition,
	synonyms = [],
	relatedPatterns = [],
	category = ["UX"],
}) {
	const serializedSynonyms = JSON.stringify(synonyms);
	const serializedRelatedPatterns = relatedPatterns.length
		? `[\n${relatedPatterns.map((item) => `  "${item}"`).join(",\n")}\n]`
		: "[]";
	const serializedCategory = JSON.stringify(category);

	return `---
title: "${title}"
description: "${description}"
category: ${serializedCategory}
related_patterns: ${serializedRelatedPatterns}
synonyms: ${serializedSynonyms}
status: draft
---

import { GlossaryStructuredData } from "@/components/glossary/structured-data";

<GlossaryStructuredData
  term="${title}"
  definition="${description}"
  category={${serializedCategory}}
/>

${definition}

## Related Patterns

${relatedPatterns.length > 0 ? relatedPatterns.map((pattern) => `- [${pattern.split("/").at(-1)?.replace(/-/g, " ")}](${pattern})`).join("\n") : "Add related pattern links."}
`;
}

async function loadGlossaryEntries(glossaryRoot = GLOSSARY_ROOT) {
	const files = await fg("**/*.mdx", { cwd: glossaryRoot, absolute: true });
	const entries = [];

	for (const filePath of files) {
		const source = await fs.readFile(filePath, "utf8");
		const parsed = matter(source);
		const slug = path
			.relative(glossaryRoot, filePath)
			.replace(/\\/g, "/")
			.replace(/^[a-z]\//, "")
			.replace(/\.mdx$/, "");
		const finalSlug = slug.split("/").at(-1);

		entries.push({
			filePath,
			source,
			slug: finalSlug,
			url: `/glossary/${finalSlug}`,
			title: parsed.data.title ?? finalSlug,
			description: parsed.data.description ?? "",
			category: Array.isArray(parsed.data.category) ? parsed.data.category : [],
			synonyms: Array.isArray(parsed.data.synonyms) ? parsed.data.synonyms : [],
			relatedPatterns: Array.isArray(parsed.data.related_patterns)
				? parsed.data.related_patterns
				: [],
		});
	}

	return entries;
}

async function loadPatternDocs(patternsRoot = PATTERNS_ROOT, patternFilter) {
	const files = await fg("**/*.mdx", { cwd: patternsRoot, absolute: true });
	const docs = [];

	for (const filePath of files) {
		const source = await fs.readFile(filePath, "utf8");
		const parsed = matter(source);
		const slug = path
			.relative(patternsRoot, filePath)
			.replace(/\\/g, "/")
			.replace(/\.mdx$/, "");
		const basename = path.basename(slug);

		if (patternFilter && patternFilter !== slug && patternFilter !== basename) {
			continue;
		}

		docs.push({
			filePath,
			source,
			slug,
			title: parsed.data.title ?? basename,
			frontmatter: parsed.data,
			body: parsed.content,
			paragraphs: extractEligibleParagraphs(parsed.content),
		});
	}

	return docs;
}

function dedupeFindings(findings) {
	const byKey = new Map();

	for (const finding of findings) {
		const key = [
			finding.action,
			finding.patternSlug ?? "",
			finding.canonicalSlug ?? "",
			finding.phrase,
		].join(":");
		const previous = byKey.get(key);
		if (!previous || finding.confidence > previous.confidence) {
			byKey.set(key, finding);
		}
	}

	return [...byKey.values()].sort((left, right) => right.confidence - left.confidence);
}

function shouldCreateNewTermDraft(candidate) {
	if (candidate.patternSlugs.size < MIN_NEW_TERM_PATTERN_COUNT) return false;
	if (candidate.weightedScore < MIN_NEW_TERM_WEIGHT) return false;
	if (candidate.simplifiedPhrase !== candidate.phrase) return false;
	if (isBoilerplatePhrase(candidate.phrase)) return false;

	const substantiveOccurrences = candidate.occurrences.filter(
		(occurrence) =>
			occurrence.section !== "Frequently Asked Questions" &&
			occurrence.section !== "Frontmatter",
	);

	if (
		!candidate.hasFrontmatterSignal &&
		substantiveOccurrences.length < MIN_NEW_TERM_PATTERN_COUNT
	) {
		return false;
	}

	const averageWeight =
		candidate.occurrences.length === 0
			? 0
			: candidate.weightedScore / candidate.occurrences.length;

	return candidate.hasFrontmatterSignal || averageWeight >= 3;
}

function renderMarkdownReport(report) {
	const lines = [
		"# Glossary Sync Report",
		"",
		`- Mode: ${report.mode}`,
		`- Patterns scanned: ${report.summary.patternsScanned}`,
		`- Glossary entries scanned: ${report.summary.glossaryEntriesScanned}`,
		`- Findings: ${report.summary.findings}`,
		`- Link edits: ${report.summary.linkEdits}`,
		`- Synonym updates: ${report.summary.synonymUpdates}`,
		`- Drafts created: ${report.summary.draftsCreated}`,
		`- AI available: ${report.summary.aiAvailable ? "yes" : "no"}`,
		"",
		"## Findings",
		"",
	];

	if (report.findings.length === 0) {
		lines.push("No findings.");
		return `${lines.join("\n")}\n`;
	}

	for (const finding of report.findings) {
		lines.push(`### ${finding.phrase}`);
		lines.push(`- Action: ${finding.action}`);
		lines.push(`- Confidence: ${finding.confidence.toFixed(2)}`);
		lines.push(`- Match: ${finding.matchType}`);
		if (finding.patternSlug) lines.push(`- Pattern: ${finding.patternSlug}`);
		if (finding.canonicalTerm) lines.push(`- Canonical term: ${finding.canonicalTerm}`);
		if (finding.proposedTerm) lines.push(`- Proposed term: ${finding.proposedTerm}`);
		lines.push(`- AI used: ${finding.usedAI ? "yes" : "no"}`);
		if (finding.sourcePatterns?.length) {
			lines.push(`- Source patterns: ${finding.sourcePatterns.join(", ")}`);
		}
		lines.push("");
	}

	return `${lines.join("\n")}\n`;
}

function summarizeReport({
	mode,
	findings,
	linkEdits,
	synonymUpdates,
	draftsCreated,
	patternDocs,
	glossaryEntries,
	ai,
}) {
	return {
		mode,
		summary: {
			patternsScanned: patternDocs.length,
			glossaryEntriesScanned: glossaryEntries.length,
			findings: findings.length,
			linkEdits,
			synonymUpdates,
			draftsCreated,
			aiAvailable: Boolean(ai),
		},
		findings,
	};
}

function patternUrlFromSlug(slug) {
	return `/patterns/${slug}`;
}

async function writeReport(outputRoot, report) {
	await fs.mkdir(outputRoot, { recursive: true });
	await fs.writeFile(
		path.join(outputRoot, "report.json"),
		`${JSON.stringify(report, null, 2)}\n`,
		"utf8",
	);
	await fs.writeFile(
		path.join(outputRoot, "report.md"),
		renderMarkdownReport(report),
		"utf8",
	);
}

async function applyFindings({
	findings,
	patternDocs,
	glossaryEntries,
	glossaryRoot,
	mode,
	dryRun,
}) {
	const patternMap = new Map(patternDocs.map((doc) => [doc.slug, doc]));
	const glossaryMap = new Map(glossaryEntries.map((entry) => [entry.slug, entry]));
	const pendingPatternSources = new Map();
	const pendingGlossarySources = new Map();
	const drafts = [];
	let linkEdits = 0;
	let synonymUpdates = 0;
	let draftsCreated = 0;

	for (const finding of findings) {
		if (finding.action === "link-pattern" && finding.canonicalSlug && finding.patternSlug) {
			const patternDoc = patternMap.get(finding.patternSlug);
			if (!patternDoc) continue;

			const currentSource =
				pendingPatternSources.get(patternDoc.filePath) ?? patternDoc.source;

			const currentDoc = {
				...patternDoc,
				source: currentSource,
				body: matter(currentSource).content,
				paragraphs: extractEligibleParagraphs(matter(currentSource).content),
			};
			const selected = findEligibleLinkParagraph(
				currentDoc,
				finding.phrase,
				finding.canonicalSlug,
			);
			if (!selected) continue;

			const nextBody =
				currentDoc.body.slice(0, selected.paragraph.start) +
				selected.nextRaw +
				currentDoc.body.slice(selected.paragraph.end);
			const frontmatter = currentSource.slice(0, findFrontmatterEnd(currentSource));
			const nextSource = `${frontmatter}${nextBody}`;
			pendingPatternSources.set(patternDoc.filePath, nextSource);
			linkEdits += 1;
			continue;
		}

		if (finding.action === "append-synonym" && finding.canonicalSlug) {
			const glossaryEntry = glossaryMap.get(finding.canonicalSlug);
			if (!glossaryEntry) continue;

			const currentSource =
				pendingGlossarySources.get(glossaryEntry.filePath) ?? glossaryEntry.source;
			const result = appendSynonymToSource(currentSource, finding.phrase);
			if (!result.changed) continue;

			pendingGlossarySources.set(glossaryEntry.filePath, result.source);
			synonymUpdates += 1;
			continue;
		}

		if (finding.action === "create-glossary-draft" && finding.proposedTerm) {
			const slug = slugify(finding.proposedTerm);
			const folder = slug.charAt(0) || "misc";
			const filePath = path.join(glossaryRoot, folder, `${slug}.mdx`);
			drafts.push({
				filePath,
				source: createGlossaryDraftSource({
					title: finding.proposedTerm,
					description:
						finding.description ??
						`Definition and explanation of ${finding.proposedTerm} in the context of UX patterns and web development.`,
					definition:
						finding.definition ??
						`${finding.proposedTerm} is a term used across these UX patterns and should be documented in the glossary.`,
					synonyms: finding.synonyms ?? [],
					relatedPatterns: (finding.sourcePatterns ?? [])
						.slice(0, 3)
						.map((slugValue) => patternUrlFromSlug(slugValue)),
					category: finding.category ?? categoryForPhrase(finding.proposedTerm),
				}),
			});
			draftsCreated += 1;
		}
	}

	if (mode === "sync" && !dryRun) {
		for (const [filePath, source] of pendingPatternSources.entries()) {
			await fs.writeFile(filePath, source, "utf8");
		}
		for (const [filePath, source] of pendingGlossarySources.entries()) {
			await fs.writeFile(filePath, source, "utf8");
		}
		for (const draft of drafts) {
			await fs.mkdir(path.dirname(draft.filePath), { recursive: true });
			await fs.writeFile(draft.filePath, draft.source, "utf8");
		}
	}

	return { linkEdits, synonymUpdates, draftsCreated, drafts };
}

export async function runGlossarySync({
	mode = "audit",
	pattern,
	dryRun = false,
	patternsRoot = PATTERNS_ROOT,
	glossaryRoot = GLOSSARY_ROOT,
	outputRoot = OUTPUT_ROOT,
	ai = createAIClientFromEnv(),
} = {}) {
	const [glossaryEntries, patternDocs] = await Promise.all([
		loadGlossaryEntries(glossaryRoot),
		loadPatternDocs(patternsRoot, pattern),
	]);
	const aliasIndex = buildAliasIndex(glossaryEntries);

	const findings = [];
	const aggregatedCandidates = new Map();

	for (const patternDoc of patternDocs) {
		const { directMatches, discoveredCandidates } = extractPatternCandidates(
			patternDoc,
			aliasIndex,
		);
		findings.push(...directMatches);

		for (const [normalized, candidate] of discoveredCandidates.entries()) {
			const existing = aggregatedCandidates.get(normalized);
			if (!existing) {
				aggregatedCandidates.set(normalized, candidate);
				continue;
			}

			for (const slugValue of candidate.patternSlugs) {
				existing.patternSlugs.add(slugValue);
			}
			for (const sourcePattern of candidate.sourcePatterns) {
				if (!existing.sourcePatterns.includes(sourcePattern)) {
					existing.sourcePatterns.push(sourcePattern);
				}
			}
			existing.occurrences.push(...candidate.occurrences);
			existing.weightedScore += candidate.weightedScore;
			if (candidate.phrase.length > existing.phrase.length) {
				existing.phrase = candidate.phrase;
			}
		}
	}

	const candidateQueue = [...aggregatedCandidates.values()].sort((left, right) => {
		return (
			right.patternSlugs.size - left.patternSlugs.size ||
			right.weightedScore - left.weightedScore ||
			right.phrase.length - left.phrase.length
		);
	});
	let aiMatchDecisions = 0;
	let aiNewTermSummaries = 0;

	for (const candidate of candidateQueue) {
		if (
			candidate.patternSlugs.size < MIN_NEW_TERM_PATTERN_COUNT &&
			!candidate.hasFrontmatterSignal
		) {
			continue;
		}

		if (findings.some((finding) => normalizePhrase(finding.phrase) === candidate.normalized)) {
			continue;
		}

		candidate.simplifiedPhrase = simplifyCandidatePhrase(candidate.phrase);
		const ranked = matchGlossaryPhrase(
			candidate.simplifiedPhrase,
			glossaryEntries,
		);
		const topCandidate = ranked[0];
		const runnerUp = ranked[1];
		let decision = rankFindingAction({
			candidate,
			match: topCandidate,
			runnerUp,
			glossaryEntries,
		});
		let usedAI = false;

		if (
			decision.action === "review" &&
			ai &&
			aiMatchDecisions < MAX_AI_MATCH_DECISIONS &&
			topCandidate &&
			topCandidate.score >= 0.78 &&
			candidate.patternSlugs.size >= MIN_NEW_TERM_PATTERN_COUNT
		) {
			aiMatchDecisions += 1;
			const aiDecision = await maybeAdjudicateWithAI({
				ai,
				phrase: candidate.simplifiedPhrase,
				contexts: candidate.occurrences
					.slice(0, 3)
					.map(
						(occurrence) =>
							`${occurrence.section}: ${candidate.simplifiedPhrase}`,
					),
				candidates: ranked.slice(0, 3),
			});
			if (aiDecision?.slug) {
				const aiMatch = ranked.find(
					(entry) => entry.entry.slug === aiDecision.slug,
				);
				if (aiMatch && Number(aiDecision.confidence ?? 0) >= HIGH_CONFIDENCE) {
					decision = {
						action: "link-pattern",
						confidence: Number(aiDecision.confidence),
						matchType: "ai-adjudicated",
						entry: aiMatch.entry,
						appendSynonym:
							candidate.simplifiedPhrase === candidate.phrase &&
							needsSynonymAppend(candidate.phrase, aiMatch.entry) &&
							candidate.patternSlugs.size >= MIN_NEW_TERM_PATTERN_COUNT,
					};
					usedAI = true;
				}
			}
		}

		if (decision.entry) {
			findings.push({
				phrase: topCandidate?.matchedValue ?? candidate.simplifiedPhrase,
				normalized: normalizePhrase(
					topCandidate?.matchedValue ?? candidate.simplifiedPhrase,
				),
				patternSlug: candidate.sourcePatterns[0],
				section: candidate.occurrences[0]?.section ?? "Unknown",
				occurrences: candidate.occurrences.length,
				matchType: decision.matchType,
				confidence: decision.confidence,
				action: decision.action,
				canonicalTerm: decision.entry.title,
				canonicalSlug: decision.entry.slug,
				sourcePatterns: candidate.sourcePatterns,
				usedAI,
			});

			if (decision.appendSynonym) {
				findings.push({
					phrase: candidate.simplifiedPhrase,
					normalized: normalizePhrase(candidate.simplifiedPhrase),
					matchType: "append-synonym",
					confidence: decision.confidence,
					action: "append-synonym",
					canonicalTerm: decision.entry.title,
					canonicalSlug: decision.entry.slug,
					sourcePatterns: candidate.sourcePatterns,
					usedAI,
				});
			}
			continue;
		}

		if (
			ai &&
			aiNewTermSummaries < MAX_AI_NEW_TERM_SUMMARIES &&
			shouldCreateNewTermDraft(candidate)
		) {
			aiNewTermSummaries += 1;
			const summary = await maybeSummarizeNewTerm({
				ai,
				phrase: candidate.simplifiedPhrase,
				contexts: candidate.occurrences
					.slice(0, 3)
					.map(
						(occurrence) =>
							`${occurrence.section}: ${candidate.simplifiedPhrase}`,
					),
				relatedPatterns: candidate.sourcePatterns.map(patternUrlFromSlug),
			});
			if (summary?.title && summary?.description) {
				findings.push({
					phrase: candidate.simplifiedPhrase,
					normalized: normalizePhrase(candidate.simplifiedPhrase),
					matchType: "ai-new-term",
					confidence: 0.92,
					action: "create-glossary-draft",
					proposedTerm: titleCasePhrase(summary.title),
					description: summary.description,
					definition: summary.definition,
					synonyms: Array.isArray(summary.synonyms) ? summary.synonyms : [],
					category: Array.isArray(summary.category)
						? summary.category
						: categoryForPhrase(summary.title),
					sourcePatterns: candidate.sourcePatterns,
					usedAI: true,
				});
				continue;
			}
		}

		findings.push({
			phrase: candidate.simplifiedPhrase,
			normalized: normalizePhrase(candidate.simplifiedPhrase),
			matchType: decision.matchType,
			confidence: decision.confidence,
			action: "review",
			canonicalTerm: decision.entry?.title,
			canonicalSlug: decision.entry?.slug,
			sourcePatterns: candidate.sourcePatterns,
			usedAI,
		});
	}

	const finalFindings = dedupeFindings(findings);
	const editSummary = await applyFindings({
		findings: finalFindings,
		patternDocs,
		glossaryEntries,
		glossaryRoot,
		mode,
		dryRun,
	});

	const report = summarizeReport({
		mode,
		findings: finalFindings,
		linkEdits: editSummary.linkEdits,
		synonymUpdates: editSummary.synonymUpdates,
		draftsCreated: editSummary.draftsCreated,
		patternDocs,
		glossaryEntries,
		ai,
	});

	await writeReport(outputRoot, report);

	return {
		...report,
		drafts: editSummary.drafts,
		outputRoot,
	};
}
