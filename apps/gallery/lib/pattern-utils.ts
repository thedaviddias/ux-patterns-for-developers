import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

export interface PatternCategory {
	title: string;
	description: string;
	icon: string;
	pages: string[];
}

export interface PatternData {
	categories: {
		title: string;
		patterns: string[];
	}[];
	screens: string[]; // Pages & Views
	uiElements: string[]; // Components
	flows: string[]; // User Flows
}

// Map pattern categories to our navigation structure
const _categoryMapping: Record<string, keyof Omit<PatternData, "categories">> =
	{
		forms: "uiElements",
		navigation: "screens",
		"content-management": "uiElements",
		"user-feedback": "uiElements",
		authentication: "flows",
		"e-commerce": "flows",
		"data-display": "screens",
		media: "uiElements",
		social: "flows",
		"ai-intelligence": "uiElements",
		advanced: "uiElements",
	};

// We'll use actual pattern names from the categories instead of hardcoded ones

export async function getPatternCategories(): Promise<PatternData> {
	// Path to web app patterns directory
	const patternsDir = join(process.cwd(), "../web/content/patterns");

	try {
		// Read main meta.json
		const mainMetaPath = join(patternsDir, "meta.json");
		const mainMetaContent = await readFile(mainMetaPath, "utf-8");
		const mainMeta: { pages: string[] } = JSON.parse(mainMetaContent);

		// Filter out separators and get actual category directories
		const categories = mainMeta.pages.filter(
			(page) =>
				!page.startsWith("---") &&
				page !== "getting-started" &&
				page !== "when-to-use-what" &&
				page !== "books",
		);

		const result: PatternData = {
			categories: [],
			screens: [],
			uiElements: [],
			flows: [],
		};

		// Collect all patterns by category
		const allPatterns: {
			category: string;
			title: string;
			patterns: string[];
		}[] = [];

		for (const category of categories) {
			try {
				const categoryMetaPath = join(patternsDir, category, "meta.json");
				const categoryMetaContent = await readFile(categoryMetaPath, "utf-8");
				const categoryMeta: PatternCategory = JSON.parse(categoryMetaContent);

				allPatterns.push({
					category,
					title: categoryMeta.title,
					patterns: categoryMeta.pages,
				});
			} catch (error) {
				console.warn(`Failed to read category ${category}:`, error);
			}
		}

		// Build categories list (exactly 5 items)
		const priorityCategories = [
			"Forms",
			"Navigation",
			"Data Display",
			"Authentication",
			"Content Management",
		];

		result.categories = allPatterns
			.sort((a, b) => {
				const aIndex = priorityCategories.indexOf(a.title);
				const bIndex = priorityCategories.indexOf(b.title);
				if (aIndex === -1 && bIndex === -1) return 0;
				if (aIndex === -1) return 1;
				if (bIndex === -1) return -1;
				return aIndex - bIndex;
			})
			.slice(0, 5)
			.map((cat) => ({ title: cat.title, patterns: cat.patterns }));

		// Build screens list (exactly 5 navigation/page patterns)
		const navigationPatterns =
			allPatterns.find((c) => c.category === "navigation")?.patterns || [];
		const dataDisplayPatterns =
			allPatterns.find((c) => c.category === "data-display")?.patterns || [];

		const screenPatterns = [
			...navigationPatterns.slice(0, 3), // Take top 3 navigation patterns
			...dataDisplayPatterns.slice(0, 2), // Take top 2 data display patterns
		].map((p) => p.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));

		result.screens = screenPatterns.slice(0, 5);

		// Build uiElements list (exactly 5 component patterns)
		const formPatterns =
			allPatterns.find((c) => c.category === "forms")?.patterns || [];
		const contentPatterns =
			allPatterns.find((c) => c.category === "content-management")?.patterns ||
			[];
		const feedbackPatterns =
			allPatterns.find((c) => c.category === "user-feedback")?.patterns || [];

		const uiPatterns = [
			...formPatterns.slice(0, 2), // Take top 2 form patterns
			...contentPatterns.slice(0, 2), // Take top 2 content patterns
			...feedbackPatterns.slice(0, 1), // Take top 1 feedback pattern
		].map((p) => p.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));

		result.uiElements = uiPatterns.slice(0, 5);

		// Build flows list (exactly 5 user flow patterns)
		const authPatterns =
			allPatterns.find((c) => c.category === "authentication")?.patterns || [];
		const ecommercePatterns =
			allPatterns.find((c) => c.category === "e-commerce")?.patterns || [];
		const socialPatterns =
			allPatterns.find((c) => c.category === "social")?.patterns || [];

		const flowPatterns = [
			...authPatterns.slice(0, 2), // Take top 2 auth patterns
			...ecommercePatterns.slice(0, 2), // Take top 2 e-commerce patterns
			...socialPatterns.slice(0, 1), // Take top 1 social pattern
		].map((p) => p.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));

		result.flows = flowPatterns.slice(0, 5);

		// Ensure exactly 5 items per column, fill with fallbacks if needed
		while (result.screens.length < 5) {
			const extraPattern = allPatterns
				.flatMap((c) => c.patterns)
				.find(
					(p) =>
						!result.screens.includes(
							p.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
						),
				);
			if (extraPattern) {
				result.screens.push(
					extraPattern
						.replace(/-/g, " ")
						.replace(/\b\w/g, (l) => l.toUpperCase()),
				);
			} else break;
		}

		while (result.uiElements.length < 5) {
			const extraPattern = allPatterns
				.flatMap((c) => c.patterns)
				.find(
					(p) =>
						!result.uiElements.includes(
							p.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
						),
				);
			if (extraPattern) {
				result.uiElements.push(
					extraPattern
						.replace(/-/g, " ")
						.replace(/\b\w/g, (l) => l.toUpperCase()),
				);
			} else break;
		}

		while (result.flows.length < 5) {
			const extraPattern = allPatterns
				.flatMap((c) => c.patterns)
				.find(
					(p) =>
						!result.flows.includes(
							p.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
						),
				);
			if (extraPattern) {
				result.flows.push(
					extraPattern
						.replace(/-/g, " ")
						.replace(/\b\w/g, (l) => l.toUpperCase()),
				);
			} else break;
		}

		return result;
	} catch (error) {
		console.warn("Failed to read pattern categories, using fallback:", error);

		// Fallback data - exactly 5 items per column
		return {
			categories: [
				{ title: "Forms", patterns: ["button", "text-field", "checkbox"] },
				{ title: "Navigation", patterns: ["breadcrumb", "pagination", "tabs"] },
				{ title: "Data Display", patterns: ["table", "card-grid", "chart"] },
				{
					title: "Authentication",
					patterns: ["login", "signup", "password-reset"],
				},
				{
					title: "Content Management",
					patterns: ["modal", "accordion", "tooltip"],
				},
			],
			screens: ["Breadcrumb", "Pagination", "Tabs", "Table", "Dashboard"],
			uiElements: [
				"Button",
				"Text Field",
				"Modal",
				"Accordion",
				"Notification",
			],
			flows: ["Login", "Signup", "Checkout", "Shopping Cart", "Share Dialog"],
		};
	}
}

export async function getPatternDescription(
	patternName: string,
): Promise<string | null> {
	// Convert pattern name to kebab-case for file lookup
	const kebabCasePattern = patternName.toLowerCase().replace(/\s+/g, "-");

	// Path to web app patterns directory
	const patternsDir = join(process.cwd(), "../web/content/patterns");

	try {
		// Read main meta.json to get all categories
		const mainMetaPath = join(patternsDir, "meta.json");
		const mainMetaContent = await readFile(mainMetaPath, "utf-8");
		const mainMeta: { pages: string[] } = JSON.parse(mainMetaContent);

		// Filter out separators and get actual category directories
		const categories = mainMeta.pages.filter(
			(page) =>
				!page.startsWith("---") &&
				page !== "getting-started" &&
				page !== "when-to-use-what" &&
				page !== "books",
		);

		// Search through all categories for the pattern
		for (const category of categories) {
			try {
				const categoryMetaPath = join(patternsDir, category, "meta.json");
				const categoryMetaContent = await readFile(categoryMetaPath, "utf-8");
				const categoryMeta: PatternCategory = JSON.parse(categoryMetaContent);

				// Check if this category contains our pattern
				const patternFile = categoryMeta.pages.find(
					(page) =>
						page.toLowerCase().replace(/\s+/g, "-") === kebabCasePattern,
				);

				if (patternFile) {
					// Read the pattern MDX file
					const patternFilePath = join(
						patternsDir,
						category,
						`${patternFile}.mdx`,
					);
					const patternContent = await readFile(patternFilePath, "utf-8");
					const { data: frontmatter } = matter(patternContent);

					return frontmatter.description || null;
				}
			} catch (error) {
				console.warn(`Failed to read category ${category}:`, error);
			}
		}

		return null;
	} catch (error) {
		console.warn("Failed to read pattern description:", error);
		return null;
	}
}

export async function getPatternCategory(
	patternName: string,
): Promise<string | null> {
	// Convert pattern name to kebab-case for file lookup
	const kebabCasePattern = patternName.toLowerCase().replace(/\s+/g, "-");

	// Path to web app patterns directory
	const patternsDir = join(process.cwd(), "../web/content/patterns");

	try {
		// Read main meta.json to get all categories
		const mainMetaPath = join(patternsDir, "meta.json");
		const mainMetaContent = await readFile(mainMetaPath, "utf-8");
		const mainMeta: { pages: string[] } = JSON.parse(mainMetaContent);

		// Filter out separators and get actual category directories
		const categories = mainMeta.pages.filter(
			(page) =>
				!page.startsWith("---") &&
				page !== "getting-started" &&
				page !== "when-to-use-what" &&
				page !== "books",
		);

		// Search through all categories for the pattern
		for (const category of categories) {
			try {
				const categoryMetaPath = join(patternsDir, category, "meta.json");
				const categoryMetaContent = await readFile(categoryMetaPath, "utf-8");
				const categoryMeta: PatternCategory = JSON.parse(categoryMetaContent);

				// Check if this category contains our pattern
				const patternFile = categoryMeta.pages.find(
					(page) =>
						page.toLowerCase().replace(/\s+/g, "-") === kebabCasePattern,
				);

				if (patternFile) {
					return categoryMeta.title;
				}
			} catch (error) {
				console.warn(`Failed to read category ${category}:`, error);
			}
		}

		return null;
	} catch (error) {
		console.warn("Failed to read pattern category:", error);
		return null;
	}
}

export async function getAllPatternsFromWebApp(): Promise<string[]> {
	const patternsDir = join(process.cwd(), "../web/content/patterns");
	const allPatterns: string[] = [];

	try {
		// Read main meta.json to get all categories
		const mainMetaPath = join(patternsDir, "meta.json");
		const mainMetaContent = await readFile(mainMetaPath, "utf-8");
		const mainMeta: { pages: string[] } = JSON.parse(mainMetaContent);

		// Filter out separators and get actual category directories
		const categories = mainMeta.pages.filter(
			(page) =>
				!page.startsWith("---") &&
				page !== "getting-started" &&
				page !== "when-to-use-what" &&
				page !== "books",
		);

		// Collect all valid pattern names
		for (const category of categories) {
			try {
				const categoryMetaPath = join(patternsDir, category, "meta.json");
				const categoryMetaContent = await readFile(categoryMetaPath, "utf-8");
				const categoryMeta: PatternCategory = JSON.parse(categoryMetaContent);

				// Add all patterns from this category
				categoryMeta.pages.forEach((pattern) => {
					allPatterns.push(pattern);
				});
			} catch (error) {
				console.warn(`Failed to read category ${category}:`, error);
			}
		}

		return allPatterns.sort();
	} catch (error) {
		console.error("Failed to get all patterns from web app:", error);
		return [];
	}
}

export async function validateEntryPatterns(): Promise<{
	valid: string[];
	invalid: string[];
	missing: string[];
}> {
	const entriesDir = join(process.cwd(), "content/entries");
	const patternsDir = join(process.cwd(), "../web/content/patterns");

	const result = {
		valid: [] as string[],
		invalid: [] as string[],
		missing: [] as string[],
	};

	try {
		// Get all entry folders
		const entryFolders = await readdir(entriesDir);

		// Get all valid patterns from web app
		const validPatterns = new Set<string>();

		// Read main meta.json to get all categories
		const mainMetaPath = join(patternsDir, "meta.json");
		const mainMetaContent = await readFile(mainMetaPath, "utf-8");
		const mainMeta: { pages: string[] } = JSON.parse(mainMetaContent);

		// Filter out separators and get actual category directories
		const categories = mainMeta.pages.filter(
			(page) =>
				!page.startsWith("---") &&
				page !== "getting-started" &&
				page !== "when-to-use-what" &&
				page !== "books",
		);

		// Collect all valid pattern names
		for (const category of categories) {
			try {
				const categoryMetaPath = join(patternsDir, category, "meta.json");
				const categoryMetaContent = await readFile(categoryMetaPath, "utf-8");
				const categoryMeta: PatternCategory = JSON.parse(categoryMetaContent);

				// Add all patterns from this category
				categoryMeta.pages.forEach((pattern) => {
					validPatterns.add(pattern.toLowerCase().replace(/\s+/g, "-"));
				});
			} catch (error) {
				console.warn(`Failed to read category ${category}:`, error);
			}
		}

		// Validate each entry folder
		for (const folder of entryFolders) {
			if (validPatterns.has(folder)) {
				result.valid.push(folder);
			} else {
				result.invalid.push(folder);
			}
		}

		// Find patterns that don't have entry folders
		for (const pattern of validPatterns) {
			if (!entryFolders.includes(pattern)) {
				result.missing.push(pattern);
			}
		}

		return result;
	} catch (error) {
		console.error("Failed to validate entry patterns:", error);
		return result;
	}
}
