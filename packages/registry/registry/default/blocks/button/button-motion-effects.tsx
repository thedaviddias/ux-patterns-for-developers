/**
 * @registry
 * @name button-motion-effects
 * @title Motion Effects Button
 * @type registry:block
 * @description Button with various motion effects and animations
 * @categories ["buttons", "motion", "animation"]
 * @tags ["motion", "animation", "effects", "interactive", "framer-motion"]
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
					<Button clickEffect="none">No Effect</Button>
					<Button clickEffect="scale">Scale</Button>
					<Button clickEffect="ripple">Ripple</Button>
					<Button clickEffect="pulse">Pulse</Button>
					<Button clickEffect="spring">Spring</Button>
				</div>
			</div>

			{/* Hover Effects */}
			<div>
				<h3 className="text-sm font-medium mb-2">Hover Effects</h3>
				<div className="flex flex-wrap gap-2">
					<Button hoverEffect="none">No Effect</Button>
					<Button hoverEffect="glow">Glow</Button>
					<Button hoverEffect="shine">Shine</Button>
					<Button hoverEffect="shimmer">Shimmer</Button>
					<Button hoverEffect="lift">Lift</Button>
				</div>
			</div>
		</div>
	);
}
