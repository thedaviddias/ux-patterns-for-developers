/**
 * @registry
 * @name button-icon-right
 * @title Button with Right Icons
 * @type registry:block
 * @description Button with icons positioned on the right side
 * @categories ["buttons", "icons", "layout"]
 * @tags ["icons", "right", "layout", "lucide", "positioning", "navigation"]
 * @dependencies ["lucide-react"]
 * @registryDependencies ["button"]
 */
import { ArrowRight, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/ui/button";

export default function ButtonIconRight() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button>
				Continue
				<ChevronRight className="h-4 w-4" />
			</Button>
			<Button variant="outline">
				Next Step
				<ArrowRight className="h-4 w-4" />
			</Button>
			<Button variant="link">
				Learn More
				<ExternalLink className="h-4 w-4" />
			</Button>
		</div>
	);
}
