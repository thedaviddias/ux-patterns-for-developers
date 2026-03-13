"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import * as React from "react";
import { useCopy } from "../../../../hooks/src/use-copy";
import { Button, type ButtonProps } from "../shadcn/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../shadcn/tooltip";

type CopyActionButtonProps = Omit<ButtonProps, "onClick"> & {
	textToCopy?: string;
	onCopy?: () => Promise<boolean | undefined> | boolean | undefined;
	idleAriaLabel: string;
	copiedAriaLabel?: string;
	idleIcon?: React.ReactNode;
	copiedIcon?: React.ReactNode;
	idleLabel?: React.ReactNode;
	copiedLabel?: React.ReactNode;
	tooltip?: React.ReactNode;
	copiedDuration?: number;
	disableWhileCopied?: boolean;
};

export function CopyActionButton({
	textToCopy,
	onCopy,
	idleAriaLabel,
	copiedAriaLabel,
	idleIcon,
	copiedIcon,
	idleLabel,
	copiedLabel,
	tooltip,
	copiedDuration,
	disableWhileCopied = false,
	disabled,
	...buttonProps
}: CopyActionButtonProps) {
	const { copied, copy, markCopied } = useCopy(copiedDuration);

	const handleCopy = React.useCallback(async () => {
		if (textToCopy !== undefined) {
			return copy(textToCopy);
		}

		if (!onCopy) {
			return false;
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
	}, [copy, markCopied, onCopy, textToCopy]);

	const button = (
		<Button
			{...buttonProps}
			aria-label={copied ? (copiedAriaLabel ?? idleAriaLabel) : idleAriaLabel}
			disabled={disabled || (disableWhileCopied && copied)}
			onClick={() => {
				void handleCopy();
			}}
		>
			{copied ? (copiedIcon ?? <CheckIcon />) : (idleIcon ?? <ClipboardIcon />)}
			{copied ? copiedLabel : idleLabel}
		</Button>
	);

	if (!tooltip) {
		return button;
	}

	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>{button}</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs text-muted-foreground">
					{tooltip}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
