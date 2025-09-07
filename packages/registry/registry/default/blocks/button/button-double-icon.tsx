/**
 * @registry
 * @name button-double-icon
 * @title Double Icon Button
 * @type registry:block
 * @description Button with icons on both left and right sides
 * @categories ["buttons", "icons", "layout"]
 * @tags ["double-icon", "icons", "left-right", "layout", "lucide", "complex"]
 * @dependencies ["lucide-react"]
 * @registryDependencies ["button"]
 */
import {
	ArrowRight,
	ChevronRight,
	Download,
	ExternalLink,
	Lock,
	Mail,
} from "lucide-react";
import { Button } from "@/ui/button";

export default function ButtonDoubleIcon() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button>
				<Mail aria-hidden="true" className="h-4 w-4" />
				Send Email
				<ArrowRight aria-hidden="true" className="h-4 w-4" />
			</Button>
			<Button variant="outline">
				<Download aria-hidden="true" className="h-4 w-4" />
				Export PDF
				<ExternalLink aria-hidden="true" className="h-4 w-4" />
			</Button>
			<Button variant="soft">
				<Lock aria-hidden="true" className="h-4 w-4" />
				View Details
				<ChevronRight aria-hidden="true" className="h-4 w-4" />
			</Button>
		</div>
	);
}
