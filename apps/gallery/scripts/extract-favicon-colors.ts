#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

interface WebsiteMetadata {
	name: string;
	description: string;
	backgroundColor?: string;
}

interface WebsiteData {
	[url: string]: WebsiteMetadata;
}

async function extractDominantColor(
	imageBuffer: Buffer,
): Promise<string | null> {
	try {
		// Get image statistics to find dominant color
		const { dominant } = await sharp(imageBuffer).stats();

		// Convert RGB to hex
		const toHex = (val: number) => val.toString(16).padStart(2, "0");
		const hex = `#${toHex(dominant.r)}${toHex(dominant.g)}${toHex(dominant.b)}`;

		return hex;
	} catch (error) {
		console.error("Error processing image:", error);
		return null;
	}
}

async function extractFaviconColor(websiteUrl: string): Promise<string | null> {
	try {
		// Normalize URL
		const normalizedUrl = websiteUrl.startsWith("http")
			? websiteUrl
			: `https://${websiteUrl}`;

		// Use Google's favicon service to get the favicon
		const faviconUrl = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(normalizedUrl)}&size=128`;

		console.log(`  Fetching favicon for ${websiteUrl}...`);

		// Fetch the favicon
		const response = await fetch(faviconUrl);
		if (!response.ok) {
			console.log(`  ✗ Failed to fetch favicon (${response.status})`);
			return null;
		}

		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Extract dominant color
		const color = await extractDominantColor(buffer);

		if (color) {
			console.log(`  ✓ Extracted color: ${color}`);
			return color;
		} else {
			console.log(`  ✗ Could not extract color`);
			return null;
		}
	} catch (error) {
		console.error(`  ✗ Error extracting color for ${websiteUrl}:`, error);
		return null;
	}
}

async function main() {
	console.log("Starting favicon color extraction...\n");

	// Load existing websites.json
	const filePath = join(process.cwd(), "data/websites.json");
	const fileContent = readFileSync(filePath, "utf-8");
	const websiteData: WebsiteData = JSON.parse(fileContent);

	// Process each website
	for (const [url, metadata] of Object.entries(websiteData)) {
		console.log(`Processing ${url}:`);

		// Skip if color already exists (unless you want to refresh)
		if (metadata.backgroundColor) {
			console.log(
				`  ⟳ Skipping (color already exists: ${metadata.backgroundColor})`,
			);
			continue;
		}

		const color = await extractFaviconColor(url);
		if (color) {
			metadata.backgroundColor = color;
		}

		// Add a small delay to avoid rate limiting
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	// Save updated data
	writeFileSync(filePath, JSON.stringify(websiteData, null, 2));
	console.log("\n✓ Updated websites.json with background colors");
}

// Run the script
main().catch(console.error);
