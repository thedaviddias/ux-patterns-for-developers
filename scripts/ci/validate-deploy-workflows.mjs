#!/usr/bin/env node

/**
 * Asserts that every workflow which deploys checks out the full git history.
 *
 * apps/web/scripts/generate-content-dates.mjs derives each content file's
 * dateModified from `git log`. At the default checkout depth of 1, git reports
 * the single commit as *adding* every file, so all 129 content files collapse
 * onto one identical timestamp. The generator refuses to ship that, so a
 * shallow checkout turns into a failed deploy.
 *
 * This exists because the two routed-ci workflows are gated on a repo variable
 * (`BUILD_PROVIDER`), and the inactive one gives no signal that it is inactive.
 * A fix applied to the wrong file looks completely correct in review.
 *
 * Deliberately dependency-free (no YAML parser in this workspace) and written
 * to FAIL when it cannot find what it expects. A checker that silently matches
 * nothing is worse than no checker at all.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
	"..",
);
const WORKFLOW_DIRS = [".github/workflows", ".gitea/workflows"];

/** A step deploys if it shells out to the deploy script. */
const DEPLOY_MARKER = /deploy-vercel\.sh/;
const CHECKOUT_MARKER = /^\s*uses:\s*actions\/checkout(@|\s|$)/;

/**
 * Extracts each `uses: actions/checkout` step's `with:` block by indentation,
 * and reports whether it requests full history.
 *
 * @param {string} text raw workflow YAML
 * @returns {{ deploys: boolean, checkouts: Array<{line: number, fullHistory: boolean}> }}
 */
export function auditWorkflow(text) {
	const lines = text.split("\n");
	const checkouts = [];

	for (let i = 0; i < lines.length; i++) {
		if (!CHECKOUT_MARKER.test(lines[i])) continue;

		const indent = lines[i].search(/\S/);
		let fullHistory = false;

		// Walk forward while still inside this step: a line that starts a new
		// list item ("- ") at or below this indent ends the step.
		for (let j = i + 1; j < lines.length; j++) {
			const line = lines[j];
			if (!line.trim() || line.trim().startsWith("#")) continue;
			const lineIndent = line.search(/\S/);
			const startsNewStep =
				line.trim().startsWith("- ") && lineIndent <= indent;
			if (lineIndent < indent || startsNewStep) break;
			if (/^\s*fetch-depth:\s*0\s*$/.test(line)) {
				fullHistory = true;
				break;
			}
		}

		checkouts.push({ line: i + 1, fullHistory });
	}

	return { deploys: DEPLOY_MARKER.test(text), checkouts };
}

function listWorkflows() {
	const files = [];
	for (const dir of WORKFLOW_DIRS) {
		const abs = path.join(REPO_ROOT, dir);
		if (!fs.existsSync(abs)) continue;
		for (const name of fs.readdirSync(abs)) {
			if (/\.ya?ml$/.test(name)) files.push(path.join(dir, name));
		}
	}
	return files;
}

function main() {
	const workflows = listWorkflows();
	const problems = [];

	if (workflows.length === 0) {
		console.error(
			"❌ Found no workflow files at all. Expected at least the routed-ci pair.",
		);
		process.exit(1);
	}

	let deployWorkflows = 0;

	for (const rel of workflows) {
		const { deploys, checkouts } = auditWorkflow(
			fs.readFileSync(path.join(REPO_ROOT, rel), "utf-8"),
		);
		if (!deploys) continue;
		deployWorkflows++;

		if (checkouts.length === 0) {
			problems.push(`${rel}: deploys but has no actions/checkout step`);
			continue;
		}
		for (const c of checkouts) {
			if (!c.fullHistory) {
				problems.push(
					`${rel}:${c.line} checkout is missing \`fetch-depth: 0\``,
				);
			}
		}
	}

	// Both routed-ci workflows deploy. If we suddenly see none, this checker has
	// stopped matching reality rather than found a clean repo.
	if (deployWorkflows === 0) {
		console.error(
			`❌ Scanned ${workflows.length} workflow(s) and found none that run deploy-vercel.sh.\n` +
				"   The deploy path moved; update DEPLOY_MARKER in this script.",
		);
		process.exit(1);
	}

	if (problems.length > 0) {
		console.error(
			`\n❌ Deploy workflows must check out full git history:\n${problems.map((p) => `   - ${p}`).join("\n")}\n\n` +
				"   Content dates come from `git log`; a depth-1 checkout makes every\n" +
				"   page report the same date and fails the build. Note there are two\n" +
				"   routed-ci workflows (.github and .gitea) gated on BUILD_PROVIDER --\n" +
				"   fix both, not just the one that looks active.\n",
		);
		process.exit(1);
	}

	console.log(
		`✅ ${deployWorkflows} deploy workflow(s) check out full history`,
	);
}

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	main();
}
