"use client";

import { cn } from "@ux-patterns/ui/lib/utils";
import type * as React from "react";
import { ExpandableCodeBlock } from "../expandable-code-block";

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CodeBlockWrapper({
	className,
	children,
	...props
}: CodeBlockProps) {
	return (
		<ExpandableCodeBlock
			className={cn("my-6", className)}
			contentClassName="[&_pre]:my-0"
			{...props}
		>
			{children}
		</ExpandableCodeBlock>
	);
}
