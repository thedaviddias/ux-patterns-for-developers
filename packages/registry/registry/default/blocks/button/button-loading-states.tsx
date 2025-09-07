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

import { useEffect, useRef, useState } from "react";
import { Button } from "@/ui/button";

export default function ButtonLoadingStates() {
	const [isLoading, setIsLoading] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleClick = () => {
		// Guard on timeoutRef to prevent re-entry within the same tick
		if (timeoutRef.current !== null) return;

		// Set timeoutRef immediately when accepting the click
		timeoutRef.current = setTimeout(() => {
			setIsLoading(false);
			timeoutRef.current = null;
		}, 2000);

		setIsLoading(true);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-2">
				<Button
					type="button"
					state={isLoading ? "loading" : "idle"}
					onClick={handleClick}
					loadingType="spinner"
				>
					Save Changes
				</Button>
				<Button state="loading" loadingType="spinner" type="button">
					Loading Spinner
				</Button>
				<Button state="loading" loadingType="dots" type="button">
					Loading Dots
				</Button>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Button state="loading" loadingText="Processing..." type="button">
					Custom Loading Text
				</Button>
				<Button state="success" successText="Saved!" type="button">
					Success State
				</Button>
				<Button state="error" errorText="Failed" type="button">
					Error State
				</Button>
			</div>
		</div>
	);
}
