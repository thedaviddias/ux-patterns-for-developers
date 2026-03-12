#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all pattern MDX files
function getPatternFiles() {
	const patternsDir = path.join(__dirname, "../content/patterns");
	const files = [];

	function walkDir(dir, relativePath = "") {
		const entries = fs.readdirSync(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			const relPath = path.join(relativePath, entry.name);

			if (entry.isDirectory()) {
				walkDir(fullPath, relPath);
			} else if (entry.name.endsWith(".mdx")) {
				files.push({
					absolute: fullPath,
					relative: `content/patterns/${relPath}`,
					slug: relPath.replace(/\.mdx$/, ""),
				});
			}
		}
	}

	if (fs.existsSync(patternsDir)) {
		walkDir(patternsDir);
	}

	return files;
}

// Get git dates for a file
function getGitDates(filePath) {
	try {
		// Get creation date (first commit)
		let created = null;
		try {
			const createdResult = execSync(
				`git log --follow --format=%aI --reverse -- "${filePath}" | head -1`,
				{ encoding: "utf-8", cwd: path.join(__dirname, "..") },
			).trim();
			created = createdResult || null;
		} catch {
			created = null;
		}

		// Get last modification date
		let updated = null;
		try {
			const updatedResult = execSync(
				`git log -1 --format=%aI -- "${filePath}"`,
				{ encoding: "utf-8", cwd: path.join(__dirname, "..") },
			).trim();
			updated = updatedResult || null;
		} catch {
			updated = null;
		}

		// Check if this was a major update
		let isMajorUpdate = false;
		let linesChanged = 0;

		try {
			// Get the diff stats for the last commit that touched this file
			const diffStat = execSync(
				`git diff HEAD~1 HEAD --numstat -- "${filePath}" 2>/dev/null || echo "0 0"`,
				{ encoding: "utf-8", cwd: path.join(__dirname, "..") },
			).trim();

			if (diffStat && diffStat !== "0 0" && diffStat !== "") {
				const parts = diffStat.split("\t");
				const additions = parseInt(parts[0]) || 0;
				const deletions = parseInt(parts[1]) || 0;
				linesChanged = additions + deletions;

				// Major update if more than 50 lines changed
				isMajorUpdate = linesChanged > 50;

				// Also check percentage of file changed
				try {
					const fileContent = fs.readFileSync(filePath, "utf-8");
					const totalLines = fileContent.split("\n").length;
					if (totalLines > 0 && linesChanged / totalLines > 0.3) {
						isMajorUpdate = true;
					}
				} catch {
					// Ignore
				}
			}
		} catch {
			// No previous commit to compare
		}

		return {
			created,
			updated,
			isMajorUpdate,
			linesChanged,
		};
	} catch (error) {
		console.error(`Error getting git dates for ${filePath}:`, error.message);
		return {
			created: null,
			updated: null,
			isMajorUpdate: false,
			linesChanged: 0,
		};
	}
}

// Main function
function generatePatternDates() {
	console.log("📅 Generating pattern dates from git history...");

	const patterns = getPatternFiles();
	const patternDates = {};

	for (const pattern of patterns) {
		const dates = getGitDates(pattern.absolute);
		patternDates[pattern.slug] = {
			...dates,
			path: pattern.relative,
		};

		// Log progress
		if (dates.created || dates.updated) {
			const badge = dates.isMajorUpdate
				? "🔄"
				: dates.created &&
						new Date(dates.created) >
							new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
					? "🆕"
					: "";
			console.log(`  ${badge} ${pattern.slug}`);
		}
	}

	// Write to JSON file
	const outputPath = path.join(__dirname, "../.next/pattern-dates.json");
	const outputDir = path.dirname(outputPath);

	// Create .next directory if it doesn't exist
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	fs.writeFileSync(outputPath, JSON.stringify(patternDates, null, 2));

	console.log(`✅ Generated pattern dates for ${patterns.length} files`);
	console.log(`📁 Saved to ${outputPath}`);
}

// Run the script
generatePatternDates();
