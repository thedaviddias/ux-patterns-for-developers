import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { getLLMText } from "@/lib/get-llm-text";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET(
	_req: NextRequest,
	{ params }: RouteContext<"/llms.txt/[...slug]">,
) {
	const slug = (await params).slug as string[];
	const page = source.getPage(slug);
	if (!page) notFound();

	return new NextResponse(await getLLMText(page));
}

export function generateStaticParams() {
	return source.generateParams();
}
