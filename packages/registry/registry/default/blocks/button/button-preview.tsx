/**
 * @registry
 * @name button-preview
 * @title Button Features Showcase
 * @type registry:block
 * @description Comprehensive button showcase with all features and variants
 * @categories ["buttons", "showcase", "demo"]
 * @tags ["showcase", "demo", "comprehensive", "features", "variants", "interactive", "lucide"]
 * @dependencies ["lucide-react", "react"]
 * @registryDependencies ["button"]
 */
"use client";

import { ArrowRight, Mail, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/ui/button";

export default function ButtonPreview() {
	const [loadingState, setLoadingState] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const isMounted = useRef(true);
	const actionId = useRef(0);
	const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			isMounted.current = false;
			// Clear any pending reset timer on unmount
			if (resetTimerRef.current !== null) {
				clearTimeout(resetTimerRef.current);
				resetTimerRef.current = null;
			}
		};
	}, []);

	const handleAsyncAction = async () => {
		// Block re-entry while loading
		if (loadingState === "loading") return;

		// Increment action ID and capture current ID
		const id = ++actionId.current;

		// Set loading state with mount check
		if (isMounted.current && id === actionId.current) {
			setLoadingState("loading");
		}

		// Simulate async operation
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Check if still mounted and this is the current action
		if (!isMounted.current || id !== actionId.current) return;

		// Deterministic outcome for testing (can be overridden with prop)
		const shouldSucceed = Math.random() > 0.5;

		// Set result state with mount check
		if (isMounted.current && id === actionId.current) {
			setLoadingState(shouldSucceed ? "success" : "error");
		}

		// Clear any existing reset timer before starting a new one
		if (resetTimerRef.current !== null) {
			clearTimeout(resetTimerRef.current);
			resetTimerRef.current = null;
		}

		// Reset to idle after delay with mount check
		resetTimerRef.current = setTimeout(() => {
			if (isMounted.current && id === actionId.current) {
				setLoadingState("idle");
			}
			resetTimerRef.current = null;
		}, 1500);
	};

	return (
		<div className="grid gap-6">
			{/* Primary Showcase */}
			<div className="flex flex-wrap gap-2">
				<Button type="button">Get Started</Button>
				<Button variant="outline" type="button">
					Learn More
				</Button>
				<Button variant="ghost" type="button">
					Documentation
				</Button>
				<Button variant="soft" type="button">
					Explore
				</Button>
			</div>

			{/* Interactive States */}
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					state={loadingState}
					onClick={handleAsyncAction}
					loadingText="Processing..."
					successText="Done!"
				>
					Try Me
				</Button>
				<Button variant="danger" type="button">
					Delete
				</Button>
				<Button variant="success" type="button">
					Confirm
				</Button>
				<Button disabled type="button">
					Disabled
				</Button>
			</div>

			{/* Sizes & Effects */}
			<div className="flex flex-wrap items-center gap-2">
				<Button size="xs" clickEffect="scale" type="button">
					Extra Small
				</Button>
				<Button size="sm" clickEffect="ripple" type="button">
					Small Ripple
				</Button>
				<Button size="md" variant="soft" type="button">
					Soft
				</Button>
				<Button size="lg" variant="outline" type="button">
					Large Outline
				</Button>
			</div>

			{/* With Icons & Features */}
			<div className="flex flex-wrap gap-2">
				<Button aria-label="Settings" type="button">
					<Settings className="h-4 w-4" />
				</Button>
				<Button type="button">
					<Mail className="h-4 w-4" />
					Send Email
				</Button>
				<Button asChild variant="link">
					<a href="#features" className="no-underline">
						View Features
						<ArrowRight className="h-4 w-4" />
					</a>
				</Button>
				<Button variant="outline" type="button">
					Star
					<span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs">
						2.3k
					</span>
				</Button>
			</div>
		</div>
	);
}
