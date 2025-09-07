import { Mail, ArrowRight, Download, ExternalLink, Lock, ChevronRight } from "lucide-react";
import { Button } from "@/ui/button";

export default function ButtonDoubleIcon() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button>
				<Mail className="h-4 w-4" />
				Send Email
				<ArrowRight className="h-4 w-4" />
			</Button>
			<Button variant="outline">
				<Download className="h-4 w-4" />
				Export PDF
				<ExternalLink className="h-4 w-4" />
			</Button>
			<Button variant="soft">
				<Lock className="h-4 w-4" />
				View Details
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}