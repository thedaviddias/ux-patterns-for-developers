#!/usr/bin/env node

import { validatePatternResourceFiles } from "./pattern-resources-lib.mjs";

async function main() {
	const result = await validatePatternResourceFiles();

	if (result.failures.length > 0) {
		for (const failure of result.failures) {
			console.error(`${failure.relativeFile}: ${failure.message}`);
		}
		process.exit(1);
	}

	console.log(
		`Validated resources for ${result.filesChecked} published pattern docs.`,
	);
}

main().catch((error) => {
	console.error("Pattern resource validation failed.");
	console.error(error);
	process.exit(1);
});
