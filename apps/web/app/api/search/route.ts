import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// Use static search generation for better performance
// This pre-generates the search index at build time
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
	// https://docs.orama.com/docs/orama-js/supported-languages
	language: "english",
});
