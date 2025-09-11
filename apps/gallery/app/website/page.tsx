import type { Metadata } from "next";
import Link from "next/link";
import { getUniqueWebsites, loadEntries } from "@/lib/loadEntries";
import {
	getFaviconUrl,
	getWebsiteBackgroundColor,
	getWebsiteDescription,
	getWebsiteName,
} from "@/lib/loadWebsites";

export const metadata: Metadata = {
	title: "Websites - Browse Design Examples",
	description:
		"Discover and explore websites with great UX design patterns. Browse examples by website and see their design implementations.",
};

export default async function WebsitePage() {
	const allEntries = await loadEntries();
	const websites = getUniqueWebsites(allEntries);

	// Group entries by website
	const entriesByWebsite = websites.reduce(
		(acc, website) => {
			const websiteEntries = allEntries.filter(
				(entry) => entry.website === website,
			);
			if (websiteEntries.length > 0) {
				acc[website] = websiteEntries;
			}
			return acc;
		},
		{} as Record<string, typeof allEntries>,
	);

	return (
		<div className="min-h-screen">
			{/* Page Header */}
			<div className="bg-fd-card border-b border-fd-border">
				<div className="container-responsive py-8">
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-fd-foreground mb-2">
							Websites
						</h1>
						<p className="text-fd-muted-foreground">
							Discover websites with great UX design patterns and interactions
						</p>
					</div>
				</div>
			</div>

			{/* Results */}
			<div className="container-responsive py-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{Object.entries(entriesByWebsite).map(([website, entries]) => {
						// Get the first entry for the preview image
						const _firstEntry = entries[0];

						return (
							<Link
								key={website}
								href={`/website/${encodeURIComponent(website)}`}
								className="group cursor-pointer text-left w-full"
							>
								<div className="bg-fd-card border border-fd-border rounded-lg overflow-hidden hover:border-fd-border/80 transition-colors">
									{/* Website Icon */}
									<div
										className="aspect-video relative overflow-hidden flex items-center justify-center"
										style={{
											backgroundColor:
												getWebsiteBackgroundColor(website) || undefined,
										}}
									>
										{/* biome-ignore lint/performance/noImgElement: favicon from external URL */}
										<img
											src={getFaviconUrl(website)}
											alt={`${getWebsiteName(website)} logo`}
											className="w-16 h-16 object-contain"
										/>
									</div>

									{/* Website Content */}
									<div className="p-4">
										<h3 className="font-medium text-fd-foreground line-clamp-2 mb-2">
											{getWebsiteName(website)}
										</h3>
										{getWebsiteDescription(website) && (
											<p className="text-sm text-fd-muted-foreground line-clamp-2">
												{getWebsiteDescription(website)}
											</p>
										)}
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
