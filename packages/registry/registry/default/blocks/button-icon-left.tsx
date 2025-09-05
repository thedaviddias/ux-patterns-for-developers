import { Check } from "lucide-react";
import { Button } from "../ui/button";

export default function ButtonIconLeft() {
	return (
		<Button>
			<Check className="h-4 w-4" />
			Send Email
		</Button>
	);
}
