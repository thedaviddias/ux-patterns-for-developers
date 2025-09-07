import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateRegistry } from "../lib/registry-generator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_BASE_PATH = path.dirname(__dirname);
const PUBLIC_FOLDER_BASE_PATH = path.join(REGISTRY_BASE_PATH, "public/r");
const COMPLETE_REGISTRY_PATH = path.join(REGISTRY_BASE_PATH, "registry.json");

async function writeFileRecursive(
	filePath: string,
	data: string,
): Promise<void> {
	const dir = path.dirname(filePath);

	try {
		await fs.mkdir(dir, { recursive: true });
		await fs.writeFile(filePath, data, "utf-8");
	} catch (error) {
		console.error(`Error writing file ${filePath}:`, error);
		throw error;
	}
}

async function main() {
	console.log("🚀 Starting automated registry build...");

	// Clean public folder
	try {
		await fs.rm(PUBLIC_FOLDER_BASE_PATH, { recursive: true, force: true });
	} catch {
		// Folder doesn't exist, that's fine
	}
	// Recreate base folder
	await fs.mkdir(PUBLIC_FOLDER_BASE_PATH, { recursive: true });

	// Generate registry by scanning filesystem
	console.log("🔍 Scanning registry directories...");
	const registryItems = await generateRegistry();
	console.log(`📝 Found ${registryItems.length} components/blocks`);

	// Generate the complete registry.json file (shadcn build will handle individual files)
	const cleanRegistry = {
		$schema: "https://ui.shadcn.com/schema/registry.json",
		name: "upkit",
		homepage: "https://kit.uxpatterns.dev",
		items: registryItems.map((item) => ({
			...item,
			files: item.files?.map(({ content, ...file }) => file),
		})),
	};

	await writeFileRecursive(
		COMPLETE_REGISTRY_PATH,
		JSON.stringify(cleanRegistry, null, 2),
	);

	// Emit individual public items including file contents
	await Promise.all(
		registryItems.map((item) =>
			writeFileRecursive(
				path.join(PUBLIC_FOLDER_BASE_PATH, `${item.name}.json`),
				JSON.stringify(item, null, 2),
			),
		),
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
