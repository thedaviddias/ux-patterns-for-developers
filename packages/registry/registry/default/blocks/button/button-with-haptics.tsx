/**
 * @registry
 * @name button-with-haptics
 * @title Haptic Feedback Buttons
 * @type registry:block
 * @description Button with haptic feedback for mobile devices
 * @categories ["buttons", "haptics", "mobile"]
 * @tags ["haptics", "mobile", "feedback", "touch", "vibration", "interactive"]
 * @registryDependencies ["button"]
 */
"use client";

import { Button } from "@/ui/button";

export default function ButtonWithHaptics() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button haptics="light">Light Haptic</Button>
			<Button haptics="medium">Medium Haptic</Button>
			<Button haptics="heavy">Heavy Haptic</Button>
			<Button haptics="off">No Haptic</Button>
		</div>
	);
}
