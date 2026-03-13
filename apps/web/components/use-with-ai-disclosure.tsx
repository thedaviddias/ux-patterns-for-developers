"use client";

import { CopyCommandRow } from "@ux-patterns/ui/components/custom/copy-command-row";
import { buttonVariants } from "@ux-patterns/ui/components/shadcn/button";
import { ChevronDown, ExternalLinkIcon, Sparkles } from "lucide-react";
import { useEffect, useId, useState } from "react";
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
	return (
		<CopyCommandRow
			className="rounded-lg border border-border/70 bg-background/90 p-3 shadow-sm backdrop-blur-sm"
			label={label}
			command={command}
			idleAriaLabel={`Copy ${label} install command`}
			copiedAriaLabel="Copied install command"
		/>
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
	const patternId = useId().replace(/:/g, "");

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
		<section
			className={cn(
				"not-prose group relative my-6 overflow-hidden rounded-lg border border-border/50",
				"bg-zinc-950/85 transition-all duration-200",
				"hover:border-cyan-500/20 hover:shadow-md",
			)}
		>
			<div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-950/10 to-blue-950/25 opacity-90 transition-opacity group-hover:opacity-100 dark:from-cyan-950/40 dark:via-slate-950/20 dark:to-blue-950/35" />
			<svg
				className="absolute inset-0 h-full w-full opacity-[0.05]"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<defs>
					<pattern
						id={`use-with-ai-pattern-${patternId}`}
						x="0"
						y="0"
						width="112"
						height="112"
						patternUnits="userSpaceOnUse"
					>
						<path
							d="M24 56 L56 24 L88 56 L56 88 Z"
							fill="none"
							stroke="currentColor"
							strokeWidth="1"
							className="text-cyan-500"
						/>
					</pattern>
				</defs>
				<rect
					width="100%"
					height="100%"
					fill={`url(#use-with-ai-pattern-${patternId})`}
				/>
			</svg>
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				className={cn(
					"relative flex w-full cursor-pointer items-start justify-between gap-4 px-4 py-3 text-left",
					"focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				)}
				aria-expanded={open}
			>
				<div className="flex gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/16 to-blue-500/14 backdrop-blur-sm">
						<Sparkles className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-400" />
					</div>
					<div className="flex flex-col">
						<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							AI Workflow
						</span>
						<h2 className="text-sm font-semibold text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text dark:from-cyan-400 dark:to-blue-400">
							Use with AI
						</h2>
						<p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
							Install the <span className="font-medium">{patternTitle}</span>{" "}
							skill or the global UX patterns skill, then jump into the raw doc
							and generated reference.
						</p>
					</div>
				</div>
				<ChevronDown
					className={cn(
						"relative mt-1 size-4 shrink-0 text-muted-foreground transition-all group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
						open && "rotate-180",
					)}
				/>
			</button>

			{open ? (
				<div className="relative grid gap-3 px-4 pb-4">
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
