#!/usr/bin/env tsx

import { validateEntryPatterns } from "../lib/pattern-utils";

async function main() {
	console.log("🔍 Validating entry patterns against web app patterns...\n");

	const validation = await validateEntryPatterns();

	console.log("✅ Valid entry folders (match web app patterns):");
	if (validation.valid.length > 0) {
		validation.valid.forEach((folder) => {
			console.log(`  - ${folder}`);
		});
	} else {
		console.log("  (none)");
	}

	console.log("\n❌ Invalid entry folders (don't match any web app pattern):");
	if (validation.invalid.length > 0) {
		validation.invalid.forEach((folder) => {
			console.log(`  - ${folder}`);
		});
		console.log(
			"\n💡 These folders should be removed or renamed to match a pattern in apps/web",
		);
	} else {
		console.log("  (none)");
	}

	console.log("\n📝 Web app patterns without entry folders:");
	if (validation.missing.length > 0) {
		validation.missing.forEach((pattern) => {
			console.log(`  - ${pattern}`);
		});
		console.log("\n💡 Consider creating entry folders for these patterns");
	} else {
		console.log("  (none)");
	}

	console.log("\n📊 Summary:");
	console.log(`  Valid: ${validation.valid.length}`);
	console.log(`  Invalid: ${validation.invalid.length}`);
	console.log(`  Missing: ${validation.missing.length}`);

	if (validation.invalid.length > 0) {
		console.log("\n⚠️  Action required: Fix invalid entry folders");
		process.exit(1);
	} else {
		console.log("\n✅ All entry folders are valid!");
	}
}

main().catch(console.error);
