"use client";

import { Button } from "@ux-patterns/ui/components/shadcn/button";
import {
	Collapsible,
	CollapsibleTrigger,
} from "@ux-patterns/ui/components/shadcn/collapsible";
import { cn } from "@ux-patterns/ui/lib/utils";
import * as React from "react";

const DEFAULT_COLLAPSED_HEIGHT = 350;
const DEFAULT_COLLAPSE_LINES = 15;
const DEFAULT_EXPAND_LABEL = "Show more code";
const DEFAULT_COLLAPSE_LABEL = "Show less code";

interface ExpandableCodeBlockProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	actions?: React.ReactNode;
	contentClassName?: string;
	collapseLines?: number;
	collapsedHeight?: number;
	expandLabel?: string;
	collapseLabel?: string;
	expanded?: boolean;
	defaultExpanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	onOverflowChange?: (isOverflowing: boolean) => void;
	onCodeContentChange?: (content: string) => void;
}

function getMeasuredElement(root: HTMLDivElement): HTMLElement | null {
	const codeElement = root.querySelector(".shiki, pre");
	return codeElement instanceof HTMLElement ? codeElement : root;
}

function getCodeText(root: HTMLDivElement): string {
	const codeElement = root.querySelector("code");
	const text = codeElement?.textContent ?? root.textContent ?? "";
	return text.replace(/\u00a0/g, " ").trimEnd();
}

export function ExpandableCodeBlock({
	children,
	actions,
	className,
	contentClassName,
	collapseLines = DEFAULT_COLLAPSE_LINES,
	collapsedHeight = DEFAULT_COLLAPSED_HEIGHT,
	expandLabel = DEFAULT_EXPAND_LABEL,
	collapseLabel = DEFAULT_COLLAPSE_LABEL,
	expanded: expandedProp,
	defaultExpanded = false,
	onExpandedChange,
	onOverflowChange,
	onCodeContentChange,
	...props
}: ExpandableCodeBlockProps) {
	const [isOverflowing, setIsOverflowing] = React.useState(false);
	const [uncontrolledExpanded, setUncontrolledExpanded] =
		React.useState(defaultExpanded);
	const contentRef = React.useRef<HTMLDivElement>(null);
	const contentId = React.useId();
	const isExpanded =
		expandedProp === undefined ? uncontrolledExpanded : expandedProp;

	const setExpanded = React.useCallback(
		(nextExpanded: boolean) => {
			if (expandedProp === undefined) {
				setUncontrolledExpanded(nextExpanded);
			}

			onExpandedChange?.(nextExpanded);
		},
		[expandedProp, onExpandedChange],
	);

	const measureOverflow = React.useCallback(() => {
		const root = contentRef.current;
		if (!root) {
			return;
		}

		const measuredElement = getMeasuredElement(root);
		if (!measuredElement) {
			return;
		}

		const codeText = getCodeText(root);
		if (codeText) {
			onCodeContentChange?.(codeText);
		}

		const lineCount = codeText ? codeText.split(/\r?\n/).length : 0;
		const shouldCollapse =
			measuredElement.scrollHeight > collapsedHeight ||
			measuredElement.clientHeight > collapsedHeight ||
			measuredElement.offsetHeight > collapsedHeight ||
			lineCount > collapseLines;

		setIsOverflowing(shouldCollapse);
		onOverflowChange?.(shouldCollapse);

		if (!shouldCollapse && isExpanded) {
			setExpanded(false);
		}
	}, [
		collapseLines,
		collapsedHeight,
		isExpanded,
		onCodeContentChange,
		onOverflowChange,
		setExpanded,
	]);

	React.useEffect(() => {
		measureOverflow();

		if (typeof ResizeObserver === "undefined") {
			return;
		}

		const root = contentRef.current;
		if (!root) {
			return;
		}

		const measuredElement = getMeasuredElement(root);
		if (!measuredElement) {
			return;
		}

		const observer = new ResizeObserver(() => {
			measureOverflow();
		});

		observer.observe(root);
		if (measuredElement !== root) {
			observer.observe(measuredElement);
		}

		return () => {
			observer.disconnect();
		};
	}, [measureOverflow]);

	const showCollapseState = isOverflowing && !isExpanded;

	return (
		<Collapsible
			open={isExpanded}
			onOpenChange={setExpanded}
			className={cn("group relative", className)}
			{...props}
		>
			<div className="relative overflow-hidden rounded-md">
				{actions ? (
					<div className="absolute right-2 top-2 z-20">{actions}</div>
				) : null}
				<div
					ref={contentRef}
					id={contentId}
					className={cn(
						"min-w-0 transition-[max-height] duration-200 ease-out [&_pre]:min-w-0 [&_pre]:max-w-full [&_pre]:overflow-x-hidden [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:[overflow-wrap:anywhere] [&_code]:max-w-full [&_code]:whitespace-pre-wrap [&_code]:break-words [&_code]:[overflow-wrap:anywhere] [&_code_span]:[white-space:inherit]",
						contentClassName,
					)}
					style={
						showCollapseState
							? {
									maxHeight: `${collapsedHeight}px`,
									overflow: "hidden",
								}
							: undefined
					}
				>
					{children}
				</div>
				{showCollapseState ? (
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent"
					/>
				) : null}
			</div>

			{isOverflowing ? (
				<div className="mt-3 flex justify-center">
					<CollapsibleTrigger asChild>
						<Button
							type="button"
							variant="secondary"
							size="sm"
							aria-controls={contentId}
						>
							{isExpanded ? collapseLabel : expandLabel}
						</Button>
					</CollapsibleTrigger>
				</div>
			) : null}
		</Collapsible>
	);
}
