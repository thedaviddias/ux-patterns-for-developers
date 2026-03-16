"use client";

import { buildRegistryUrl } from "@ux-patterns/ui/constants/urls";
import { cn } from "@ux-patterns/ui/lib/utils";
import React from "react";
import { ComponentDocsModal } from "./component-docs-modal";
import { CopyButton } from "./copy-registry";
import { OpenInV0Button } from "./open-in-v0-button";

interface ComponentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string;
	height?: string;
}

export const ComponentWrapper = ({
	className,
	children,
	name,
	height = "min-h-[350px]",
}: ComponentWrapperProps) => {
	const [key, _setKey] = React.useState(0);

	const url = buildRegistryUrl(name);

	return (
		<div
			className={cn(
				"max-w-screen relative rounded-xl border bg-fd-code",
				className,
			)}
			key={key}
		>
			<div className="absolute right-4 top-4 flex items-center justify-end gap-2">
				<CopyButton url={url} />
				<OpenInV0Button url={url} />
				<ComponentDocsModal name={name} />
			</div>

			<div
				className={cn("flex w-full items-center justify-center p-10", height)}
			>
				{children}
			</div>
		</div>
	);
};
