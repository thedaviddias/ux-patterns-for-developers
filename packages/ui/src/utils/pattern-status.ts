interface PatternMetadata {
	createdAt?: string;
	updatedAt?: string;
	status?: "draft" | "published" | "complete";
	wordCount?: number;
	hideFromNav?: boolean;
	publishedAt?: string;
	lastMajorUpdate?: string;
	gitCreatedAt?: string;
	gitUpdatedAt?: string;
	isMajorUpdate?: boolean;
}

interface PatternStatusConfig {
	stubThreshold: number;
	newDurationDays: number;
	updatedDurationDays: number;
}

const DEFAULT_CONFIG: PatternStatusConfig = {
	stubThreshold: 100,
	newDurationDays: 30,
	updatedDurationDays: 14,
};

/**
 * Calculate word count from MDX content
 */
export function calculateWordCount(content: string): number {
	// Remove MDX/JSX components and frontmatter
	const cleanContent = content
		.replace(/^---[\s\S]*?---/m, "") // Remove frontmatter
		.replace(/<[^>]*>/g, "") // Remove HTML/JSX tags
		.replace(/```[\s\S]*?```/g, "") // Remove code blocks
		.replace(/`[^`]*`/g, "") // Remove inline code
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // Extract link text
		.replace(/[#*_~]/g, "") // Remove markdown formatting
		.trim();

	// Count words
	const words = cleanContent.match(/\b\w+\b/g);
	return words ? words.length : 0;
}

/**
 * Determine if pattern should be shown in navigation
 */
export function shouldShowInNav(
	metadata: PatternMetadata,
	content?: string,
	config = DEFAULT_CONFIG,
): boolean {
	// Manual override
	if (metadata.hideFromNav === true) return false;
	if (metadata.hideFromNav === false) return true;

	// Status-based - handle actual status values used in the codebase
	if (metadata.status === "draft") return false; // Hide drafts from navigation
	if (metadata.status === "published" || metadata.status === "complete")
		return true;

	// Word count based (fallback)
	const wordCount =
		metadata.wordCount ?? (content ? calculateWordCount(content) : 0);
	return wordCount >= config.stubThreshold;
}

/**
 * Calculate days since a date
 */
function daysSince(date: string | Date): number {
	const then = new Date(date);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - then.getTime());
	return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determine badge type for a pattern
 */
export function getBadgeType(
	metadata: PatternMetadata,
	config = DEFAULT_CONFIG,
): "new" | "updated" | null {
	// Only complete/published content can have badges
	if (metadata.status === "draft") return null;

	// Use git dates as primary source
	// New: Recently created based on git history
	if (
		metadata.gitCreatedAt &&
		daysSince(metadata.gitCreatedAt) <= config.newDurationDays
	) {
		return "new";
	}

	// Updated: Major update detected by git
	if (
		metadata.isMajorUpdate &&
		metadata.gitUpdatedAt &&
		daysSince(metadata.gitUpdatedAt) <= config.updatedDurationDays
	) {
		return "updated";
	}

	// Fallback to frontmatter dates if available
	// New: Recently published
	if (
		metadata.publishedAt &&
		daysSince(metadata.publishedAt) <= config.newDurationDays
	) {
		return "new";
	}

	// New: Recently created (fallback)
	if (
		metadata.createdAt &&
		daysSince(metadata.createdAt) <= config.newDurationDays
	) {
		return "new";
	}

	// Updated: Significant changes to already-published content
	if (
		metadata.lastMajorUpdate &&
		daysSince(metadata.lastMajorUpdate) <= config.updatedDurationDays
	) {
		return "updated";
	}

	return null;
}
