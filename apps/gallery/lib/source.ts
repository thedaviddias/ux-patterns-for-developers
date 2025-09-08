import { loader } from "fumadocs-core/source";
import { docs, entries } from "@/.source";

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
	// it assigns a URL to your pages
	baseUrl: "/docs",
	source: docs.toFumadocsSource(),
});

export const entriesSource = loader({
	baseUrl: "/gallery",
	source: entries.toFumadocsSource(),
});
