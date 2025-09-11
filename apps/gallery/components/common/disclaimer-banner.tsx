import { Info } from "lucide-react";
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
					<Info className="w-5 h-5 text-fd-muted-foreground" />
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
