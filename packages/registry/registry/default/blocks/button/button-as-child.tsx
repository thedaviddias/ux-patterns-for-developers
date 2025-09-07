import { Button } from "@/ui/button";

export default function ButtonAsChild() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button asChild>
				<a href="#pricing" className="no-underline">View Pricing</a>
			</Button>
			<Button variant="outline" asChild>
				<a href="#docs" className="no-underline">Documentation</a>
			</Button>
			<Button variant="ghost" asChild>
				<a href="#about">About Us</a>
			</Button>
		</div>
	);
}
