import assert from "node:assert/strict";
import { test } from "node:test";
import { parseGitLog } from "./generate-content-dates.mjs";

const FILE = "apps/web/content/patterns/navigation/pagination.mdx";
const OTHER = "apps/web/content/glossary/a/aria.mdx";
const known = new Set([FILE, OTHER]);

/** git log is newest-first; `C` lines are commits, then tab-separated statuses. */
const log = (...commits) => commits.join("\n");
const commit = (iso, subject, ...changes) =>
	[`C${iso}\t${subject}`, "", ...changes].join("\n");

test("takes the newest commit that touched the file", () => {
	const dates = parseGitLog(
		log(
			commit(
				"2026-03-14T01:15:34.000Z",
				"feat: rework pagination",
				`M\t${FILE}`,
			),
			commit("2025-09-04T13:21:59.000Z", "feat: add pagination", `A\t${FILE}`),
		),
		known,
	);
	assert.equal(dates.get(FILE).updated, "2026-03-14T01:15:34.000Z");
	assert.equal(dates.get(FILE).created, "2025-09-04T13:21:59.000Z");
});

test("skips trivial commits when picking updatedSignificant", () => {
	const dates = parseGitLog(
		log(
			commit(
				"2026-06-01T00:00:00.000Z",
				"chore: reformat with biome",
				`M\t${FILE}`,
			),
			commit(
				"2026-03-14T01:15:34.000Z",
				"feat: rework pagination",
				`M\t${FILE}`,
			),
			commit("2025-09-04T13:21:59.000Z", "feat: add pagination", `A\t${FILE}`),
		),
		known,
	);
	// `updated` still reflects reality; only the public-facing date ignores chores.
	assert.equal(dates.get(FILE).updated, "2026-06-01T00:00:00.000Z");
	assert.equal(dates.get(FILE).updatedSignificant, "2026-03-14T01:15:34.000Z");
});

test("a delete cuts off the previous life, so created is the re-add", () => {
	const dates = parseGitLog(
		log(
			commit(
				"2026-05-01T00:00:00.000Z",
				"feat: restore pagination",
				`A\t${FILE}`,
			),
			commit("2026-04-01T00:00:00.000Z", "feat: drop pagination", `D\t${FILE}`),
			commit("2025-09-04T13:21:59.000Z", "feat: add pagination", `A\t${FILE}`),
		),
		known,
	);
	assert.equal(dates.get(FILE).created, "2026-05-01T00:00:00.000Z");
});

test("ignores paths outside the known set", () => {
	const dates = parseGitLog(
		log(
			commit("2026-03-14T01:15:34.000Z", "chore: deps", "M\tpackage.json"),
			commit("2025-09-04T13:21:59.000Z", "feat: add pagination", `A\t${FILE}`),
		),
		known,
	);
	assert.deepEqual([...dates.keys()], [FILE]);
});

test("tracks each file independently within one commit", () => {
	const dates = parseGitLog(
		log(
			commit(
				"2026-03-14T01:15:34.000Z",
				"feat: bulk refresh",
				`M\t${FILE}`,
				`A\t${OTHER}`,
			),
			commit("2025-09-04T13:21:59.000Z", "feat: add pagination", `A\t${FILE}`),
		),
		known,
	);
	assert.equal(dates.get(FILE).created, "2025-09-04T13:21:59.000Z");
	assert.equal(dates.get(OTHER).created, "2026-03-14T01:15:34.000Z");
});

test("a merge commit with no file changes does not leak into the next commit", () => {
	const dates = parseGitLog(
		log(
			commit("2026-07-01T00:00:00.000Z", "Merge pull request #12"),
			commit(
				"2026-03-14T01:15:34.000Z",
				"feat: rework pagination",
				`M\t${FILE}`,
			),
		),
		known,
	);
	assert.equal(dates.get(FILE).updated, "2026-03-14T01:15:34.000Z");
});
