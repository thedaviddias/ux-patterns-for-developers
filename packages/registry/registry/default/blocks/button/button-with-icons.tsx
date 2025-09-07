/**
 * @registry
 * @name button-with-icons
 * @title Button Icon Patterns
 * @type registry:block
 * @description Button component showcasing various icon positioning patterns
 * @categories ["buttons", "icons", "patterns"]
 * @tags ["icons", "patterns", "positioning", "left", "right", "only", "lucide", "accessibility"]
 * @dependencies ["lucide-react"]
 * @registryDependencies ["button"]
 */
import {
	ChevronRight,
	Download,
	Edit,
	Heart,
	Plus,
	Share2,
	Trash,
} from "lucide-react";
import { Button } from "@/ui/button";

export default function ButtonWithIcons() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h4 className="text-sm font-medium">Icon on the Left</h4>
				<div className="flex flex-wrap gap-2">
					<Button type="button">
						<Plus className="h-4 w-4" />
						Add Item
					</Button>
					<Button variant="outline" type="button">
						<Heart className="h-4 w-4" />
						Like
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Icon on the Right</h4>
				<div className="flex flex-wrap gap-2">
					<Button type="button">
						Continue
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button variant="outline" type="button">
						Download
						<Download className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Icon Only</h4>
				<div className="flex flex-wrap gap-2">
					<Button aria-label="Edit" type="button">
						<Edit className="h-4 w-4" />
					</Button>
					<Button variant="outline" aria-label="Delete" type="button">
						<Trash className="h-4 w-4" />
					</Button>
					<Button variant="ghost" aria-label="Share" type="button">
						<Share2 className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
