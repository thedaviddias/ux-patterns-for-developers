#!/usr/bin/env node

/**
 * Derives per-file created/modified dates from git history and writes them to
 * `.content-dates.json`, which `velite.config.ts` folds into every content
 * record as `datePublished` / `dateModified`.
 *
 * Those dates are what the site hands to Google: Article JSON-LD, sitemap
 * `lastmod`, and the visible "Last updated" line all read from them.
 *
 * Deliberately one `git log` pass for the whole tree rather than two commands
 * per file. It is ~1000x faster (0.1s vs ~260 subprocesses), and — because it
 * avoids `--follow` and `--numstat`, which need blob contents — it stays cheap
 * under the `filter: blob:none` partial clone that CI uses.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.join(__dirname, "..");
const REPO_ROOT = path.join(APP_DIR, "..", "..");
const CONTENT_DIR = path.join(APP_DIR, "content");
const CONTENT_PREFIX = "apps/web/content/";
const OUTPUT = path.join(APP_DIR, ".content-dates.json");

/**
 * Commits whose subject matches are assumed not to have changed what a reader
 * sees, so they don't advance the public "last updated" date. Heuristic by
 * nature: it reliably catches conventional-commit chores and won't catch an
 * untagged typo fix. Callers fall back to the raw date, so a miss is harmless.
 */
const TRIVIAL_SUBJECT =
	/(^(chore|ci|style|build|revert|deps)(\(.+\))?[!:])|typo|lint|format|prettier|biome/i;

/** Every .mdx currently on disk, keyed the way velite computes `slug`. */
function listContentFiles() {
	const slugs = new Map();

	function walk(dir) {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(full);
			} else if (entry.name.endsWith(".mdx") && !entry.name.startsWith("_")) {
				const rel = path.relative(CONTENT_DIR, full).split(path.sep).join("/");
				// Mirrors velite.config.ts: strip .mdx, then a trailing /index.
				const slug = rel.replace(/\.mdx$/, "").replace(/\/index$/, "");
				slugs.set(`${CONTENT_PREFIX}${rel}`, slug);
			}
		}
	}

	if (fs.existsSync(CONTENT_DIR)) walk(CONTENT_DIR);
	return slugs;
}

/**
 * Walks `git log --name-status` output newest-first, recording for each path
 * the newest commit that touched it, the newest non-trivial one, and the add
 * that began its current life (re-added files ignore anything older than the
 * delete that ended the previous one).
 *
 * Pure and exported so the ordering rules can be tested without a git fixture.
 *
 * @param {string} log Output of `git log --format=C%aI%x09%s --name-status`
 * @param {Set<string>|Map<string, unknown>} knownPaths Repo-relative paths to keep
 */
export function parseGitLog(log, knownPaths) {
	const dates = new Map();
	const deleted = new Set();
	let date = null;
	let trivial = false;

	for (const line of log.split("\n")) {
		if (line.startsWith("C")) {
			const tab = line.indexOf("\t");
			const raw = line.slice(1, tab === -1 ? undefined : tab);
			// Normalise to UTC. git emits a committer-local offset
			// (2026-03-13T21:15:34-04:00), but the site renders "Last updated"
			// with timeZone: "UTC". Left as-is, the visible date and the JSON-LD
			// dateModified disagree by a day for any evening commit -- exactly
			// the inconsistency Google's date guidance warns about.
			const parsed = new Date(raw);
			date = Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
			trivial = tab === -1 ? false : TRIVIAL_SUBJECT.test(line.slice(tab + 1));
			continue;
		}

		const tab = line.indexOf("\t");
		if (tab === -1 || !date) continue;

		const status = line.slice(0, tab);
		const file = line.slice(tab + 1);
		if (!knownPaths.has(file)) continue;

		if (status === "D") {
			deleted.add(file);
			continue;
		}
		if (status !== "A" && status !== "M") continue;

		let record = dates.get(file);
		if (!record) {
			record = { created: null, updated: null, updatedSignificant: null };
			dates.set(file, record);
		}

		// Newest-first, so the first value we see is the newest.
		record.updated ??= date;
		if (!trivial) record.updatedSignificant ??= date;
		// Keep walking back to the oldest add, unless a delete cut the history.
		if (status === "A" && !deleted.has(file)) record.created = date;
	}

	return dates;
}

/**
 * A shallow clone does not just lose old dates -- git reports its single
 * commit as *adding* every file, so all 129 files silently collapse onto one
 * identical timestamp. That is the exact uniform-date anti-pattern this script
 * exists to eliminate, so detect it directly rather than inferring it.
 */
function isShallowRepository() {
	try {
		return (
			execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
				cwd: REPO_ROOT,
				encoding: "utf-8",
			}).trim() === "true"
		);
	} catch {
		return false;
	}
}

/** Runs one git pass over the content tree and parses it. */
function collectGitDates(pathsToSlugs) {
	const log = execFileSync(
		"git",
		[
			"log",
			"--format=C%aI%x09%s",
			"--name-status",
			"--no-renames",
			"--diff-filter=AMD",
			"--",
			CONTENT_PREFIX,
		],
		{ cwd: REPO_ROOT, encoding: "utf-8", maxBuffer: 64 * 1024 * 1024 },
	);
	return parseGitLog(log, pathsToSlugs);
}

function main() {
	const pathsToSlugs = listContentFiles();
	const gitDates = collectGitDates(pathsToSlugs);

	const manifest = {};
	let missing = 0;

	for (const [file, slug] of pathsToSlugs) {
		const record = gitDates.get(file) ?? {};
		if (!record.updated) missing++;
		manifest[slug] = {
			created: record.created ?? null,
			updated: record.updated ?? null,
			updatedSignificant: record.updatedSignificant ?? record.updated ?? null,
			path: file,
		};
	}

	const total = pathsToSlugs.size;
	fs.writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);
	console.log(
		`📅 Content dates: ${total - missing}/${total} resolved → ${path.relative(APP_DIR, OUTPUT)}`,
	);

	// Guard rails. Without them the failure mode is silent -- the site quietly
	// ships uniform or absent dates and nobody notices for months, which is
	// exactly how the previous version of this script died.
	const distinct = new Set(
		Object.values(manifest)
			.map((entry) => entry.updated)
			.filter(Boolean),
	).size;

	const problem = isShallowRepository()
		? "the git repository is shallow, so every file reports the same commit"
		: missing > total * 0.2
			? `${missing}/${total} content files have no git date`
			: total > 1 && distinct === 1
				? `all ${total} files share one timestamp, which is not real history`
				: null;

	if (problem) {
		console.error(
			`\n❌ Content dates are not trustworthy: ${problem}.\n` +
				"   CI must check out with `fetch-depth: 0` (see\n" +
				"   .github/workflows/routed-ci.yml). Shipping these dates would put\n" +
				"   one identical lastmod on every URL, which search engines discount.\n",
		);
		if (process.env.CI) process.exit(1);
	}
}

// Only run when invoked directly; importing this file (tests) must not build.
if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	main();
}
