import { NextResponse } from "next/server";
import { getUniquePatterns, loadEntries } from "@/lib/loadEntries";

export async function GET() {
	try {
		const entries = await loadEntries();
		const patterns = getUniquePatterns(entries);

		return NextResponse.json({
			entries,
			patterns,
		});
	} catch (error) {
		console.error("Failed to load search data:", error);
		return NextResponse.json(
			{ error: "Failed to load search data" },
			{ status: 500 },
		);
	}
}
