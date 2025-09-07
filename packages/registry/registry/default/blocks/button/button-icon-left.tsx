import { Mail, Save, Upload } from "lucide-react";
import { Button } from "@/ui/button";

export default function ButtonIconLeft() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button>
				<Mail className="h-4 w-4" />
				Send Email
			</Button>
			<Button variant="outline">
				<Save className="h-4 w-4" />
				Save Document
			</Button>
			<Button variant="soft">
				<Upload className="h-4 w-4" />
				Upload File
			</Button>
		</div>
	);
}
