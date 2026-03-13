#!/usr/bin/env node

import { syncPatternResourceFiles } from "./pattern-resources-lib.mjs";

async function main() {
	const { files, changed } = await syncPatternResourceFiles();

	console.log(
		`Synchronized resources for ${files.length} pattern docs (${changed} updated).`,
	);
}

main().catch((error) => {
	console.error("Pattern resource synchronization failed.");
	console.error(error);
	process.exit(1);
});
