import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import { OverviewGrid } from "@/components/sections/overview-grid";

export const metadata: Metadata = {
	title: "UX Patterns for Developers",
	description:
		"A comprehensive collection of UX patterns for developers to build effective, accessible, and usable UI components.",
};

export default function HomePage() {
	return (
		<main className="flex flex-1 flex-col">
			<Hero />
			<OverviewGrid />
		</main>
	);
}
