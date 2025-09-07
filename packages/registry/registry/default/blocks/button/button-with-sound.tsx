"use client";

import { Button } from "@/ui/button";

export default function ButtonWithSound() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button sound="subtle">Subtle Sound</Button>
			<Button sound="click">Click Sound</Button>
			<Button sound="off">No Sound</Button>
		</div>
	);
}