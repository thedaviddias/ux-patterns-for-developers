export interface Entry {
	id: string;
	title: string;
	pattern: string;
	platform: "web" | "mobile";
	type: "do" | "dont";
	website: string;
	media: {
		type: "image" | "video";
		src: string;
	};
	tags?: string[];
	content: string;
	source?: {
		url: string;
		capturedAt: string;
	};
	// Internal fields for content processing
	slug: string;
	filePath: string;
	body?: any; // MDX compiled body for rendering
}

export interface SearchIndex {
	id: string;
	title: string;
	pattern: string;
	platform: string;
	type: string;
	website: string;
	tags: string[];
	content: string;
	slug: string;
}

export type FilterState = {
	platform: "all" | "web" | "mobile";
	type: "all" | "do" | "dont";
	pattern: string | null;
	search: string;
};
