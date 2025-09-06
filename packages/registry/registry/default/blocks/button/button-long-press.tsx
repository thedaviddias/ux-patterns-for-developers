"use client";

import { Button } from "@/ui/button";

export default function ButtonLongPress() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button
				longPress={{
					duration: 500,
					onLongPress: () => alert("Long pressed for 500ms!"),
				}}
			>
				Hold 0.5s
			</Button>
			<Button
				longPress={{
					duration: 1000,
					onLongPress: () => alert("Long pressed for 1 second!"),
				}}
			>
				Hold 1s
			</Button>
			<Button
				longPress={{
					duration: 2000,
					onLongPress: () => alert("Long pressed for 2 seconds!"),
				}}
			>
				Hold 2s
			</Button>
		</div>
	);
}