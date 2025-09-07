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
					<Button>
						<Plus className="h-4 w-4" />
						Add Item
					</Button>
					<Button variant="outline">
						<Heart className="h-4 w-4" />
						Like
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Icon on the Right</h4>
				<div className="flex flex-wrap gap-2">
					<Button>
						Continue
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button variant="outline">
						Download
						<Download className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Icon Only</h4>
				<div className="flex flex-wrap gap-2">
					<Button aria-label="Edit">
						<Edit className="h-4 w-4" />
					</Button>
					<Button variant="outline" aria-label="Delete">
						<Trash className="h-4 w-4" />
					</Button>
					<Button variant="ghost" aria-label="Share">
						<Share2 className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
