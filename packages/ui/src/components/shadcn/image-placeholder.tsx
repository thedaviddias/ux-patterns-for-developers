"use client";

import { ImageIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface ImagePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
	className?: string;
}

export function ImagePlaceholder({
	title,
	description,
	className,
	...props
}: ImagePlaceholderProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center w-full h-full rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900",
				className,
			)}
			{...props}
		>
			<ImageIcon className="h-10 w-10 text-neutral-400" />
			{title && (
				<div className="mt-4 text-center px-4">
					<p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
						{title}
					</p>
					{description && (
						<p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
							{description}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
