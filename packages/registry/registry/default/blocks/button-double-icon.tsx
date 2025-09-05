import { ArrowRight, Mail } from "lucide-react";
import { Button } from "../ui/button";

export default function ButtonDoubleIcon() {
	return (
		<Button>
			<Mail className="h-4 w-4" />
			Send Email
			<ArrowRight className="h-4 w-4" />
		</Button>
	);
}
