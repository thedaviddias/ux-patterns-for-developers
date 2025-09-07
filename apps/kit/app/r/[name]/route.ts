import { readdir, readFile } from "fs/promises";
import { type NextRequest, NextResponse } from "next/server";
import { join } from "path";

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

		// Handle registry index request
		if (componentName === "registry") {
			const response: RegistrySchema = {
				$schema: "https://ui.shadcn.com/schema/registry.json",
				name: "registry",
				homepage: "https://kit.uxpatterns.dev",
				items: [],
			};

			// Read all component files from the registry directory
			const registryDir = join(
				process.cwd(),
				"../..",
				"packages/registry/public/r",
			);

			try {
				const files = await readdir(registryDir);
				const jsonFiles = files.filter((file) => file.endsWith(".json"));

				for (const file of jsonFiles) {
					try {
						const filePath = join(registryDir, file);
						const content = await readFile(filePath, "utf-8");
						const componentData = JSON.parse(content);

						// Extract relevant metadata for the registry index
						response.items.push({
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
								componentData.files?.map((file: any) => ({
									path: file.path,
									type: file.type,
									target: file.target,
								})) || [],
							meta: componentData.meta,
						});
					} catch {}
				}

				return NextResponse.json(response);
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
		} catch (error) {
			// File doesn't exist or is invalid JSON
			return NextResponse.json(
				{ error: "Component not found" },
				{ status: 404 },
			);
		}
	} catch (error) {
		console.error("Registry API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
};
