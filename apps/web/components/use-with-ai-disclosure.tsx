"use client";

import { buttonVariants } from "@ux-patterns/ui/components/shadcn/button";
import {
	Check,
	ChevronDown,
	Copy,
	ExternalLinkIcon,
	Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { getSkillReferenceUrl } from "@/lib/pattern-skills-shared.js";

interface UseWithAIDisclosureProps {
	patternTitle: string;
	patternSkill: {
		skillSlug: string;
		installCommand: string;
	};
	globalSkill: {
		skillSlug: string;
		installCommand: string;
	};
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
		<div className="rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
			<div className="mb-2 flex items-center justify-between gap-3">
				<p className="text-sm font-medium text-slate-900 dark:text-slate-100">
					{label}
				</p>
				<button
					type="button"
					onClick={handleCopy}
					className={cn(
						buttonVariants({
							variant: "secondary",
							size: "sm",
							className:
								"h-8 gap-1.5 px-2.5 [&_svg]:size-3.5 [&_svg]:text-slate-500 dark:[&_svg]:text-slate-400",
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
			<code className="block overflow-x-auto rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-100">
				{command}
			</code>
		</div>
	);
}

export function UseWithAIDisclosure({
	patternTitle,
	patternSkill,
	globalSkill,
	markdownUrl,
}: UseWithAIDisclosureProps) {
	const [open, setOpen] = useState(false);

	return (
		<section className="mb-8 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				className="flex w-full items-start justify-between gap-4 text-left"
				aria-expanded={open}
			>
				<div className="flex gap-3">
					<div className="mt-0.5 rounded-xl bg-slate-900 p-2 text-white dark:bg-slate-100 dark:text-slate-950">
						<Sparkles className="size-4" />
					</div>
					<div>
						<h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">
							Use with AI
						</h2>
						<p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
							Install the <span className="font-medium">{patternTitle}</span>{" "}
							skill or the global UX patterns skill, then jump into the raw doc
							and generated reference.
						</p>
					</div>
				</div>
				<ChevronDown
					className={cn(
						"mt-1 size-4 shrink-0 text-slate-500 transition-transform dark:text-slate-400",
						open && "rotate-180",
					)}
				/>
			</button>

			{open ? (
				<div className="mt-4 grid gap-3">
					<CopyCommandButton
						label={`Install ${patternSkill.skillSlug}`}
						command={patternSkill.installCommand}
					/>
					<CopyCommandButton
						label={`Install ${globalSkill.skillSlug}`}
						command={globalSkill.installCommand}
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
							<ExternalLinkIcon className="size-3.5 text-slate-500 dark:text-slate-400" />
						</a>
						<a
							href={getSkillReferenceUrl(patternSkill.skillSlug)}
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
							<ExternalLinkIcon className="size-3.5 text-slate-500 dark:text-slate-400" />
						</a>
						<a
							href={getSkillReferenceUrl(globalSkill.skillSlug)}
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
							<ExternalLinkIcon className="size-3.5 text-slate-500 dark:text-slate-400" />
						</a>
					</div>
				</div>
			) : null}
		</section>
	);
}
