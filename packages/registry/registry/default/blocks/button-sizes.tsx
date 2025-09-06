import { Settings } from "lucide-react";
import { Button } from "../ui/button";

export default function ButtonSizes() {
	return (
		<div className="flex items-center gap-4">
			<Button size="sm" type="button">
				Small
			</Button>
			<Button size="default" type="button">
				Default
			</Button>
			<Button size="lg" type="button">
				Large
			</Button>
			<Button size="icon" type="button">
				<Settings className="h-4 w-4" />
			</Button>
		</div>
	);
}
