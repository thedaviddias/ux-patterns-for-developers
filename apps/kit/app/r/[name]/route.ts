import {
	findRegistryItem,
	generateRegistry,
	type RegistryItem,
} from "@ux-patterns/registry/lib/registry-generator";
import { type NextRequest, NextResponse } from "next/server";

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
				{
					error:
						"Invalid component name. Only alphanumeric characters, hyphens, and underscores are allowed.",
				},
				{ status: 400 },
			);
		}

		// Handle registry index request
		if (componentName === "registry") {
			try {
				const registryItems = await generateRegistry();
				const response: RegistrySchema = {
					$schema: "https://ui.shadcn.com/schema/registry.json",
					name: "upkit",
					homepage: "https://kit.uxpatterns.dev",
					items: registryItems.map((item: RegistryItem) => ({
						name: item.name,
						type: item.type,
						title: item.title,
						description: item.description,
						author: item.author,
						dependencies: item.dependencies,
						devDependencies: item.devDependencies,
						registryDependencies: item.registryDependencies,
						categories: item.categories,
						files:
							item.files?.map((f) => ({
								path: f.path,
								type: f.type,
								target: f.target,
							})) || [],
						meta: item.meta,
					})),
				};

				return NextResponse.json(response, {
					headers: {
						"Cache-Control": "s-maxage=300, stale-while-revalidate=300",
					},
				});
			} catch (error) {
				console.error("Failed to generate registry:", error);
				return NextResponse.json(
					{ error: "Failed to generate registry" },
					{ status: 500 },
				);
			}
		}

		// Handle individual component requests
		try {
			const componentData = await findRegistryItem(componentName);
			if (!componentData) {
				return NextResponse.json(
					{ error: "Component not found" },
					{ status: 404 },
				);
			}
			return NextResponse.json(componentData, {
				headers: {
					"Cache-Control": "s-maxage=300, stale-while-revalidate=300",
				},
			});
		} catch (error) {
			console.error("Failed to generate component:", error);
			return NextResponse.json(
				{ error: "Failed to load component" },
				{ status: 500 },
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
