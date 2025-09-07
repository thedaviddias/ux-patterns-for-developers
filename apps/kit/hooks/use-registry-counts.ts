import { useMemo } from "react";
import registryData from "@/public/r/registry.json";

export type StatCount = {
	components: number;
	blocks: number;
	examples: number;
	total: number;
};

/**
 *  Custom hook to get the counts of components, blocks, and examples from the registry data.
 * @returns
 */
export function useRegistryCounts(): StatCount {
	const counts = useMemo(() => {
		const initialCounts = registryData.items.reduce(
			(acc: StatCount, item: { type: string }) => {
				if (item.type === "registry:component") {
					acc.components += 1;
				} else if (item.type === "registry:block") {
					acc.blocks += 1;
				} else if (item.type === "registry:example") {
					acc.examples += 1;
				} else if (item.type === "registry:page") {
					acc.examples += 1; // Treat pages as examples for counting purposes
				}
				return acc;
			},
			{ blocks: 0, components: 0, examples: 0, total: 0 },
		);

		const total =
			initialCounts.components + initialCounts.blocks + initialCounts.examples;

		return { ...initialCounts, total };
	}, []);

	return counts;
}
