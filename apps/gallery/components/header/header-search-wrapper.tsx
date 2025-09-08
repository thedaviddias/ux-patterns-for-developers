import { getUniquePatterns, loadEntries } from "@/lib/loadEntries";
import { HeaderSearch } from "./header-search";

export async function HeaderSearchWrapper() {
	const entries = await loadEntries();
	const patterns = getUniquePatterns(entries);

	return <HeaderSearch entries={entries} patterns={patterns} />;
}
