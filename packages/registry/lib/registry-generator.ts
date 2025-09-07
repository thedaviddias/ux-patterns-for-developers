import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Type definitions
interface RegistryMetadata {
	name?: string;
	type?: string;
	title?: string;
	description?: string;
	author?: string;
	dependencies?: string[];
	devDependencies?: string[];
	registryDependencies?: string[];
	categories?: string[];
	tags?: string[];
}

export interface RegistryItem {
	$schema: string;
	name: string;
	type: string;
	title: string;
	description?: string;
	author: string;
	dependencies?: string[];
	devDependencies?: string[];
	registryDependencies?: string[];
	categories?: string[];
	files?: Array<{
		path: string;
		type: string;
		content: string;
		target: string;
	}>;
	meta?: {
		tags: string[];
	};
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_BASE_PATH = path.dirname(__dirname);
const REGISTRY_DIR = path.join(REGISTRY_BASE_PATH, "registry/default");

/**
 * Get the appropriate target path based on component type
 */
function getTargetPath(registryType: string, componentName: string): string {
	const hasExt = componentName.includes(".");
	const ensureExt = (name: string, ext: string) =>
		hasExt || !ext ? name : `${name}${ext}`;

	switch (registryType) {
		case "registry:ui":
			return `components/upkit/${ensureExt(componentName, ".tsx")}`;
		case "registry:block":
			return `components/blocks/${ensureExt(componentName, ".tsx")}`;
		case "registry:component":
			return `components/${ensureExt(componentName, ".tsx")}`;
		case "registry:hook":
			return `hooks/${ensureExt(componentName.replace(".tsx", ".ts"), ".ts")}`;
		case "registry:lib":
			return `lib/${ensureExt(componentName.replace(".tsx", ".ts"), ".ts")}`;
		case "registry:theme":
			return `styles/${ensureExt(componentName.replace(".tsx", ".css"), ".css")}`;
		case "registry:page":
			return `app/${ensureExt(componentName, ".tsx")}`;
		case "registry:style":
			return `styles/${ensureExt(componentName.replace(".tsx", ".css"), ".css")}`;
		case "registry:file":
			return componentName;
		default:
			return `components/${ensureExt(componentName, ".tsx")}`;
	}
}

/**
 * Extract metadata from JSDoc comments in component files
 */
function extractMetadata(content: string): RegistryMetadata | null {
	const metadataRegex = /\/\*\*\s*\n([\s\S]*?)\*\//;
	const match = content.match(metadataRegex);

	if (!match) return null;

	const comment = match[1];
	const metadata: RegistryMetadata = {};

	// Extract @registry marker
	if (!comment.includes("@registry")) return null;

	// Extract metadata fields
	const extractField = (field: string): string[] => {
		const regex = new RegExp(`@${field}\\s+(.+)`, "g");
		const matches = [...comment.matchAll(regex)];
		return matches.map((m) => m[1].trim());
	};

	const name = extractField("name")[0];
	const type = extractField("type")[0];
	const title = extractField("title")[0];
	const description = extractField("description")[0];
	const author = extractField("author")[0];

	// Parse JSON arrays for dependencies and tags
	const parseDeps = (field: string): string[] => {
		const deps = extractField(field)[0];
		if (!deps) return [];
		try {
			return JSON.parse(deps);
		} catch {
			return deps.split(",").map((d: string) => d.trim().replace(/['"]/g, ""));
		}
	};

	metadata.name = name;
	metadata.type = type || "registry:block";
	metadata.title = title || name;
	metadata.description = description;
	metadata.author = author || "David Dias <hello@thedaviddias.com>";
	metadata.dependencies = parseDeps("dependencies");
	metadata.devDependencies = parseDeps("devDependencies");
	metadata.registryDependencies = parseDeps("registryDependencies");
	metadata.categories = parseDeps("categories");
	metadata.tags = parseDeps("tags");

	return metadata;
}

/**
 * Analyze imports to auto-detect registry dependencies and npm packages
 */
function analyzeImports(content: string): {
	registryDependencies: string[];
	dependencies: string[];
} {
	const registryImports: string[] = [];
	const packageImports: string[] = [];

	// Detect registry dependencies (@/ui, @/lib, etc.)
	const registryRegex =
		/import\s+.*?\s+from\s+["']@\/(ui|components|blocks|hooks|lib)\/([^"']+)["']/g;

	let match: RegExpExecArray | null;
	// biome-ignore lint: needed for regex iteration
	while ((match = registryRegex.exec(content)) !== null) {
		const [, , componentPath] = match;
		const name =
			componentPath
				.split("/")
				.pop()
				?.replace(/\.(tsx?|jsx?)$/, "") ?? "";
		registryImports.push(name);
	}

	// Detect npm package dependencies (exclude relative imports and @/ imports)
	const packageRegex = /import\s+.*?\s+from\s+["']([^./][^'"]+)['"]/g;

	// Common packages to exclude
	const excludedPackages = [
		"react",
		"react-dom",
		"@ux-patterns/ui",
		"@ux-patterns/hooks",
		"@types/react",
		"@types/react-dom",
		"typescript",
	];

	// biome-ignore lint: needed for regex iteration
	while ((match = packageRegex.exec(content)) !== null) {
		const spec = match[1];
		if (spec.startsWith("@/") || spec.startsWith("node:")) continue;
		const pkgName = spec.startsWith("@")
			? spec.split("/").slice(0, 2).join("/")
			: spec.split("/")[0];
		if (
			pkgName === "react" ||
			pkgName === "react-dom" ||
			excludedPackages.includes(pkgName)
		)
			continue;
		packageImports.push(pkgName);
	}

	return {
		registryDependencies: [...new Set(registryImports)],
		dependencies: [...new Set(packageImports)],
	};
}

/**
 * Scan directory for component files and extract metadata (recursively)
 */
async function scanDirectory(
	dirPath: string,
	type: string,
): Promise<RegistryItem[]> {
	const items: RegistryItem[] = [];

	try {
		const stat = await fs.stat(dirPath);
		if (!stat.isDirectory()) return items;
	} catch {
		return items;
	}

	const files = await fs.readdir(dirPath);

	for (const file of files) {
		const filePath = path.join(dirPath, file);
		const stat = await fs.stat(filePath);

		if (stat.isDirectory()) {
			// Recursively scan subdirectories
			const subItems: RegistryItem[] = await scanDirectory(filePath, type);
			items.push(...subItems);
		} else if (
			stat.isFile() &&
			(file.endsWith(".tsx") ||
				file.endsWith(".jsx") ||
				(file.endsWith(".ts") && !file.endsWith(".d.ts")))
		) {
			const content = await fs.readFile(filePath, "utf8");
			const metadata = extractMetadata(content);

			const componentName = file.replace(/\.(tsx?|jsx?)$/, "");
			const relativePath = path
				.relative(REGISTRY_BASE_PATH, filePath)
				.replace(/\\/g, "/");

			if (metadata) {
				// Use metadata if available
				if (
					!metadata.registryDependencies ||
					metadata.registryDependencies.length === 0
				) {
					const analyzed = analyzeImports(content);
					metadata.registryDependencies = analyzed.registryDependencies;
				}

				const itemType = metadata.type || type;
				const fileType = metadata.type || type;

				const registryItem: RegistryItem = {
					$schema: "https://ui.shadcn.com/schema/registry-item.json",
					name: metadata.name || componentName,
					type: itemType,
					title: metadata.title || metadata.name || componentName,
					description: metadata.description,
					author: metadata.author || "David Dias <hello@thedaviddias.com>",
					files: [
						{
							path: relativePath,
							type: fileType,
							content: content,
							target: getTargetPath(fileType, metadata.name || componentName),
						},
					],
				};

				// Only include arrays if they have content
				if (metadata.dependencies && metadata.dependencies.length > 0) {
					registryItem.dependencies = metadata.dependencies;
				}
				if (metadata.devDependencies && metadata.devDependencies.length > 0) {
					registryItem.devDependencies = metadata.devDependencies;
				}
				if (
					metadata.registryDependencies &&
					metadata.registryDependencies.length > 0
				) {
					registryItem.registryDependencies = metadata.registryDependencies;
				}
				if (metadata.categories && metadata.categories.length > 0) {
					registryItem.categories = metadata.categories;
				}
				if (metadata.tags && metadata.tags.length > 0) {
					registryItem.meta = { tags: metadata.tags };
				}

				items.push(registryItem);
			} else {
				// Auto-detect for files without metadata
				const { registryDependencies, dependencies } = analyzeImports(content);

				const autoRegistryItem: RegistryItem = {
					$schema: "https://ui.shadcn.com/schema/registry-item.json",
					name: componentName,
					type: type,
					title: componentName,
					description: `Auto-generated ${componentName} component`,
					author: "David Dias <hello@thedaviddias.com>",
					files: [
						{
							path: relativePath,
							type: type,
							content: content,
							target: getTargetPath(type, componentName),
						},
					],
				};

				// Only include arrays if they have content
				if (dependencies && dependencies.length > 0) {
					autoRegistryItem.dependencies = dependencies;
				}
				if (registryDependencies && registryDependencies.length > 0) {
					autoRegistryItem.registryDependencies = registryDependencies;
				}

				items.push(autoRegistryItem);
			}
		}
	}

	return items;
}

/**
 * Generate the complete registry by scanning filesystem
 */
export async function generateRegistry(): Promise<RegistryItem[]> {
	const items: RegistryItem[] = [];

	// Scan all directories
	const directories = [
		{ path: path.join(REGISTRY_DIR, "ui"), type: "registry:ui" },
		{ path: path.join(REGISTRY_DIR, "blocks"), type: "registry:block" },
		{ path: path.join(REGISTRY_DIR, "hooks"), type: "registry:hook" },
		{ path: path.join(REGISTRY_DIR, "lib"), type: "registry:lib" },
	];

	console.log(`[DEBUG] REGISTRY_DIR: ${REGISTRY_DIR}`);
	console.log(`[DEBUG] Scanning ${directories.length} directories`);

	for (const { path: dirPath, type } of directories) {
		console.log(`[DEBUG] Scanning directory: ${dirPath} (type: ${type})`);
		try {
			const dirItems = await scanDirectory(dirPath, type);
			console.log(`[DEBUG] Found ${dirItems.length} items in ${dirPath}`);
			items.push(...dirItems);
		} catch (error) {
			console.error(`[DEBUG] Error scanning ${dirPath}:`, error);
		}
	}

	console.log(`[DEBUG] Total items found: ${items.length}`);
	return items;
}

/**
 * Find a specific registry item by name
 */
export async function findRegistryItem(
	name: string,
): Promise<RegistryItem | null> {
	const items = await generateRegistry();
	return items.find((item) => item.name === name) || null;
}
