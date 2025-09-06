import { Button } from "../ui/button";

export default function ButtonDialogFooter() {
	return (
		<div className="rounded-lg border p-6 space-y-4">
			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Delete Item?</h3>
				<p className="text-sm text-muted-foreground">
					This action cannot be undone. This will permanently delete your item
					and remove your data from our servers.
				</p>
			</div>
			<div className="flex justify-end gap-2">
				<Button type="button" variant="outline">
					Cancel
				</Button>
				<Button type="button" variant="destructive">
					Delete
				</Button>
			</div>
		</div>
	);
}
