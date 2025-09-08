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
	notes: string;
	source?: {
		url: string;
		capturedAt: string;
	};
	// Internal fields for content processing
	slug: string;
	filePath: string;
}

export interface SearchIndex {
	id: string;
	title: string;
	pattern: string;
	platform: string;
	type: string;
	website: string;
	tags: string[];
	notes: string;
	slug: string;
}

export type FilterState = {
	platform: "all" | "web" | "mobile";
	type: "all" | "do" | "dont";
	pattern: string | null;
	search: string;
};
