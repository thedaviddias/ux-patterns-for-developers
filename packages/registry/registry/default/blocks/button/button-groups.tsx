/**
 * @registry
 * @name button-groups
 * @title Button Groups & Toolbars
 * @type registry:block
 * @description Button components arranged in connected groups
 * @categories ["buttons", "groups", "layout"]
 * @tags ["groups", "connected", "layout", "segmented", "toolbar", "lucide"]
 * @dependencies ["lucide-react"]
 * @registryDependencies ["button"]
 */
import { Edit, Share2, Trash2 } from "lucide-react";
import { Button } from "@/ui/button";

export default function ButtonGroups() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h4 className="text-sm font-medium">Horizontal Group</h4>
				<div className="flex">
					<Button className="rounded-r-none border-r-0" type="button">Left</Button>
					<Button variant="outline" className="rounded-none border-r-0" type="button">
						Center
					</Button>
					<Button variant="outline" className="rounded-l-none" type="button">
						Right
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Attached Group</h4>
				<div className="inline-flex rounded-md shadow-sm" role="group">
					<Button variant="outline" className="rounded-r-none border-r-0" type="button">
						Years
					</Button>
					<Button variant="outline" className="rounded-none border-r-0" type="button">
						Months
					</Button>
					<Button variant="outline" className="rounded-l-none" type="button">
						Days
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Icon Button Group</h4>
				<div className="inline-flex rounded-md shadow-sm" role="group">
					<Button
						variant="outline"
						aria-label="Edit"
						className="rounded-r-none border-r-0"
						type="button"
					>
						<Edit className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						aria-label="Delete"
						className="rounded-none border-r-0"
						type="button"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						aria-label="Share"
						className="rounded-l-none"
						type="button"
					>
						<Share2 className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
