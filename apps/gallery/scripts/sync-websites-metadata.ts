#!/usr/bin/env tsx

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

interface WebsiteMetadata {
	name: string;
	description: string;
	backgroundColor?: string;
}

interface WebsiteData {
	[url: string]: WebsiteMetadata;
}

/**
 * Fetches website metadata by parsing HTML meta tags
 */
async function fetchWebsiteMetadata(
	url: string,
): Promise<{ name: string; description: string } | null> {
	try {
		const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

		console.log(`  Fetching metadata for ${url}...`);

		const response = await fetch(normalizedUrl);
		if (!response.ok) {
			console.log(`  ✗ Failed to fetch website (${response.status})`);
			return null;
		}

		const html = await response.text();

		// Extract title
		let name = url;
		const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
		if (titleMatch) {
			name = titleMatch[1].trim();
			// Clean up common patterns
			name = name.replace(/\s*[|\-–—]\s*.*$/, ""); // Remove everything after separators
		}

		// Try og:site_name as well
		const ogSiteNameMatch = html.match(
			/<meta\s+property="og:site_name"\s+content="([^"]+)"/i,
		);
		if (ogSiteNameMatch) {
			name = ogSiteNameMatch[1].trim();
		}

		// Extract description
		let description = "";
		const metaDescMatch = html.match(
			/<meta\s+name="description"\s+content="([^"]+)"/i,
		);
		const ogDescMatch = html.match(
			/<meta\s+property="og:description"\s+content="([^"]+)"/i,
		);

		if (metaDescMatch) {
			description = metaDescMatch[1].trim();
		} else if (ogDescMatch) {
			description = ogDescMatch[1].trim();
		}

		console.log(`  ✓ Found: ${name}`);

		return { name, description };
	} catch (error) {
		console.error(`  ✗ Error fetching metadata for ${url}:`, error);
		return null;
	}
}

/**
 * Recursively finds all MDX files in a directory
 */
function findMdxFiles(dir: string): string[] {
	const files: string[] = [];

	try {
		const items = readdirSync(dir);

		for (const item of items) {
			const fullPath = join(dir, item);
			const stat = statSync(fullPath);

			if (stat.isDirectory()) {
				files.push(...findMdxFiles(fullPath));
			} else if (item.endsWith(".mdx")) {
				files.push(fullPath);
			}
		}
	} catch (error) {
		console.warn(`Could not read directory ${dir}:`, error);
	}

	return files;
}

/**
 * Extracts website URLs from MDX frontmatter
 */
function extractWebsitesFromMdx(entriesDir: string): Set<string> {
	const websites = new Set<string>();
	const mdxFiles = findMdxFiles(entriesDir);

	console.log(`Found ${mdxFiles.length} MDX files\n`);

	for (const filePath of mdxFiles) {
		try {
			const content = readFileSync(filePath, "utf-8");
			const { data } = matter(content);

			if (data.website) {
				websites.add(data.website);
			}
		} catch (error) {
			console.warn(`Could not parse ${filePath}:`, error);
		}
	}

	return websites;
}

/**
 * Formats website name from URL
 */
function formatWebsiteName(url: string): string {
	return url
		.replace(/^(https?:\/\/)?(www\.)?/, "")
		.replace(/\.[^.]+$/, "") // Remove TLD
		.split(/[-.]/)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

async function main() {
	console.log("Starting website metadata sync...\n");

	// Load existing websites.json
	const websitesPath = join(process.cwd(), "data/websites.json");
	let websiteData: WebsiteData = {};

	try {
		const fileContent = readFileSync(websitesPath, "utf-8");
		websiteData = JSON.parse(fileContent);
	} catch (_error) {
		console.log("No existing websites.json found, creating new one\n");
	}

	// Extract websites from MDX files
	const entriesDir = join(process.cwd(), "content/entries");
	const websitesFromMdx = extractWebsitesFromMdx(entriesDir);

	console.log(`Found ${websitesFromMdx.size} unique websites in MDX files\n`);

	// Process each website
	for (const website of websitesFromMdx) {
		console.log(`Processing ${website}:`);

		// Skip if already exists with name and description
		if (websiteData[website]?.name && websiteData[website]?.description) {
			console.log(`  ⟳ Already has metadata`);
			continue;
		}

		// Initialize if doesn't exist
		if (!websiteData[website]) {
			websiteData[website] = {
				name: formatWebsiteName(website),
				description: "",
			};
		}

		// Fetch metadata if missing
		if (!websiteData[website].name || !websiteData[website].description) {
			const metadata = await fetchWebsiteMetadata(website);

			if (metadata) {
				// Only update if we got better data
				if (metadata.name && metadata.name !== website) {
					websiteData[website].name = metadata.name;
				}
				if (metadata.description) {
					websiteData[website].description = metadata.description;
				}
			}

			// Add delay to avoid rate limiting
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	// Remove websites that are no longer referenced in MDX files
	const currentWebsites = Object.keys(websiteData);
	for (const website of currentWebsites) {
		if (!websitesFromMdx.has(website)) {
			console.log(`\nRemoving ${website} (no longer referenced in MDX files)`);
			delete websiteData[website];
		}
	}

	// Sort websites alphabetically
	const sortedData: WebsiteData = {};
	const sortedKeys = Object.keys(websiteData).sort();
	for (const key of sortedKeys) {
		sortedData[key] = websiteData[key];
	}

	// Save updated data
	writeFileSync(websitesPath, JSON.stringify(sortedData, null, 2));
	console.log("\n✓ Updated websites.json with metadata");

	// Report statistics
	const withDescription = Object.values(sortedData).filter(
		(w) => w.description,
	).length;
	console.log(`\nStatistics:`);
	console.log(`  Total websites: ${Object.keys(sortedData).length}`);
	console.log(`  With descriptions: ${withDescription}`);
	console.log(
		`  Missing descriptions: ${Object.keys(sortedData).length - withDescription}`,
	);
}

// Run the script
main().catch(console.error);
