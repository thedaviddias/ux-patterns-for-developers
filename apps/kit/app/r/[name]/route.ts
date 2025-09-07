import registry from "@ux-patterns/registry/registry.json";
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
			return NextResponse.json(registry, {
				headers: {
					"Cache-Control": "s-maxage=300, stale-while-revalidate=300",
				},
			});
		}

		// Handle individual component requests
		try {
			// Find the component in the static registry
			const componentData = registry.items.find(
				(item) => item.name === componentName,
			);

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
			console.error("Failed to load component:", error);
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
