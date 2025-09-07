/**
 * @registry
 * @name button-motion-effects
 * @title Motion Effects Button
 * @type registry:block
 * @description Button with various motion effects and animations
 * @categories ["buttons", "motion", "animation"]
 * @tags ["motion", "animation", "effects", "interactive"]
 * @registryDependencies ["button"]
 */
"use client";

import { Button } from "@/ui/button";

export default function ButtonMotionEffects() {
	return (
		<div className="flex flex-col gap-4">
			{/* Click Effects */}
			<div>
				<h3 className="text-sm font-medium mb-2">Click Effects</h3>
				<div className="flex flex-wrap gap-2">
					<Button clickEffect="none" type="button">No Effect</Button>
					<Button clickEffect="scale" type="button">Scale</Button>
					<Button clickEffect="ripple" type="button">Ripple</Button>
					<Button clickEffect="pulse" type="button">Pulse</Button>
					<Button clickEffect="spring" type="button">Spring</Button>
				</div>
			</div>

			{/* Hover Effects */}
			<div>
				<h3 className="text-sm font-medium mb-2">Hover Effects</h3>
				<div className="flex flex-wrap gap-2">
					<Button hoverEffect="none" type="button">No Effect</Button>
					<Button hoverEffect="glow" type="button">Glow</Button>
					<Button hoverEffect="lift" type="button">Lift</Button>
				</div>
			</div>
		</div>
	);
}
