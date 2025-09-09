import type { SearchParams } from "next/dist/server/request/search-params";
import { Suspense } from "react";
import type { Entry } from "@/lib/types";
import { EmptyState } from "../common/empty-state";
import { GalleryClient } from "../common/gallery-client";

type EntriesGridProps = {
	filteredEntries: Entry[];
	searchParamsResolved: SearchParams;
};

export default function EntriesGrid({
	filteredEntries,
	searchParamsResolved,
}: EntriesGridProps) {
	return (
		<div className="container-responsive py-8">
			{filteredEntries.length === 0 ? (
				<EmptyState
					message="No examples found matching your filters."
					subMessage="Try adjusting your search or filter criteria."
				/>
			) : (
				<>
					<h2 className="text-lg font-semibold text-fd-foreground mb-6">
						{filteredEntries.length}{" "}
						{filteredEntries.length === 1 ? "example" : "examples"}
					</h2>

					<Suspense
						fallback={
							<div className="text-fd-muted-foreground">Loading gallery...</div>
						}
					>
						<GalleryClient entries={filteredEntries} />
					</Suspense>
				</>
			)}
		</div>
	);
}
