import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

export default function ButtonSplit() {
	return (
		<div className="flex">
			<Button className="rounded-r-none">Export</Button>
			<Button
				size="icon"
				variant="outline"
				className="rounded-l-none border-l-0"
			>
				<ChevronDown className="h-4 w-4" />
			</Button>
		</div>
	);
}
