import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface WebsiteMetadata {
	name: string;
	description: string;
	backgroundColor?: string;
}

export interface WebsiteData {
	[url: string]: WebsiteMetadata;
}

let websiteData: WebsiteData | null = null;

export function loadWebsites(): WebsiteData {
	if (websiteData) {
		return websiteData;
	}

	try {
		const filePath = join(process.cwd(), "data/websites.json");
		const fileContent = readFileSync(filePath, "utf-8");
		websiteData = JSON.parse(fileContent) as WebsiteData;
		return websiteData;
	} catch (error) {
		console.warn("Could not load websites.json:", error);
		return {};
	}
}

export function getWebsiteMetadata(url: string): WebsiteMetadata | null {
	const websites = loadWebsites();
	return websites[url] || null;
}

export function getWebsiteName(url: string): string {
	const metadata = getWebsiteMetadata(url);
	return metadata?.name || formatWebsiteUrl(url);
}

export function getWebsiteDescription(url: string): string | null {
	const metadata = getWebsiteMetadata(url);
	return metadata?.description || null;
}

export function getWebsiteBackgroundColor(url: string): string | null {
	const metadata = getWebsiteMetadata(url);
	return metadata?.backgroundColor || null;
}

/**
 * Gets the favicon URL for a given website using Google's favicon service
 * @param website - The website URL to get the favicon for
 * @param size - The size of the favicon to request (default: 128)
 * @returns The favicon URL or placeholder if not found
 */
export function getFaviconUrl(website: string, size = 128) {
	try {
		if (!website || typeof website !== "string") {
			console.warn("Invalid website URL provided to getFaviconUrl:", website);
			return "/placeholder.svg";
		}

		// Handle URLs that don't start with http:// or https://
		const normalizedUrl = website.startsWith("http")
			? website
			: `https://${website}`;

		// Use the newer Google favicon API endpoint with larger size for better quality
		return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(normalizedUrl)}&size=${size}`;
	} catch (error) {
		console.error(`Error getting favicon for ${website}:`, error);
		return "/placeholder.svg";
	}
}

// Fallback function to format URL when no metadata exists
function formatWebsiteUrl(url: string): string {
	return url
		.replace(/^(https?:\/\/)?(www\.)?/, "")
		.replace(/\/$/, "")
		.split(".")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}
