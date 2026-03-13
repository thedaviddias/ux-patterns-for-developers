"use client";

import { ExpandableCodeBlock } from "@ux-patterns/ui/components/custom/expandable-code-block";
import { Check, Copy } from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";
import { cn } from "@/lib/cn";

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
				className,
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
	const [codeText, setCodeText] = useState("");

	const handleCopy = useCallback(async () => {
		const textToCopy = raw || codeText;

		if (!textToCopy) {
			return;
		}

		try {
			await navigator.clipboard.writeText(textToCopy);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}, [codeText, raw]);

	return (
		<ExpandableCodeBlock
			className="my-4"
			contentClassName="[&_pre]:my-0"
			onCodeContentChange={setCodeText}
			actions={
				<button
					type="button"
					onClick={handleCopy}
					className={cn(
						"cursor-pointer rounded-md p-2 transition-colors",
						"opacity-0 group-hover:opacity-100 focus:opacity-100",
						"bg-black/50 hover:bg-black/70",
						"text-white/80 hover:text-white",
					)}
					aria-label={copied ? "Copied!" : "Copy code"}
				>
					{copied ? (
						<Check className="h-4 w-4 text-green-400" />
					) : (
						<Copy className="h-4 w-4" />
					)}
				</button>
			}
		>
			<pre className={className} {...props}>
				{children}
			</pre>
		</ExpandableCodeBlock>
	);
}
