import type { Entry } from "./types";

/**
 * Constructs the image path based on the entry's website
 * Path structure: /website/[website-name]/[filename]
 */
export function getImagePath(entry: Entry): string {
	// If the media.src is already a full URL or data URL, return as is
	if (
		entry.media.src.startsWith("http") ||
		entry.media.src.startsWith("data:")
	) {
		return entry.media.src;
	}

	// If the media.src is already a full path starting with /, return as is
	if (entry.media.src.startsWith("/")) {
		return entry.media.src;
	}

	// Construct the path based on website
	const website = entry.website; // e.g., "klingai.com"
	const filename = entry.media.src; // e.g., "001.png"

	// Build the path: /web/[website-name]/[filename]
	return `/web/${website}/${filename}`;
}
