import Hero from "@/components/sections/hero";
import { OverviewGrid } from "@/components/sections/overview-grid";

export default function HomePage() {
	return (
		<main className="flex flex-1 flex-col">
			<Hero />
			<OverviewGrid />
		</main>
	);
}
