import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import { config as loadEnv } from "dotenv";
import fg from "fast-glob";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRetext from "remark-retext";
import { retext } from "retext";
import retextEnglish from "retext-english";
import retextKeywords from "retext-keywords";
import retextPos from "retext-pos";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.join(__dirname, "..");
const CONTENT_ROOT = path.join(APP_ROOT, "content");
const PATTERNS_ROOT = path.join(CONTENT_ROOT, "patterns");
const GLOSSARY_ROOT = path.join(CONTENT_ROOT, "glossary");
const OUTPUT_ROOT = path.join(APP_ROOT, ".generated", "glossary-sync");
const AUDIT_REPORT_PATH = path.join(OUTPUT_ROOT, "report.json");
const RELEVANCE_REPORT_JSON_PATH = path.join(
	OUTPUT_ROOT,
	"relevance-report.json",
);
const RELEVANCE_REPORT_MD_PATH = path.join(
	OUTPUT_ROOT,
	"relevance-report.md",
);
const MEDIUM_APPROVALS_PATH = path.join(
	APP_ROOT,
	"config",
	"glossary-medium-approvals.json",
);

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
	"remove focus",
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
	if (
		token.endsWith("s") &&
		token.length > 3 &&
		!token.endsWith("ss") &&
		!token.endsWith("us") &&
		!token.endsWith("is")
	) {
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

function clamp(value, minimum, maximum) {
	return Math.min(Math.max(value, minimum), maximum);
}

function roundSignal(value) {
	return Number(value.toFixed(2));
}

function normalizeDraftKey(value) {
	return normalizePhrase(value ?? "");
}

function getRelevanceSectionWeight(section) {
	switch (section) {
		case "Overview":
			return 5;
		case "Accessibility":
		case "Performance":
		case "Anatomy":
		case "Best Practices":
			return 4;
		case "Use Cases":
		case "Benefits":
		case "Drawbacks":
		case "State Management":
			return 3;
		case "Frequently Asked Questions":
			return 1;
		case "Examples":
		case "Testing Guidelines":
			return 1.5;
		case "Resources":
			return 0;
		default:
			return 2;
	}
}

function nlcstToString(node) {
	if (!node) return "";
	if (Array.isArray(node)) {
		return node.map((child) => nlcstToString(child)).join("");
	}
	if (typeof node.value === "string") {
		return node.value;
	}
	if (Array.isArray(node.children)) {
		return node.children.map((child) => nlcstToString(child)).join("");
	}
	return "";
}

const phraseAnalysisCache = new Map();

async function analyzeMarkdownPhrases(markdown) {
	if (phraseAnalysisCache.has(markdown)) {
		return phraseAnalysisCache.get(markdown);
	}

	const file = await remark()
		.use(
			remarkRetext,
			retext()
				.use(retextEnglish)
				.use(retextPos)
				.use(retextKeywords, { maximum: 12 }),
		)
		.process(markdown);

	const keywords = (file.data.keywords ?? [])
		.map((keyword) => nlcstToString(keyword.matches?.[0]?.node))
		.map((value) => value.trim())
		.filter(Boolean);
	const keyphrases = (file.data.keyphrases ?? [])
		.map((phrase) => nlcstToString(phrase.matches?.[0]?.nodes))
		.map((value) => value.replace(/\s+/g, " ").trim())
		.filter(Boolean);
	const result = {
		keywords,
		keyphrases,
		normalizedKeywords: new Set(keywords.map((value) => normalizePhrase(value))),
		normalizedKeyphrases: new Set(
			keyphrases.map((value) => normalizePhrase(value)),
		),
	};
	phraseAnalysisCache.set(markdown, result);
	return result;
}

function isListParagraph(raw) {
	return /^\s*([-*+]|\d+\.)\s+/m.test(raw);
}

function isChecklistParagraph(raw) {
	return /^\s*[-*+]\s+\[[ xX]\]\s+/m.test(raw);
}

function isMdxDataParagraph(raw) {
	return (
		raw.includes("items={[") ||
		(raw.includes("question:") && raw.includes("answer:")) ||
		(raw.includes('"question"') && raw.includes('"answer"'))
	);
}

function isHeadingLikeParagraph(raw) {
	return /^\s*\d+\.\s+[A-Z][A-Za-z /&-]+$/.test(raw.trim());
}

function scoreBoilerplateRisk(phrase) {
	const normalized = normalizePhrase(phrase);
	if (!normalized) return 1;
	if (BLOCKED_NORMALIZED_PHRASES.has(normalized)) return 1;

	const tokens = normalized.split(" ").filter(Boolean);
	const structuralCount = tokens.filter((token) =>
		STRUCTURAL_TOKENS.has(token),
	).length;
	let risk = 0;

	if (tokens.length === 0) return 1;
	if (STOPWORDS.has(tokens[0]) || STOPWORDS.has(tokens.at(-1))) risk += 0.45;
	if (/^(this|that|these|those)\b/i.test(phrase.trim())) risk += 0.5;
	risk += (structuralCount / tokens.length) * 0.8;

	return roundSignal(clamp(risk, 0, 1));
}

function scoreInstructionalPhraseRisk(phrase) {
	const simplified = simplifyCandidatePhrase(phrase);
	if (simplified !== phrase) return 1;

	const firstToken = phrase.trim().split(/\s+/)[0] ?? "";
	return LEADING_INSTRUCTIONAL_TOKENS.has(normalizeToken(firstToken)) ? 0.8 : 0;
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
	const candidates = [
		...overviewParagraphs,
		...patternDoc.paragraphs.filter((paragraph) => paragraph.section !== "Resources"),
	];

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

function getCandidateVariants(candidate) {
	return [
		candidate.phrase,
		candidate.proposedTerm,
		simplifyCandidatePhrase(candidate.phrase),
		simplifyCandidatePhrase(candidate.proposedTerm ?? ""),
	]
		.filter(Boolean)
		.filter((value, index, values) => values.indexOf(value) === index);
}

function countPhraseMentions(text, phrases) {
	let matches = 0;

	for (const phrase of phrases) {
		if (!phrase) continue;
		matches += countWholePhraseMatches(text, phrase);
	}

	return matches;
}

export async function extractCandidatePhraseEvidence(patternDocs, candidate) {
	const patternMap = new Map(patternDocs.map((doc) => [doc.slug, doc]));
	const variants = getCandidateVariants(candidate);
	const normalizedVariants = new Set(variants.map((value) => normalizePhrase(value)));
	const sourcePatterns =
		candidate.sourcePatterns?.length > 0
			? candidate.sourcePatterns
			: patternDocs.map((doc) => doc.slug);
	const mentions = [];

	for (const patternSlug of sourcePatterns) {
		const patternDoc = patternMap.get(patternSlug);
		if (!patternDoc) continue;

		for (const paragraph of patternDoc.paragraphs) {
			if (isMdxDataParagraph(paragraph.raw) || isHeadingLikeParagraph(paragraph.raw)) {
				continue;
			}

			const mentionCount = countPhraseMentions(paragraph.text, variants);
			if (mentionCount === 0) continue;

			const phraseSignals = await analyzeMarkdownPhrases(paragraph.raw);
			const keyphraseAligned = [...normalizedVariants].some(
				(variant) =>
					phraseSignals.normalizedKeywords.has(variant) ||
					phraseSignals.normalizedKeyphrases.has(variant),
			);

			mentions.push({
				patternSlug: patternDoc.slug,
				section: paragraph.section,
				sectionWeight: getRelevanceSectionWeight(paragraph.section),
				contextType: isListParagraph(paragraph.raw) ? "list" : "prose",
				isFaq: paragraph.section === "Frequently Asked Questions",
				isChecklist: isChecklistParagraph(paragraph.raw),
				mentionCount,
				keyphraseAligned,
				excerpt: paragraph.text.slice(0, 180),
			});
		}
	}

	return {
		variants,
		mentions,
	};
}

function computePhraseQuality(candidate, evidence) {
	const normalized = normalizePhrase(candidate.proposedTerm ?? candidate.phrase);
	const tokens = normalized.split(" ").filter(Boolean);
	let score = 0;

	if (tokens.length >= 2 && tokens.length <= 3) score += 0.35;
	else if (tokens.length === 1 && tokens[0]?.length >= 6) score += 0.2;
	else if (tokens.length === 4) score += 0.1;

	if (!isBoilerplatePhrase(candidate.proposedTerm ?? candidate.phrase)) score += 0.25;
	if (scoreInstructionalPhraseRisk(candidate.phrase) === 0) score += 0.1;
	if (
		titleCasePhrase(candidate.proposedTerm ?? candidate.phrase) ===
		(candidate.proposedTerm ?? candidate.phrase)
	) {
		score += 0.1;
	}

	const keyphraseMatches = evidence.mentions.filter(
		(mention) => mention.keyphraseAligned,
	).length;
	if (keyphraseMatches > 0) {
		score += 0.2 + Math.min(0.1, keyphraseMatches * 0.02);
	}

	return roundSignal(clamp(score, 0, 1));
}

function getTopSupportingPatterns(mentions) {
	const scores = new Map();

	for (const mention of mentions) {
		scores.set(
			mention.patternSlug,
			(scores.get(mention.patternSlug) ?? 0) +
				mention.sectionWeight +
				mention.mentionCount +
				(mention.keyphraseAligned ? 1 : 0),
		);
	}

	return [...scores.entries()]
		.sort((left, right) => right[1] - left[1])
		.slice(0, 3)
		.map(([patternSlug]) => patternSlug);
}

function getTopSupportingSections(mentions) {
	const counts = new Map();

	for (const mention of mentions) {
		counts.set(mention.section, (counts.get(mention.section) ?? 0) + 1);
	}

	return [...counts.entries()]
		.sort((left, right) => right[1] - left[1])
		.slice(0, 3)
		.map(([section]) => section);
}

export function scoreGlossaryCandidateRelevance(
	candidate,
	evidence,
	glossaryEntries,
) {
	const mentions = evidence.mentions;
	const distinctPatternCount = new Set(
		mentions.map((mention) => mention.patternSlug),
	).size;
	const proseMentions = mentions.filter(
		(mention) => mention.contextType === "prose",
	).length;
	const listMentions = mentions.filter(
		(mention) => mention.contextType === "list",
	).length;
	const faqMentions = mentions.filter(
		(mention) => mention.isFaq,
	).length;
	const checklistMentions = mentions.filter(
		(mention) => mention.isChecklist,
	).length;
	const weightedSectionCoverage =
		mentions.length === 0
			? 0
			: mentions.reduce((sum, mention) => sum + mention.sectionWeight, 0) /
				mentions.length;
	const nearestGlossaryMatch =
		matchGlossaryPhrase(candidate.proposedTerm ?? candidate.phrase, glossaryEntries)[0] ??
		null;
	const existingGlossarySimilarity = nearestGlossaryMatch
		? roundSignal(nearestGlossaryMatch.score)
		: 0;
	const boilerplateRisk = scoreBoilerplateRisk(candidate.phrase);
	const instructionalPhraseRisk = scoreInstructionalPhraseRisk(candidate.phrase);
	const phraseQuality = computePhraseQuality(candidate, evidence);
	const keyphraseMentions = mentions.filter(
		(mention) => mention.keyphraseAligned,
	).length;

	const coverageScore = Math.min(25, distinctPatternCount * 2);
	const sectionScore = Math.min(20, (weightedSectionCoverage / 5) * 20);
	const contextScore = clamp(
		(proseMentions / Math.max(1, mentions.length)) * 18 +
			(keyphraseMentions / Math.max(1, mentions.length)) * 2 -
			listMentions * 0.9 -
			faqMentions * 0.75 -
			checklistMentions * 1.25,
		0,
		20,
	);
	const phraseQualityScore = phraseQuality * 25;
	const glossaryDistinctnessScore = (1 - existingGlossarySimilarity) * 10;
	const penaltyScore = boilerplateRisk * 25 + instructionalPhraseRisk * 15;
	const relevanceScore = Math.round(
		clamp(
			coverageScore +
				sectionScore +
				contextScore +
				phraseQualityScore +
				glossaryDistinctnessScore -
				penaltyScore,
			0,
			100,
		),
	);
	let cappedRelevanceScore = relevanceScore;
	if (proseMentions === 0) {
		cappedRelevanceScore = Math.min(cappedRelevanceScore, 64);
	}
	if (proseMentions <= 1 && listMentions >= 20) {
		cappedRelevanceScore = Math.min(cappedRelevanceScore, 59);
	}
	if (checklistMentions >= 10 && checklistMentions > proseMentions * 4) {
		cappedRelevanceScore = Math.min(cappedRelevanceScore, 59);
	}
	if (existingGlossarySimilarity >= 0.5 && proseMentions <= 1) {
		cappedRelevanceScore = Math.min(cappedRelevanceScore, 49);
	}
	if (
		proseMentions >= 10 &&
		existingGlossarySimilarity < 0.3 &&
		boilerplateRisk === 0 &&
		instructionalPhraseRisk === 0
	) {
		cappedRelevanceScore = Math.max(cappedRelevanceScore, 75);
	}

	let tier = "low";
	let recommendedAction = "reject";
	if (cappedRelevanceScore >= 75 && proseMentions >= 5) {
		tier = "high";
		recommendedAction = "keep-review";
	} else if (cappedRelevanceScore >= 50) {
		tier = "medium";
		recommendedAction = "defer";
	}

	return {
		phrase: candidate.phrase,
		proposedTerm: candidate.proposedTerm,
		relevanceScore: cappedRelevanceScore,
		tier,
		recommendedAction,
		signals: {
			patternCoverage: distinctPatternCount,
			weightedSectionCoverage: roundSignal(weightedSectionCoverage),
			proseMentions,
			listMentions,
			faqMentions,
			checklistMentions,
			existingGlossarySimilarity,
			boilerplateRisk,
			instructionalPhraseRisk,
			phraseQuality,
			keyphraseMentions,
		},
		evidence: {
			topSupportingPatterns: getTopSupportingPatterns(mentions),
			topSupportingSections: getTopSupportingSections(mentions),
			nearestExistingGlossaryTerm:
				nearestGlossaryMatch && nearestGlossaryMatch.score >= 0.5
					? {
							title: nearestGlossaryMatch.entry.title,
							slug: nearestGlossaryMatch.entry.slug,
							similarity: roundSignal(nearestGlossaryMatch.score),
						}
					: null,
			sampleExcerpts: mentions.slice(0, 3).map((mention) => ({
				patternSlug: mention.patternSlug,
				section: mention.section,
				excerpt: mention.excerpt,
			})),
		},
	};
}

function renderRelevanceMarkdownReport(report) {
	const lines = [
		"# Glossary Relevance Report",
		"",
		`- Candidates: ${report.summary.candidates}`,
		`- High relevance: ${report.summary.high}`,
		`- Medium relevance: ${report.summary.medium}`,
		`- Low relevance: ${report.summary.low}`,
		"",
	];

	for (const tier of ["high", "medium", "low"]) {
		const candidates = report.candidates.filter((candidate) => candidate.tier === tier);
		lines.push(`## ${tier.charAt(0).toUpperCase() + tier.slice(1)}`);
		lines.push("");

		if (candidates.length === 0) {
			lines.push("No candidates.");
			lines.push("");
			continue;
		}

		for (const candidate of candidates) {
			lines.push(
				`### ${candidate.proposedTerm} (${candidate.relevanceScore})`,
			);
			lines.push(`- Phrase: ${candidate.phrase}`);
			lines.push(`- Action: ${candidate.recommendedAction}`);
			lines.push(`- Draft eligibility: ${candidate.draftEligibility}`);
			if (candidate.approvalSource) {
				lines.push(`- Approval source: ${candidate.approvalSource}`);
			}
			lines.push(
				`- Signals: coverage=${candidate.signals.patternCoverage}, section=${candidate.signals.weightedSectionCoverage}, prose=${candidate.signals.proseMentions}, list=${candidate.signals.listMentions}, faq=${candidate.signals.faqMentions}, checklist=${candidate.signals.checklistMentions}, similarity=${candidate.signals.existingGlossarySimilarity}, boilerplate=${candidate.signals.boilerplateRisk}, instructional=${candidate.signals.instructionalPhraseRisk}`,
			);
			if (candidate.evidence.nearestExistingGlossaryTerm) {
				lines.push(
					`- Nearest glossary term: ${candidate.evidence.nearestExistingGlossaryTerm.title} (${candidate.evidence.nearestExistingGlossaryTerm.similarity})`,
				);
			}
			lines.push(
				`- Supporting patterns: ${candidate.evidence.topSupportingPatterns.join(", ") || "none"}`,
			);
			lines.push(
				`- Supporting sections: ${candidate.evidence.topSupportingSections.join(", ") || "none"}`,
			);
			lines.push("");
		}
	}

	return `${lines.join("\n")}\n`;
}

async function loadMediumApprovalConfig(configPath = MEDIUM_APPROVALS_PATH) {
	try {
		const source = await fs.readFile(configPath, "utf8");
		const parsed = JSON.parse(source);
		const approvedMediumTerms = Array.isArray(parsed.approvedMediumTerms)
			? parsed.approvedMediumTerms
			: [];

		return {
			configPath,
			approvedMediumTerms,
			approvedKeys: new Set(
				approvedMediumTerms.map((value) => normalizeDraftKey(value)).filter(Boolean),
			),
		};
	} catch (error) {
		if (error && typeof error === "object" && error.code === "ENOENT") {
			return {
				configPath,
				approvedMediumTerms: [],
				approvedKeys: new Set(),
			};
		}

		throw error;
	}
}

function getDraftEligibility(candidate, approvalConfig) {
	const normalizedProposedTerm = normalizeDraftKey(candidate.proposedTerm);
	const normalizedPhrase = normalizeDraftKey(candidate.phrase);

	if (candidate.tier === "high") {
		return {
			normalizedProposedTerm,
			normalizedPhrase,
			draftEligibility: "auto",
			approvalSource: null,
		};
	}

	if (candidate.tier === "medium") {
		if (approvalConfig.approvedKeys.has(normalizedProposedTerm)) {
			return {
				normalizedProposedTerm,
				normalizedPhrase,
				draftEligibility: "approved-medium",
				approvalSource: "normalizedProposedTerm",
			};
		}

		if (approvalConfig.approvedKeys.has(normalizedPhrase)) {
			return {
				normalizedProposedTerm,
				normalizedPhrase,
				draftEligibility: "approved-medium",
				approvalSource: "normalizedPhrase",
			};
		}

		return {
			normalizedProposedTerm,
			normalizedPhrase,
			draftEligibility: "blocked-medium",
			approvalSource: null,
		};
	}

	return {
		normalizedProposedTerm,
		normalizedPhrase,
		draftEligibility: "blocked-low",
		approvalSource: null,
	};
}

async function loadFreshRelevanceGate({
	auditReportPath = AUDIT_REPORT_PATH,
	relevanceReportPath = RELEVANCE_REPORT_JSON_PATH,
	approvalConfigPath = MEDIUM_APPROVALS_PATH,
}) {
	let auditStat;
	let relevanceStat;

	try {
		[auditStat, relevanceStat] = await Promise.all([
			fs.stat(auditReportPath),
			fs.stat(relevanceReportPath),
		]);
	} catch (error) {
		if (error && typeof error === "object" && error.code === "ENOENT") {
			throw new Error(
				"Missing glossary audit or relevance report. Run `pnpm --filter web glossary:audit` and `pnpm --filter web glossary:relevance` before `glossary:sync`.",
			);
		}
		throw error;
	}

	if (relevanceStat.mtimeMs < auditStat.mtimeMs) {
		throw new Error(
			"Glossary relevance report is older than the audit report. Run `pnpm --filter web glossary:relevance` again before `glossary:sync`.",
		);
	}

	const [relevanceSource, approvalConfig] = await Promise.all([
		fs.readFile(relevanceReportPath, "utf8"),
		loadMediumApprovalConfig(approvalConfigPath),
	]);
	const relevanceReport = JSON.parse(relevanceSource);
	const candidates = Array.isArray(relevanceReport.candidates)
		? relevanceReport.candidates
		: [];
	const candidateMap = new Map();

	for (const candidate of candidates) {
		const eligibility = getDraftEligibility(candidate, approvalConfig);
		const annotatedCandidate = {
			...candidate,
			...eligibility,
		};
		if (eligibility.normalizedProposedTerm) {
			candidateMap.set(
				`term:${eligibility.normalizedProposedTerm}`,
				annotatedCandidate,
			);
		}
		if (eligibility.normalizedPhrase) {
			candidateMap.set(
				`phrase:${eligibility.normalizedPhrase}`,
				annotatedCandidate,
			);
		}
	}

	return {
		relevanceReportPath,
		auditReportPath,
		approvalConfigPath,
		approvalConfig,
		candidateMap,
	};
}

function annotateDraftFindingWithRelevance(finding, relevanceGate) {
	const normalizedProposedTerm = normalizeDraftKey(finding.proposedTerm);
	const normalizedPhrase = normalizeDraftKey(finding.phrase);
	const matchedCandidate =
		relevanceGate.candidateMap.get(`term:${normalizedProposedTerm}`) ??
		relevanceGate.candidateMap.get(`phrase:${normalizedPhrase}`) ??
		null;

	if (!matchedCandidate) {
		return {
			...finding,
			normalizedProposedTerm,
			normalizedPhrase,
			draftEligibility: "blocked-medium",
			approvalSource: null,
			relevanceTier: null,
			relevanceScore: null,
		};
	}

	return {
		...finding,
		normalizedProposedTerm,
		normalizedPhrase,
		draftEligibility: matchedCandidate.draftEligibility,
		approvalSource: matchedCandidate.approvalSource,
		relevanceTier: matchedCandidate.tier,
		relevanceScore: matchedCandidate.relevanceScore,
	};
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

async function writeRelevanceReport(outputRoot, report) {
	await fs.mkdir(outputRoot, { recursive: true });
	await fs.writeFile(
		path.join(outputRoot, path.basename(RELEVANCE_REPORT_JSON_PATH)),
		`${JSON.stringify(report, null, 2)}\n`,
		"utf8",
	);
	await fs.writeFile(
		path.join(outputRoot, path.basename(RELEVANCE_REPORT_MD_PATH)),
		renderRelevanceMarkdownReport(report),
		"utf8",
	);
}

export async function runGlossaryRelevanceReport({
	reportPath = AUDIT_REPORT_PATH,
	patternsRoot = PATTERNS_ROOT,
	glossaryRoot = GLOSSARY_ROOT,
	outputRoot = OUTPUT_ROOT,
	approvalConfigPath = MEDIUM_APPROVALS_PATH,
} = {}) {
	const [auditReportSource, glossaryEntries, patternDocs] = await Promise.all([
		fs.readFile(reportPath, "utf8"),
		loadGlossaryEntries(glossaryRoot),
		loadPatternDocs(patternsRoot),
	]);
	const approvalConfig = await loadMediumApprovalConfig(approvalConfigPath);
	const auditReport = JSON.parse(auditReportSource);
	const candidates = auditReport.findings
		.filter((finding) => finding.action === "create-glossary-draft")
		.map((finding) => ({
			phrase: finding.phrase,
			proposedTerm: finding.proposedTerm,
			sourcePatterns: finding.sourcePatterns ?? [],
		}));

	const scoredCandidates = [];
	for (const candidate of candidates) {
		const evidence = await extractCandidatePhraseEvidence(patternDocs, candidate);
		const scoredCandidate = scoreGlossaryCandidateRelevance(
			candidate,
			evidence,
			glossaryEntries,
		);
		scoredCandidates.push({
			...scoredCandidate,
			...getDraftEligibility(scoredCandidate, approvalConfig),
		});
	}

	scoredCandidates.sort((left, right) => right.relevanceScore - left.relevanceScore);

	const report = {
		summary: {
			candidates: scoredCandidates.length,
			high: scoredCandidates.filter((candidate) => candidate.tier === "high").length,
			medium: scoredCandidates.filter((candidate) => candidate.tier === "medium").length,
			low: scoredCandidates.filter((candidate) => candidate.tier === "low").length,
			autoEligible: scoredCandidates.filter(
				(candidate) => candidate.draftEligibility === "auto",
			).length,
			approvedMedium: scoredCandidates.filter(
				(candidate) => candidate.draftEligibility === "approved-medium",
			).length,
			blockedMedium: scoredCandidates.filter(
				(candidate) => candidate.draftEligibility === "blocked-medium",
			).length,
			blockedLow: scoredCandidates.filter(
				(candidate) => candidate.draftEligibility === "blocked-low",
			).length,
		},
		candidates: scoredCandidates,
	};

	await writeRelevanceReport(outputRoot, report);

	return {
		...report,
		outputRoot,
	};
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
			if (
				finding.draftEligibility !== "auto" &&
				finding.draftEligibility !== "approved-medium"
			) {
				continue;
			}

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
	auditReportPath = AUDIT_REPORT_PATH,
	relevanceReportPath = RELEVANCE_REPORT_JSON_PATH,
	approvalConfigPath = MEDIUM_APPROVALS_PATH,
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

	let finalFindings = dedupeFindings(findings);
	if (
		mode === "sync" &&
		finalFindings.some((finding) => finding.action === "create-glossary-draft")
	) {
		const relevanceGate = await loadFreshRelevanceGate({
			auditReportPath,
			relevanceReportPath,
			approvalConfigPath,
		});
		finalFindings = finalFindings.map((finding) =>
			finding.action === "create-glossary-draft"
				? annotateDraftFindingWithRelevance(finding, relevanceGate)
				: finding,
		);
	}
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
