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
import { useState } from "react";
import { Button } from "@/ui/button";

export default function ButtonPreview() {
	const [loadingState, setLoadingState] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const handleAsyncAction = async () => {
		setLoadingState("loading");
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setLoadingState("success");
		setTimeout(() => setLoadingState("idle"), 1500);
	};

	return (
		<div className="grid gap-6">
			{/* Primary Showcase */}
			<div className="flex flex-wrap gap-2">
				<Button>Get Started</Button>
				<Button variant="outline">Learn More</Button>
				<Button variant="ghost">Documentation</Button>
				<Button variant="soft">Explore</Button>
			</div>

			{/* Interactive States */}
			<div className="flex flex-wrap gap-2">
				<Button
					state={loadingState}
					onClick={handleAsyncAction}
					loadingText="Processing..."
					successText="Done!"
				>
					Try Me
				</Button>
				<Button variant="danger">Delete</Button>
				<Button variant="success">Confirm</Button>
				<Button disabled>Disabled</Button>
			</div>

			{/* Sizes & Effects */}
			<div className="flex flex-wrap items-center gap-2">
				<Button size="xs" clickEffect="scale">
					Extra Small
				</Button>
				<Button size="sm" clickEffect="ripple">
					Small Ripple
				</Button>
				<Button size="md" variant="soft">
					Soft
				</Button>
				<Button size="lg" variant="outline">
					Large Outline
				</Button>
			</div>

			{/* With Icons & Features */}
			<div className="flex flex-wrap gap-2">
				<Button aria-label="Settings">
					<Settings className="h-4 w-4" />
				</Button>
				<Button>
					<Mail className="h-4 w-4" />
					Send Email
				</Button>
				<Button asChild variant="link">
					<a href="#features" className="no-underline">
						View Features
						<ArrowRight className="h-4 w-4" />
					</a>
				</Button>
				<Button variant="outline">
					Star
					<span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs">
						2.3k
					</span>
				</Button>
			</div>
		</div>
	);
}
