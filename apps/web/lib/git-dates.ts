import { execSync } from "child_process";
import path from "path";

interface GitDates {
	created: string | null;
	updated: string | null;
	isMajorUpdate: boolean;
	linesChanged: number;
}

/**
 * Get git dates for a file
 * @param filePath Relative path from project root
 */
export function getGitDates(filePath: string): GitDates {
	try {
		// Get absolute path
		const absolutePath = path.join(process.cwd(), filePath);

		// Get creation date (first commit that added the file)
		let created: string | null = null;
		try {
			const createdResult = execSync(
				`git log --follow --format=%aI --reverse -- "${absolutePath}" | head -1`,
				{ encoding: "utf-8" },
			).trim();
			created = createdResult || null;
		} catch {
			// File might be new/untracked
			created = null;
		}

		// Get last modification date
		let updated: string | null = null;
		try {
			const updatedResult = execSync(
				`git log -1 --format=%aI -- "${absolutePath}"`,
				{ encoding: "utf-8" },
			).trim();
			updated = updatedResult || null;
		} catch {
			// File might be new/untracked
			updated = null;
		}

		// Check lines changed in last commit
		let linesChanged = 0;
		let isMajorUpdate = false;
		try {
			const diffStat = execSync(
				`git diff HEAD~1 HEAD --numstat -- "${absolutePath}" 2>/dev/null || echo "0 0"`,
				{ encoding: "utf-8" },
			).trim();

			if (diffStat && diffStat !== "0 0") {
				const [additions, deletions] = diffStat.split("\t").map(Number);
				linesChanged = (additions || 0) + (deletions || 0);

				// Consider it a major update if more than 50 lines changed
				// or if it's a new file (created recently)
				isMajorUpdate = linesChanged > 50;

				// Also check if this is a significant percentage change
				try {
					const totalLines = parseInt(
						execSync(`wc -l < "${absolutePath}"`, { encoding: "utf-8" }).trim(),
						10,
					);
					// Major update if more than 30% of the file changed
					if (totalLines > 0 && linesChanged / totalLines > 0.3) {
						isMajorUpdate = true;
					}
				} catch {
					// Ignore errors in line counting
				}
			}
		} catch {
			// No previous commit to compare with
		}

		return {
			created,
			updated,
			isMajorUpdate,
			linesChanged,
		};
	} catch (error) {
		console.error(`Error getting git dates for ${filePath}:`, error);
		return {
			created: null,
			updated: null,
			isMajorUpdate: false,
			linesChanged: 0,
		};
	}
}

/**
 * Check if a date is within N days of today
 */
export function isWithinDays(date: string | null, days: number): boolean {
	if (!date) return false;
	const then = new Date(date);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - then.getTime());
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	return diffDays <= days;
}
