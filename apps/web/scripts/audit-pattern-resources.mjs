#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import {
	PATTERNS_ROOT,
	WEB_ROOT,
	extractNpmPackageNames,
	getPublishedPatternFiles,
	writeExternalResourcesTempFile,
} from "./pattern-resources-lib.mjs";

const execFile = promisify(execFileCallback);
const AUDIT_NOW = new Date("2026-03-13T00:00:00.000Z");
const PACKAGE_FRESHNESS_CUTOFF = new Date(AUDIT_NOW);
PACKAGE_FRESHNESS_CUTOFF.setUTCMonth(PACKAGE_FRESHNESS_CUTOFF.getUTCMonth() - 36);

async function auditPackages() {
	const files = await getPublishedPatternFiles();
	const packages = new Set();

	for (const relativeFile of files) {
		const fullPath = path.join(PATTERNS_ROOT, relativeFile);
		const source = await fs.readFile(fullPath, "utf8");

		for (const packageName of extractNpmPackageNames(source)) {
			packages.add(packageName);
		}
	}

	const failures = [];

	for (const packageName of [...packages].sort()) {
		const { stdout } = await execFile(
			"pnpm",
			[
				"view",
				packageName,
				"deprecated",
				"time.modified",
				"repository.url",
				"--json",
			],
			{ cwd: WEB_ROOT, maxBuffer: 1024 * 1024 },
		);
		const payload = JSON.parse(stdout || "{}");
		const deprecated = payload.deprecated;
		const modified = payload["time.modified"];

		if (deprecated) {
			failures.push(`${packageName} is deprecated: ${deprecated}`);
			continue;
		}

		if (!modified) {
			failures.push(`${packageName} does not expose \`time.modified\` metadata.`);
			continue;
		}

		if (new Date(modified) < PACKAGE_FRESHNESS_CUTOFF) {
			failures.push(
				`${packageName} was last modified on ${modified}, older than the ${PACKAGE_FRESHNESS_CUTOFF.toISOString().slice(0, 10)} freshness cutoff.`,
			);
		}
	}

	return { packageCount: packages.size, failures };
}

async function main() {
	const { tempFile, urls } = await writeExternalResourcesTempFile();

	try {
		await execFile(
			"lychee",
			[
				"--accept",
				"200,403,429",
				"--scheme",
				"https",
				"--timeout",
				"20",
				"--max-concurrency",
				"14",
				tempFile,
			],
			{
				cwd: WEB_ROOT,
			maxBuffer: 1024 * 1024 * 16,
			},
		);
	} catch (error) {
		if (error.stdout) {
			process.stdout.write(error.stdout);
		}
		if (error.stderr) {
			process.stderr.write(error.stderr);
		}
		throw new Error("External resource link audit failed.");
	} finally {
		await fs.rm(tempFile, { force: true });
	}

	const packageAudit = await auditPackages();

	if (packageAudit.failures.length > 0) {
		for (const failure of packageAudit.failures) {
			console.error(failure);
		}
		process.exit(1);
	}

	console.log(
		`Audited ${urls.length} external resource URLs and ${packageAudit.packageCount} npm packages.`,
	);
}

main().catch((error) => {
	console.error("Pattern resource audit failed.");
	console.error(error);
	process.exit(1);
});
