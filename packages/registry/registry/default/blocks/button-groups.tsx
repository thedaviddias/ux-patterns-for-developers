import { Edit, Share, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function ButtonGroups() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<span className="text-sm font-medium">Horizontal Group</span>
				<div className="flex">
					<Button className="rounded-r-none border-r-0">Left</Button>
					<Button variant="outline" className="rounded-none border-r-0">
						Center
					</Button>
					<Button variant="outline" className="rounded-l-none">
						Right
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium">Attached Group</span>
				{/** biome-ignore lint/a11y/useSemanticElements: exception for this case */}
				<div className="inline-flex rounded-md shadow-sm" role="group">
					<Button variant="outline" className="rounded-r-none border-r-0">
						Years
					</Button>
					<Button variant="outline" className="rounded-none border-r-0">
						Months
					</Button>
					<Button variant="outline" className="rounded-l-none">
						Days
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium">Icon Button Group</span>
				{/** biome-ignore lint/a11y/useSemanticElements: exception for this case */}
				<div className="inline-flex rounded-md shadow-sm" role="group">
					<Button
						variant="outline"
						size="icon"
						className="rounded-r-none border-r-0"
					>
						<Edit className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="rounded-none border-r-0"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="icon" className="rounded-l-none">
						<Share className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
