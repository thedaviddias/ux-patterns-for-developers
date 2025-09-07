/**
 * @registry
 * @name button-aria-features
 * @title Accessible Button Features
 * @type registry:block
 * @description Button with accessibility features and ARIA attributes
 * @categories ["buttons", "accessibility", "aria"]
 * @tags ["accessibility", "aria", "screen-reader", "inclusive", "a11y"]
 * @dependencies ["lucide-react", "react"]
 * @registryDependencies ["button"]
 */
"use client";

import { Edit, Save, Share2, Trash2 } from "lucide-react";
import { useId } from "react";
import { Button } from "@/ui/button";

export default function ButtonAriaFeatures() {
	const helpTextId = useId();

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2">
				<Button aria-label="Save document" type="button">
					<Save className="h-4 w-4" />
				</Button>
				<Button aria-label="Delete item" type="button">
					<Trash2 className="h-4 w-4" />
				</Button>
				<Button aria-label="Edit content" type="button">
					<Edit className="h-4 w-4" />
				</Button>
				<Button aria-label="Share post" type="button">
					<Share2 className="h-4 w-4" />
				</Button>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button aria-disabled={true} type="button">
					ARIA Disabled
				</Button>
				<Button announceChanges state="loading" type="button">
					With Screen Reader Announcements
				</Button>
				<Button aria-busy={true} type="button">
					ARIA Busy State
				</Button>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					aria-describedby={helpTextId}
					tooltipWhenDisabled="Feature coming soon"
				>
					With Description
				</Button>
				<span id={helpTextId} className="sr-only">
					This button saves your current progress
				</span>
			</div>
		</div>
	);
}
