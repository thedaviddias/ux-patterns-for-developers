"use client";

import { parseAsString, useQueryState } from "nuqs";
import type { Entry } from "@/lib/types";
import { EntryCard } from "../entries/entry-card";
import { EntryModal } from "../entries/entry-modal";

interface GalleryClientProps {
	entries: Entry[];
}

export function GalleryClient({ entries }: GalleryClientProps) {
	const [selectedEntryId, setSelectedEntryId] = useQueryState(
		"view",
		parseAsString.withDefault(""),
	);

	const selectedEntry = entries.find((entry) => entry.id === selectedEntryId);
	const selectedIndex = selectedEntry
		? entries.findIndex((entry) => entry.id === selectedEntryId)
		: -1;

	const handleEntryClick = (entry: Entry) => {
		setSelectedEntryId(entry.id);
	};

	const handleCloseModal = () => {
		setSelectedEntryId("");
	};

	const handlePrevious = () => {
		if (selectedIndex > 0) {
			setSelectedEntryId(entries[selectedIndex - 1].id);
		}
	};

	const handleNext = () => {
		if (selectedIndex < entries.length - 1) {
			setSelectedEntryId(entries[selectedIndex + 1].id);
		}
	};

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{entries.map((entry) => (
					<EntryCard
						key={entry.id}
						entry={entry}
						onClick={() => handleEntryClick(entry)}
					/>
				))}
			</div>

			{selectedEntry && (
				<EntryModal
					entry={selectedEntry}
					isOpen={!!selectedEntryId}
					onClose={handleCloseModal}
					onPrevious={selectedIndex > 0 ? handlePrevious : undefined}
					onNext={selectedIndex < entries.length - 1 ? handleNext : undefined}
					hasPrevious={selectedIndex > 0}
					hasNext={selectedIndex < entries.length - 1}
				/>
			)}
		</>
	);
}
