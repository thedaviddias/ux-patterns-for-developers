/**
 * @registry
 * @name button-loading-states
 * @title Loading States Button
 * @type registry:block
 * @description Button with various loading states and animations
 * @categories ["buttons", "loading", "states"]
 * @tags ["loading", "animation", "states", "interactive", "feedback"]
 * @dependencies ["react"]
 * @registryDependencies ["button"]
 */
"use client";

import { useState } from "react";
import { Button } from "@/ui/button";

export default function ButtonLoadingStates() {
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = () => {
		setIsLoading(true);
		setTimeout(() => setIsLoading(false), 2000);
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-2">
				<Button
					state={isLoading ? "loading" : "idle"}
					onClick={handleClick}
					loadingType="spinner"
				>
					Save Changes
				</Button>
				<Button state="loading" loadingType="spinner">
					Loading Spinner
				</Button>
				<Button state="loading" loadingType="dots">
					Loading Dots
				</Button>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Button state="loading" loadingText="Processing...">
					Custom Loading Text
				</Button>
				<Button state="success" successText="Saved!">
					Success State
				</Button>
				<Button state="error" errorText="Failed">
					Error State
				</Button>
			</div>
		</div>
	);
}
