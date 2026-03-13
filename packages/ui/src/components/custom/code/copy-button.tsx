"use client";

import { cn } from "@ux-patterns/ui/lib/utils";
import { CopyActionButton } from "../copy-action-button";

const CopyButton = ({
	componentSource,
	className,
}: {
	componentSource: string | null;
	className?: string;
}) => {
	return (
		<div className={cn("dark absolute right-2 top-2", className)}>
			<CopyActionButton
				variant="ghost"
				size="icon"
				className="text-muted-foreground transition-none hover:bg-transparent hover:text-foreground disabled:opacity-100"
				textToCopy={componentSource || ""}
				idleAriaLabel="Copy component source"
				copiedAriaLabel="Copied"
				tooltip="Copy"
				disableWhileCopied
			/>
		</div>
	);
};

export default CopyButton;
