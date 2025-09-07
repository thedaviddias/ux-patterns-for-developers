/**
 * @registry
 * @name button-with-sound
 * @title Sound Effects Buttons
 * @type registry:block
 * @description Button with audio feedback and sound effects
 * @categories ["buttons", "sound", "audio"]
 * @tags ["sound", "audio", "feedback", "effects", "interactive", "accessibility"]
 * @registryDependencies ["button"]
 */
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
