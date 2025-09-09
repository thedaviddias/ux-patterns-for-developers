import Link from "next/link";

interface DisclaimerBannerProps {
	className?: string;
}

export function DisclaimerBanner({ className = "" }: DisclaimerBannerProps) {
	return (
		<div
			className={`bg-fd-muted/50 border border-fd-border rounded-lg p-4 ${className}`}
		>
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0 w-5 h-5 mt-0.5">
					<svg
						className="w-5 h-5 text-fd-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-sm text-fd-muted-foreground">
						<strong className="text-fd-foreground">Educational Purpose:</strong>{" "}
						These examples are shown for learning UX patterns, not to criticize
						companies or teams.{" "}
						<Link
							href="/disclaimer"
							className="text-fd-primary hover:underline font-medium"
						>
							Read our disclaimer
						</Link>{" "}
						for more information.
					</p>
				</div>
			</div>
		</div>
	);
}
