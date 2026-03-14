import Link from "next/link";
import { cn } from "@/lib/cn";

type DecisionLink = {
	name: string;
	href: string;
};

interface QuickDecisionBandProps {
	bestFor?: string[];
	avoidWhen?: string[];
	compareWith?: DecisionLink[];
	complexity?: "low" | "medium" | "high";
	accessibilityRisk?: "low" | "medium" | "high";
}

const toneMap = {
	low: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
	medium:
		"border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
	high: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
} as const;

function TonePill({
	label,
	value,
}: {
	label: string;
	value: "low" | "medium" | "high";
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
				toneMap[value],
			)}
		>
			{label}: {value}
		</span>
	);
}

export function QuickDecisionBand({
	bestFor = [],
	avoidWhen = [],
	compareWith = [],
	complexity,
	accessibilityRisk,
}: QuickDecisionBandProps) {
	if (
		bestFor.length === 0 &&
		avoidWhen.length === 0 &&
		compareWith.length === 0 &&
		!complexity &&
		!accessibilityRisk
	) {
		return null;
	}

	return (
		<section
			aria-label="Quick decision summary"
			className="not-prose my-5 rounded-[1.5rem] border border-border/70 bg-card/80 p-4 sm:p-5"
		>
			<div className="flex flex-col gap-3 border-b border-border/60 pb-3 sm:flex-row sm:items-center sm:justify-between">
				<p className="font-display text-sm italic text-muted-foreground">
					Quick decision
				</p>
				<div className="flex flex-wrap gap-2">
					{complexity && <TonePill label="Complexity" value={complexity} />}
					{accessibilityRisk && (
						<TonePill label="Accessibility risk" value={accessibilityRisk} />
					)}
				</div>
			</div>

			<div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_1.1fr_0.9fr]">
				<div className="rounded-[1.25rem] border border-border/60 bg-background/75 p-4">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
						Best for
					</p>
					<ul className="mt-3 space-y-2 text-sm leading-6 text-foreground">
						{bestFor.length > 0 ? (
							bestFor.slice(0, 3).map((item) => <li key={item}>{item}</li>)
						) : (
							<li className="text-muted-foreground">No summary yet.</li>
						)}
					</ul>
				</div>

				<div className="rounded-[1.25rem] border border-border/60 bg-background/75 p-4">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
						Avoid when
					</p>
					<ul className="mt-3 space-y-2 text-sm leading-6 text-foreground">
						{avoidWhen.length > 0 ? (
							avoidWhen.slice(0, 3).map((item) => <li key={item}>{item}</li>)
						) : (
							<li className="text-muted-foreground">No summary yet.</li>
						)}
					</ul>
				</div>

				<div className="rounded-[1.25rem] border border-border/60 bg-background/75 p-4">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
						Compare with
					</p>
					<div className="mt-3 flex flex-wrap gap-2">
						{compareWith.length > 0 ? (
							compareWith.slice(0, 4).map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
								>
									{item.name}
								</Link>
							))
						) : (
							<p className="text-sm text-muted-foreground">No comparisons yet.</p>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
