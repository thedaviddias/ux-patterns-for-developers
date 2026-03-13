"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import * as React from "react";
import { useCopy } from "../../../../hooks/src/use-copy";
import { cn } from "../../lib/utils";

type CopyCommandRowProps = {
	command: string;
	label?: React.ReactNode;
	onCopy?: () => Promise<boolean | undefined> | boolean | undefined;
	className?: string;
	labelClassName?: string;
	rowClassName?: string;
	codeClassName?: string;
	iconClassName?: string;
	copiedDuration?: number;
	idleAriaLabel?: string;
	copiedAriaLabel?: string;
};

export function CopyCommandRow({
	command,
	label,
	onCopy,
	className,
	labelClassName,
	rowClassName,
	codeClassName,
	iconClassName,
	copiedDuration,
	idleAriaLabel = "Copy command",
	copiedAriaLabel = "Copied command",
}: CopyCommandRowProps) {
	const { copied, copy, markCopied } = useCopy(copiedDuration);

	const handleCopy = React.useCallback(async () => {
		if (!onCopy) {
			return copy(command);
		}

		try {
			const result = await onCopy();
			if (result !== false) {
				markCopied();
				return true;
			}
		} catch (error) {
			console.error("Failed to copy text: ", error);
		}

		return false;
	}, [command, copy, markCopied, onCopy]);

	return (
		<div className={className}>
			{label ? (
				<p
					className={cn(
						"mb-2 text-sm font-medium text-foreground",
						labelClassName,
					)}
				>
					{label}
				</p>
			) : null}
			<button
				type="button"
				onClick={() => {
					void handleCopy();
				}}
				className={cn(
					"group grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border/60 bg-muted/70 px-3 py-2 text-left transition-colors",
					"hover:border-cyan-500/25 hover:bg-muted/80",
					"focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					rowClassName,
				)}
				aria-label={copied ? copiedAriaLabel : idleAriaLabel}
			>
				<code
					className={cn(
						"block min-w-0 text-xs text-foreground whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
						codeClassName,
					)}
				>
					{command}
				</code>
				<span
					className={cn(
						"flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-transparent text-muted-foreground transition-all",
						"group-hover:border-cyan-500/20 group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
						copied &&
							"border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
						iconClassName,
					)}
					aria-hidden="true"
				>
					{copied ? (
						<CheckIcon className="h-3.5 w-3.5" />
					) : (
						<ClipboardIcon className="h-3.5 w-3.5" />
					)}
				</span>
			</button>
		</div>
	);
}
