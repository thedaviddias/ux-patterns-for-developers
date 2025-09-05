import { Button } from "../ui/button";

export default function ButtonWithCounter() {
	return (
		<Button variant="outline">
			<span>Star</span>
			<span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
				729
			</span>
		</Button>
	);
}
