/**
 * @registry
 * @name button-states
 * @title Interactive Button States
 * @type registry:block
 * @description Button component showcasing different interactive states
 * @categories ["buttons", "states", "interactive"]
 * @tags ["states", "interactive", "idle", "loading", "success", "error", "disabled", "dynamic"]
 * @dependencies ["react"]
 * @registryDependencies ["button"]
 */
"use client";

import { useState } from "react";
import { Button } from "@/ui/button";

export default function ButtonStates() {
	const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
		"idle",
	);

	const handleClick = async () => {
		setState("loading");
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setState(Math.random() > 0.5 ? "success" : "error");
		setTimeout(() => setState("idle"), 2000);
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2">
				<Button state="idle">Idle State</Button>
				<Button state="loading">Loading State</Button>
				<Button state="success">Success State</Button>
				<Button state="error">Error State</Button>
				<Button state="disabled">Disabled State</Button>
			</div>
			<div>
				<Button
					state={state}
					onClick={handleClick}
					loadingText="Processing..."
					successText="Complete!"
					errorText="Try Again"
				>
					Click to Test States
				</Button>
			</div>
		</div>
	);
}
