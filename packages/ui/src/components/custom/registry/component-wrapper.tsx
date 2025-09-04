"use client";

import { Button } from "@ux-patterns/ui/components/shadcn/button";
import { cn } from "@ux-patterns/ui/lib/utils";
import { RotateCcw } from "lucide-react";
import React from "react";
import { CopyButton } from "./copy-registry";
import { OpenInV0Button } from "./open-in-v0-button";

interface ComponentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string;
	height?: string;
	kit?: boolean;
	pageMetadata?: any;
}

export const ComponentWrapper = ({
	className,
	children,
	name,
	height = "min-h-[350px]",
	kit = false,
	pageMetadata,
}: ComponentWrapperProps) => {
	const [key, setKey] = React.useState(0);

	// Build Kit documentation URL with component name from frontmatter and anchor from variant
	const kitUrl = React.useMemo(() => {
		// Get component name from frontmatter if available
		const componentName = pageMetadata?.component;

		if (!componentName) {
			// Fallback to URL-based extraction if no frontmatter
			if (typeof window !== "undefined") {
				const pathSegments = window.location.pathname
					.split("/")
					.filter(Boolean);
				if (pathSegments.includes("patterns") && pathSegments.length > 2) {
					const lastSegment = pathSegments[pathSegments.length - 1];
					return `https://kit.uxpatterns.dev/docs/components/${lastSegment}`;
				}
			}
			return `https://kit.uxpatterns.dev/docs/components/${name}`;
		}

		// Extract variant from name (e.g., "button-default" -> "default")
		const variant = name.startsWith(`${componentName}-`)
			? name.slice(componentName.length + 1)
			: null;

		// Build URL with anchor if variant exists
		const baseUrl = `https://kit.uxpatterns.dev/docs/components/${componentName}`;
		return variant ? `${baseUrl}#${variant}` : baseUrl;
	}, [name, pageMetadata]);

	const url = `https://kit.uxpatterns.dev/r/${name}.json`;

	return (
		<div
			className={cn(
				"max-w-screen relative rounded-xl border bg-fd-code",
				className,
			)}
			key={key}
		>
			{kit && (
				<div className="absolute right-4 top-4 flex items-center justify-start gap-2">
					<a
						href={kitUrl}
						aria-label="Open in Kit"
						className="h-8 gap-1 rounded-[6px] px-3 text-xs dark:text-white text-black bg:text-white hover:bg-black hover:text-white bg-transparent"
					>
						Kit
					</a>
				</div>
			)}
			{kit === false && (
				<div className="absolute right-4 top-4 flex items-center justify-end gap-2">
					<CopyButton url={url} />
					<OpenInV0Button url={url} />
					<Button
						onClick={() => setKey((prev) => prev + 1)}
						className="h-8 gap-1 rounded-[6px] px-3 text-xs dark:text-white text-black bg:text-white hover:bg-black hover:text-white bg-transparent"
						variant="ghost"
					>
						<RotateCcw aria-label="restart-btn" size={16} />
					</Button>
				</div>
			)}

			<div
				className={cn("flex w-full items-center justify-center p-10", height)}
			>
				{children}
			</div>
		</div>
	);
};
