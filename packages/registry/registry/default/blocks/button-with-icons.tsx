import {
	ChevronRight,
	Download,
	Edit,
	Heart,
	Plus,
	Share,
	Trash2,
} from "lucide-react";
import { Button } from "../ui/button";

export default function ButtonWithIcons() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<span className="text-sm font-medium">Icon on the Left</span>
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
				<span className="text-sm font-medium">Icon on the Right</span>
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
				<span className="text-sm font-medium">Icon Only</span>
				<div className="flex flex-wrap gap-2">
					<Button size="icon" type="button">
						<Edit className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="icon" type="button">
						<Trash2 className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="icon" type="button">
						<Share className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
