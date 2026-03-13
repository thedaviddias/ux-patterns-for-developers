"use client";

import type * as React from "react";
import { ExpandableCodeBlock } from "../expandable-code-block";

interface CodeSectionProps {
	children: React.ReactNode;
	isExpanded?: boolean;
	shouldShowExpand?: boolean;
	onShouldShowExpandChange?: (shouldShow: boolean) => void;
	onCodeContentChange?: (content: string) => void;
}

export function CodeSection({
	children,
	isExpanded = false,
	shouldShowExpand: shouldShowExpandProp,
	onShouldShowExpandChange,
	onCodeContentChange,
}: CodeSectionProps) {
	return (
		<ExpandableCodeBlock
			expanded={shouldShowExpandProp ? isExpanded : undefined}
			contentClassName="[&_pre]:my-0"
			onOverflowChange={onShouldShowExpandChange}
			onCodeContentChange={onCodeContentChange}
		>
			{children}
		</ExpandableCodeBlock>
	);
}
