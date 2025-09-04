import fs from "node:fs";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ name: string }> },
) {
	try {
		const { name: rawName } = await params;
		// Remove .json extension if present to match component names
		const name = rawName.replace(/\.json$/, "");

		// Try to read the pre-generated component file from the registry package
		const componentPath = path.join(
			process.cwd(),
			"../..",
			"packages/registry/public/r",
			`${name}.json`,
		);

		if (!fs.existsSync(componentPath)) {
			return NextResponse.json(
				{ error: "Component not found" },
				{ status: 404 },
			);
		}

		const componentData = JSON.parse(fs.readFileSync(componentPath, "utf-8"));
		return NextResponse.json(componentData);
	} catch (error) {
		console.error("Registry API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
