/**
 * @registry
 * @name button-icon-only
 * @title Icon-Only Buttons
 * @type registry:block
 * @description Button with only icons, no text labels
 * @categories ["buttons", "icons", "compact"]
 * @tags ["icons", "only", "compact", "minimal", "aria-label", "accessibility"]
 * @dependencies ["lucide-react"]
 * @registryDependencies ["button"]
 */
import { Edit, Heart, Save, Settings, Share2, Trash2 } from "lucide-react";
import { Button } from "@/ui/button";

export default function ButtonIconOnly() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button aria-label="Save" type="button">
				<Save className="h-4 w-4" />
			</Button>
			<Button aria-label="Delete" type="button">
				<Trash2 className="h-4 w-4" />
			</Button>
			<Button aria-label="Edit" type="button">
				<Edit className="h-4 w-4" />
			</Button>
			<Button aria-label="Settings" variant="outline" type="button">
				<Settings className="h-4 w-4" />
			</Button>
			<Button aria-label="Share" variant="ghost" type="button">
				<Share2 className="h-4 w-4" />
			</Button>
			<Button aria-label="Favorite" variant="soft" type="button">
				<Heart className="h-4 w-4" />
			</Button>
		</div>
	);
}
