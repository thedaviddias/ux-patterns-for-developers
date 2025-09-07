import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_BASE_PATH = path.dirname(__dirname);
const REGISTRY_DIR = path.join(REGISTRY_BASE_PATH, "registry/default");
const PUBLIC_FOLDER_BASE_PATH = path.join(REGISTRY_BASE_PATH, "public/r");
const COMPLETE_REGISTRY_PATH = path.join(REGISTRY_BASE_PATH, "registry.json");

async function writeFileRecursive(filePath, data) {
	const dir = path.dirname(filePath);

	try {
		await fs.mkdir(dir, { recursive: true });
		await fs.writeFile(filePath, data, "utf-8");
	} catch (error) {
		console.error(`Error writing file ${filePath}:`, error);
	}
}

/**
 * Extract metadata from JSDoc comments in component files
 */
function extractMetadata(content) {
	const metadataRegex = /\/\*\*\s*\n([\s\S]*?)\*\//;
	const match = content.match(metadataRegex);

	if (!match) return null;

	const comment = match[1];
	const metadata = {};

	// Extract @registry marker
	if (!comment.includes("@registry")) return null;

	// Extract metadata fields
	const extractField = (field) => {
		const regex = new RegExp(`@${field}\\s+(.+)`, "g");
		const matches = [...comment.matchAll(regex)];
		return matches.map((m) => m[1].trim());
	};

	const name = extractField("name")[0];
	const type = extractField("type")[0];
	const description = extractField("description")[0];

	// Parse JSON arrays for dependencies and tags
	const parseDeps = (field) => {
		const deps = extractField(field)[0];
		if (!deps) return [];
		try {
			return JSON.parse(deps);
		} catch {
			return deps.split(",").map((d) => d.trim().replace(/['"]/g, ""));
		}
	};

	metadata.name = name;
	metadata.type = type || "registry:component";
	metadata.description = description;
	metadata.dependencies = parseDeps("dependencies");
	metadata.registryDependencies = parseDeps("registryDependencies");
	metadata.tags = parseDeps("tags");

	return metadata;
}

/**
 * Analyze imports to auto-detect registry dependencies and npm packages
 */
function analyzeImports(content) {
	const registryImports = [];
	const packageImports = [];

	// Detect registry dependencies (@/ui, @/lib, etc.)
	const registryRegex =
		/import\s+.*?\s+from\s+["']@\/(ui|components|blocks|hooks|lib)\/([^"']+)["']/g;

	let match: RegExpExecArray | null;
	// biome-ignore lint: needed for regex iteration
	while ((match = registryRegex.exec(content)) !== null) {
		const [, , componentName] = match;
		// Extract just the component name without file extension
		const name = componentName.replace(/\.(tsx?|jsx?)$/, "");
		registryImports.push(name);
	}

	// Detect npm package dependencies (exclude relative imports and @/ imports)
	const packageRegex = /import\s+.*?\s+from\s+["']([^./][^'"]+)['"]/g;

	// biome-ignore lint: needed for regex iteration
	while ((match = packageRegex.exec(content)) !== null) {
		const [, packageName] = match;
		// Exclude @/ aliases and Node.js built-ins
		if (
			!packageName.startsWith("@/") &&
			!packageName.startsWith("node:") &&
			!packageName.includes("react/")
		) {
			// Handle scoped packages properly
			const pkgName = packageName.startsWith("@")
				? packageName.split("/").slice(0, 2).join("/")
				: packageName.split("/")[0];
			packageImports.push(pkgName);
		}
	}

	return {
		registryDependencies: [...new Set(registryImports)],
		dependencies: [...new Set(packageImports)],
	};
}

/**
 * Scan directory for component files and extract metadata (recursively)
 */
async function scanDirectory(dirPath, type) {
	const items = [];

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
			const subItems = await scanDirectory(filePath, type);
			items.push(...subItems);
		} else if (
			stat.isFile() &&
			(file.endsWith(".tsx") || file.endsWith(".jsx") || file.endsWith(".ts"))
		) {
			const content = await fs.readFile(filePath, "utf8");
			const metadata = extractMetadata(content);

			const componentName = file.replace(/\.(tsx?|jsx?)$/, "");
			const relativePath = path.relative(REGISTRY_BASE_PATH, filePath);

			if (metadata) {
				// Use metadata if available
				if (
					!metadata.registryDependencies ||
					metadata.registryDependencies.length === 0
				) {
					metadata.registryDependencies = analyzeImports(content);
				}

				items.push({
					name: metadata.name || componentName,
					type: metadata.type || type,
					description: metadata.description,
					dependencies: metadata.dependencies || [],
					registryDependencies: metadata.registryDependencies || [],
					files: [
						{
							path: relativePath,
							type: metadata.type || type,
							content: content,
						},
					],
					meta: {
						tags: metadata.tags || [],
					},
				});
			} else {
				// Auto-detect for files without metadata
				const { registryDependencies, dependencies } = analyzeImports(content);

				items.push({
					name: componentName,
					type: type,
					dependencies: dependencies,
					registryDependencies: registryDependencies,
					files: [
						{
							path: relativePath,
							type: type,
							content: content,
						},
					],
					meta: {
						tags: [],
					},
				});
			}
		}
	}

	return items;
}

/**
 * Generate the complete registry by scanning filesystem
 */
async function generateRegistry() {
	console.log("🔍 Scanning registry directories...");

	const items = [];

	// Scan all directories
	const directories = [
		{ path: path.join(REGISTRY_DIR, "ui"), type: "registry:ui" },
		{ path: path.join(REGISTRY_DIR, "components"), type: "registry:component" },
		{ path: path.join(REGISTRY_DIR, "blocks"), type: "registry:block" },
		{ path: path.join(REGISTRY_DIR, "hooks"), type: "registry:hook" },
		{ path: path.join(REGISTRY_DIR, "lib"), type: "registry:lib" },
	];

	for (const { path: dirPath, type } of directories) {
		const dirItems = await scanDirectory(dirPath, type);
		items.push(...dirItems);
	}

	console.log(`📝 Found ${items.length} components/blocks`);
	return items;
}

async function main() {
	console.log("🚀 Starting automated registry build...");

	// Clean public folder
	try {
		await fs.rm(PUBLIC_FOLDER_BASE_PATH, { recursive: true, force: true });
	} catch {
		// Folder doesn't exist, that's fine
	}

	// Generate registry by scanning filesystem
	const registryItems = await generateRegistry();

	// Generate the complete registry.json file (shadcn build will handle individual files)
	const cleanRegistry = {
		$schema: "https://ui.shadcn.com/schema/registry.json",
		name: "up-kit",
		homepage: "https://kit.uxpatterns.dev",
		items: registryItems.map((item) => ({
			...item,
			files: item.files.map(({ content, ...file }) => file),
		})),
	};

	await writeFileRecursive(
		COMPLETE_REGISTRY_PATH,
		JSON.stringify(cleanRegistry, null, 2),
	);

	console.log(
		`✅ Generated registry.json with ${registryItems.length} components`,
	);
	console.log(`📍 Registry available at: ${COMPLETE_REGISTRY_PATH}`);
}

main()
	.then(() => {
		console.log("🎉 Registry generation complete!");
		console.log("💡 Run 'shadcn build' to generate component files");
	})
	.catch((err) => {
		console.error("❌ Registry build failed:", err);
		process.exit(1);
	});
