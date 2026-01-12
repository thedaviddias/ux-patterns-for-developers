"use client";

import { cn } from "@/lib/cn";
import { Check, Copy } from "lucide-react";
import { useState, useCallback, type ReactNode } from "react";

interface CodeBlockProps {
	children: ReactNode;
	className?: string;
	"data-language"?: string;
}

interface PreProps {
	children: ReactNode;
	className?: string;
	"data-language"?: string;
	raw?: string;
}

/**
 * Inline Code Component
 *
 * Styles inline code snippets within text.
 */
export function Code({ children, className, ...props }: CodeBlockProps) {
	return (
		<code
			className={cn(
				"relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
				className
			)}
			{...props}
		>
			{children}
		</code>
	);
}

/**
 * Pre/Code Block Component
 *
 * Wraps code blocks with copy functionality and language indicator.
 */
export function Pre({ children, raw, className, ...props }: PreProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		// Try to get the raw text content
		const textToCopy =
			raw ||
			(typeof children === "object" &&
			children !== null &&
			"props" in children
				? String((children as any).props.children || "")
				: String(children || ""));

		try {
			await navigator.clipboard.writeText(textToCopy);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}, [children, raw]);

	return (
		<div className="code-block group relative my-4">
			<button
				type="button"
				onClick={handleCopy}
				className={cn(
					"absolute right-2 top-2 z-20 cursor-pointer rounded-md p-2 transition-colors",
					"opacity-0 group-hover:opacity-100 focus:opacity-100",
					"bg-black/50 hover:bg-black/70",
					"text-white/80 hover:text-white"
				)}
				aria-label={copied ? "Copied!" : "Copy code"}
			>
				{copied ? (
					<Check className="h-4 w-4 text-green-400" />
				) : (
					<Copy className="h-4 w-4" />
				)}
			</button>
			<pre className={className} {...props}>
				{children}
			</pre>
		</div>
	);
}
