import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export default function ButtonIconRight() {
	return (
		<Button>
			Continue
			<ChevronRight className="h-4 w-4" />
		</Button>
	);
}
