import { Button } from "../ui/button";

export default function ButtonGroups() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h4 className="text-sm font-medium">Horizontal Group</h4>
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
				<h4 className="text-sm font-medium">Attached Group</h4>
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
				<h4 className="text-sm font-medium">Icon Button Group</h4>
				<div className="inline-flex rounded-md shadow-sm" role="group">
					<Button
						variant="outline"
						size="icon"
						className="rounded-r-none border-r-0"
					>
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							/>
						</svg>
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="rounded-none border-r-0"
					>
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</Button>
					<Button variant="outline" size="icon" className="rounded-l-none">
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
							/>
						</svg>
					</Button>
				</div>
			</div>
		</div>
	);
}
