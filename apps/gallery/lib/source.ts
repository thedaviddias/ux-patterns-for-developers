import { loader } from "fumadocs-core/source";
import { entries, pages } from "@/.source";

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const entriesSource = loader({
	// it assigns a URL to your entries
	baseUrl: "/entries",
	source: entries.toFumadocsSource(),
});

export const pagesSource = loader({
	// it assigns a URL to your pages
	baseUrl: "/pages",
	source: pages.toFumadocsSource(),
});

// For backward compatibility, export pagesSource as source
export const source = pagesSource;
