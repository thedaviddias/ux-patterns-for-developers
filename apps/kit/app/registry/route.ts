import registry from "@ux-patterns/registry/registry.json";
import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json(registry);
}
