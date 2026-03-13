"use client";

import { cn } from "@ux-patterns/ui/lib/utils";
import { CopyActionButton } from "../copy-action-button";

export const CopyButton = ({ url }: { url: string | null }) => {
	return (
		<CopyActionButton
			variant="ghost"
			size="icon"
			className={cn(
				"h-8 gap-1 rounded-[6px] bg-transparent px-3 text-xs text-black hover:bg-black hover:text-white dark:text-white",
			)}
			textToCopy={url || ""}
			idleAriaLabel="Copy component source"
			copiedAriaLabel="Copied"
			tooltip="Copy Registry URL"
			disableWhileCopied
		/>
	);
};
