"use client";

import { cn } from "@ux-patterns/ui/lib/utils";
import type * as React from "react";
import { CodeBlockWrapper } from "../code/code-block-wrapper";

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
	src: string;
}

export function ComponentSource({
	children,
	className,
	...props
}: ComponentSourceProps) {
	return (
		<CodeBlockWrapper
			expandButtonTitle="Expand"
			className={cn("my-6 overflow-hidden rounded-md", className)}
			{...props}
		>
			{children}
		</CodeBlockWrapper>
	);
}
