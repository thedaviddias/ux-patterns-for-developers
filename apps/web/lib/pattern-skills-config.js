import fs from "node:fs";
import path from "node:path";

export * from "./pattern-skills-shared.js";

export function findRepoRoot(startDir = process.cwd()) {
	let current = path.resolve(startDir);

	while (true) {
		if (fs.existsSync(path.join(current, "pnpm-workspace.yaml"))) {
			return current;
		}

		const parent = path.dirname(current);
		if (parent === current) {
			throw new Error(`Unable to locate repo root from ${startDir}`);
		}

		current = parent;
	}
}

export function getSkillsDir(startDir = process.cwd()) {
	return path.join(findRepoRoot(startDir), "skills");
}

export function getPatternSkillsManifestPath(startDir = process.cwd()) {
	return path.join(
		findRepoRoot(startDir),
		"apps/web/.generated/pattern-skills.json",
	);
}
