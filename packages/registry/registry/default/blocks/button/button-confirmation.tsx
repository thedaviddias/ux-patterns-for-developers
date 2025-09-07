/**
 * @registry
 * @name button-confirmation
 * @title Confirmation & Destructive Actions
 * @type registry:block
 * @description Button with confirmation patterns and destructive actions
 * @categories ["buttons", "confirmation", "destructive-actions"]
 * @tags ["confirmation", "destructive", "safety", "interactive", "haptics", "sound"]
 * @dependencies ["lucide-react", "react"]
 * @registryDependencies ["button"]
 */
"use client";

import { AlertTriangle, Check, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/ui/button";

export default function ButtonConfirmation() {
	const [deleteState, setDeleteState] = useState<"idle" | "confirming">("idle");
	const [archiveState, setArchiveState] = useState<"idle" | "confirming">(
		"idle",
	);

	return (
		<div className="flex flex-col gap-4">
			{/* Delete with confirmation */}
			<div className="flex items-center gap-2" aria-live="polite">
				{deleteState === "idle" ? (
					<Button
						type="button"
						variant="danger"
						onClick={() => setDeleteState("confirming")}
						haptics="medium"
					>
						<Trash2 className="h-4 w-4" />
						Delete
					</Button>
				) : (
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium">Are you sure?</span>
						<Button
							type="button"
							variant="danger"
							size="sm"
							onClick={() => {
								// Perform delete action
								setDeleteState("idle");
							}}
							haptics="heavy"
							sound="click"
						>
							<Check className="h-4 w-4" />
							Yes, delete
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setDeleteState("idle")}
							haptics="light"
						>
							<X className="h-4 w-4" />
							Cancel
						</Button>
					</div>
				)}
			</div>

			{/* Archive with inline confirmation */}
			<div className="flex items-center gap-2">
				{archiveState === "idle" ? (
					<Button
						type="button"
						variant="outline"
						onClick={() => setArchiveState("confirming")}
						haptics="light"
					>
						Archive Item
					</Button>
				) : (
					<div className="inline-flex rounded-lg border border-amber-200 bg-amber-50 p-1 dark:border-amber-900 dark:bg-amber-950">
						<span className="flex items-center px-2 text-sm text-amber-800 dark:text-amber-200">
							<AlertTriangle className="mr-1 h-3 w-3" />
							Confirm archive?
						</span>
						<Button
							type="button"
							variant="warning"
							size="sm"
							onClick={() => {
								// Perform archive action
								setArchiveState("idle");
							}}
							haptics="medium"
							className="ml-1"
						>
							Archive
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => setArchiveState("idle")}
							haptics="light"
							className="ml-1"
						>
							Cancel
						</Button>
					</div>
				)}
			</div>

			{/* Long press confirmation */}
			<Button
				type="button"
				variant="danger"
				longPress={{
					duration: 1000,
					onLongPress: () => {
						console.log("Item deleted via long press");
					},
				}}
				haptics="heavy"
			>
				<Trash2 className="h-4 w-4" />
				Hold to Delete
			</Button>

			{/* Two-step action */}
			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="outline"
					state="idle"
					onAction={async () => {
						// Simulate async action
						await new Promise((resolve) => setTimeout(resolve, 1500));
					}}
					loadingText="Publishing..."
					successText="Published!"
					haptics="medium"
					sound="click"
				>
					Publish Changes
				</Button>
			</div>

			<p className="text-sm text-muted-foreground">
				Note: For modal confirmations, combine with Dialog component
			</p>
		</div>
	);
}
