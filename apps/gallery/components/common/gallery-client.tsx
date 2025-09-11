import type { Entry } from "@/lib/types";
import { EntryCard } from "../entries/entry-card";

interface GalleryClientProps {
	entries: Entry[];
}

export function GalleryClient({ entries }: GalleryClientProps) {
	return (
		<>
			{entries.length === 0 ? (
				<div className="text-center py-12">
					<div className="text-fd-muted-foreground mb-4">
						<svg
							className="mx-auto h-12 w-12 text-fd-muted-foreground/50"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1}
								d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-fd-foreground mb-2">
						No patterns found
					</h3>
					<p className="text-fd-muted-foreground">
						Try adjusting your filters or search terms to find more patterns.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{entries.map((entry) => (
						<EntryCard key={entry.id} entry={entry} />
					))}
				</div>
			)}
		</>
	);
}
