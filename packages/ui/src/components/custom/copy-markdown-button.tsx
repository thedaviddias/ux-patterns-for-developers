"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import * as React from "react";
import { CopyActionButton } from "./copy-action-button";

const cache = new Map<string, string>();

type CopyMarkdownButtonProps = {
	markdownUrl: string;
	className?: string;
};

export function CopyMarkdownButton({
	markdownUrl,
	className,
}: CopyMarkdownButtonProps) {
	const [isLoading, setLoading] = React.useState(false);

	const handleCopy = React.useCallback(async () => {
		const cached = cache.get(markdownUrl);
		if (cached) {
			await navigator.clipboard.writeText(cached);
			return true;
		}

		setLoading(true);

		try {
			await navigator.clipboard.write([
				new ClipboardItem({
					"text/plain": fetch(markdownUrl).then(async (res) => {
						const content = await res.text();
						cache.set(markdownUrl, content);

						return content;
					}),
				}),
			]);
			return true;
		} finally {
			setLoading(false);
		}
	}, [markdownUrl]);

	return (
		<CopyActionButton
			variant="secondary"
			size="sm"
			className={className}
			disabled={isLoading}
			onCopy={handleCopy}
			idleAriaLabel="Copy Markdown"
			copiedAriaLabel="Copied Markdown"
			idleIcon={<CopyIcon />}
			copiedIcon={<CheckIcon />}
			idleLabel="Copy Markdown"
			copiedLabel="Copied Markdown"
		/>
	);
}
