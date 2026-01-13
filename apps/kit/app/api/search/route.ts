import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// Force static generation with ISR for search index
export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

export const { GET } = createFromSource(source, {
	// https://docs.orama.com/docs/orama-js/supported-languages
	language: "english",
});
