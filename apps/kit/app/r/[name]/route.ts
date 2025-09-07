import { readdir, readFile } from "fs/promises";
import { type NextRequest, NextResponse } from "next/server";
import { join, resolve } from "path";

// Validate component name to prevent path traversal and invalid characters
function validateComponentName(name: string): boolean {
	// Only allow alphanumeric characters, hyphens, and underscores
	// No dots, slashes, or other potentially dangerous characters
	const validNameRegex = /^[a-zA-Z0-9_-]+$/;
	return validNameRegex.test(name);
}

type RegistryParams = {
	params: Promise<{ name: string }>;
};

type RegistrySchema = {
	$schema: "https://ui.shadcn.com/schema/registry.json";
	name: string;
	homepage: string;
	items: Array<{
		name: string;
		type: string;
		title?: string;
		description?: string;
		author?: string;
		dependencies?: string[];
		devDependencies?: string[];
		registryDependencies?: string[];
		categories?: string[];
		files: Array<{
			path: string;
			type: string;
			target?: string;
		}>;
		meta?: {
			tags: string[];
		};
	}>;
};

export const GET = async (_: NextRequest, { params }: RegistryParams) => {
	try {
		const { name: rawName } = await params;

		// Validate that the request ends with .json
		if (!rawName.endsWith(".json")) {
			return NextResponse.json(
				{ error: "Component must end with .json" },
				{ status: 400 },
			);
		}

		// Remove .json extension to get the component name
		const componentName = rawName.replace(/\.json$/, "");

		// Validate component name to prevent path traversal
		if (!validateComponentName(componentName)) {
			return NextResponse.json(
				{ error: "Invalid component name. Only alphanumeric characters, hyphens, and underscores are allowed." },
				{ status: 400 },
			);
		}

		// Handle registry index request
		if (componentName === "registry") {
			const response: RegistrySchema = {
				$schema: "https://ui.shadcn.com/schema/registry.json",
				name: "registry",
				homepage: "https://kit.uxpatterns.dev",
				items: [],
			};

			// Read all component files from the registry directory
			const registryDir =
				process.env.REGISTRY_DIR ??
				resolve(process.cwd(), "../..", "packages/registry/public/r");

			try {
				const files = await readdir(registryDir);
				const jsonFiles = files.filter((file) => file.endsWith(".json"));

				const results = await Promise.allSettled(
					jsonFiles.map(async (file) => {
						const filePath = join(registryDir, file);
						const content = await readFile(filePath, "utf-8");
						const componentData = JSON.parse(content);
						return {
							name: componentData.name,
							type: componentData.type,
							title: componentData.title,
							description: componentData.description,
							author: componentData.author,
							dependencies: componentData.dependencies,
							devDependencies: componentData.devDependencies,
							registryDependencies: componentData.registryDependencies,
							categories: componentData.categories,
							files:
								componentData.files?.map((f: any) => ({
									path: f.path,
									type: f.type,
									target: f.target,
								})) || [],
							meta: componentData.meta,
						};
					}),
				);
				for (const r of results) {
					if (r.status === "fulfilled") response.items.push(r.value);
					// optional: console.debug("Skipped registry item:", r.reason);
				}

				return NextResponse.json(response, {
					headers: {
						"Cache-Control": "s-maxage=300, stale-while-revalidate=300",
					},
				});
			} catch {
				return NextResponse.json(
					{ error: "Failed to read registry directory" },
					{ status: 500 },
				);
			}
		}

		// Handle individual component requests
		const componentPath = join(
			process.cwd(),
			"../..",
			"packages/registry/public/r",
			`${componentName}.json`,
		);

		try {
			const componentData = await readFile(componentPath, "utf-8");
			const parsedData = JSON.parse(componentData);
			return NextResponse.json(parsedData);
		} catch (error: any) {
			if (error?.code === "ENOENT") {
				return NextResponse.json({ error: "Component not found" }, { status: 404 });
			}
			if (error instanceof SyntaxError) {
				return NextResponse.json({ error: "Invalid component JSON" }, { status: 500 });
			}
			return NextResponse.json({ error: "Failed to load component" }, { status: 500 });
		}
	} catch (error) {
		console.error("Registry API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
};
