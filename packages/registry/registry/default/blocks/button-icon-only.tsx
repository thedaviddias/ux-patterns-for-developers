import { Settings } from "lucide-react";
import { Button } from "../ui/button";

export default function ButtonIconOnly() {
	return (
		<Button size="icon" aria-label="Settings">
			<Settings className="h-4 w-4" />
		</Button>
	);
}
