"use client";

import { buttonVariants } from "@ux-patterns/ui/components/shadcn/button";
import {
	Check,
	ChevronDown,
	Copy,
	ExternalLinkIcon,
	Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { getSkillReferenceUrl } from "@/lib/pattern-skills-shared.mjs";

const STORAGE_KEY = "use-with-ai-open";

interface UseWithAIDisclosureProps {
	patternTitle: string;
	patternSkillSlug: string;
	patternSkillInstallCommand: string;
	globalSkillSlug: string;
	globalSkillInstallCommand: string;
	markdownUrl: string;
}

function CopyCommandButton({
	label,
	command,
}: {
	label: string;
	command: string;
}) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(command);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1800);
		} catch {
			setCopied(false);
		}
	}

	return (
		<div className="rounded-lg border border-border bg-background p-3">
			<div className="mb-2 flex items-center justify-between gap-3">
				<p className="text-sm font-medium text-foreground">{label}</p>
				<button
					type="button"
					onClick={handleCopy}
					className={cn(
						buttonVariants({
							variant: "secondary",
							size: "sm",
							className:
								"h-8 gap-1.5 px-2.5 [&_svg]:size-3.5 [&_svg]:text-muted-foreground",
						}),
					)}
					aria-label={
						copied ? "Copied install command" : `Copy ${label} install command`
					}
				>
					{copied ? <Check /> : <Copy />}
					{copied ? "Copied" : "Copy"}
				</button>
			</div>
			<code className="block rounded-md border border-border/60 bg-muted/60 px-3 py-2 text-xs text-foreground whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
				{command}
			</code>
		</div>
	);
}

export function UseWithAIDisclosure({
	patternTitle,
	patternSkillSlug,
	patternSkillInstallCommand,
	globalSkillSlug,
	globalSkillInstallCommand,
	markdownUrl,
}: UseWithAIDisclosureProps) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (stored !== null) {
				setOpen(stored === "true");
			}
		} catch {
			// Ignore storage access errors
		}
	}, []);

	useEffect(() => {
		try {
			window.localStorage.setItem(STORAGE_KEY, String(open));
		} catch {
			// Ignore storage access errors
		}
	}, [open]);

	return (
		<section className="not-prose my-6 rounded-xl border border-border bg-card p-4 shadow-sm">
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				className="flex w-full cursor-pointer items-start justify-between gap-4 rounded-lg text-left focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				aria-expanded={open}
			>
				<div className="flex gap-3">
					<div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
						<Sparkles className="h-4 w-4 shrink-0" />
					</div>
					<div>
						<h2 className="text-sm font-semibold tracking-tight text-foreground">
							Use with AI
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Install the <span className="font-medium">{patternTitle}</span>{" "}
							skill or the global UX patterns skill, then jump into the raw doc
							and generated reference.
						</p>
					</div>
				</div>
				<ChevronDown
					className={cn(
						"mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
						open && "rotate-180",
					)}
				/>
			</button>

			{open ? (
				<div className="mt-4 grid gap-3">
					<CopyCommandButton
						label={`Install ${patternSkillSlug}`}
						command={patternSkillInstallCommand}
					/>
					<CopyCommandButton
						label={`Install ${globalSkillSlug}`}
						command={globalSkillInstallCommand}
					/>
					<div className="flex flex-wrap gap-2">
						<a
							href={markdownUrl}
							className={cn(
								buttonVariants({
									variant: "secondary",
									size: "sm",
									className: "gap-2",
								}),
							)}
							target="_blank"
							rel="noreferrer"
						>
							Raw .mdx
							<ExternalLinkIcon className="size-3.5 text-muted-foreground" />
						</a>
						<a
							href={getSkillReferenceUrl(patternSkillSlug)}
							className={cn(
								buttonVariants({
									variant: "secondary",
									size: "sm",
									className: "gap-2",
								}),
							)}
							target="_blank"
							rel="noreferrer"
						>
							Pattern reference
							<ExternalLinkIcon className="size-3.5 text-muted-foreground" />
						</a>
						<a
							href={getSkillReferenceUrl(globalSkillSlug)}
							className={cn(
								buttonVariants({
									variant: "secondary",
									size: "sm",
									className: "gap-2",
								}),
							)}
							target="_blank"
							rel="noreferrer"
						>
							Global reference
							<ExternalLinkIcon className="size-3.5 text-muted-foreground" />
						</a>
					</div>
				</div>
			) : null}
		</section>
	);
}
