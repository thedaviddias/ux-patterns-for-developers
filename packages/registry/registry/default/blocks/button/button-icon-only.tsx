import { Edit, Heart, Save, Settings, Share2, Trash2 } from "lucide-react";
import { Button } from "@/ui/button";

export default function ButtonIconOnly() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button aria-label="Save">
				<Save className="h-4 w-4" />
			</Button>
			<Button aria-label="Delete">
				<Trash2 className="h-4 w-4" />
			</Button>
			<Button aria-label="Edit">
				<Edit className="h-4 w-4" />
			</Button>
			<Button aria-label="Settings" variant="outline">
				<Settings className="h-4 w-4" />
			</Button>
			<Button aria-label="Share" variant="ghost">
				<Share2 className="h-4 w-4" />
			</Button>
			<Button aria-label="Favorite" variant="soft">
				<Heart className="h-4 w-4" />
			</Button>
		</div>
	);
}
