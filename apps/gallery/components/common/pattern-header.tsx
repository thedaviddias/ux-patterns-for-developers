import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PatternHeaderProps {
	pattern: string;
	description?: string;
	entryCount: number;
	className?: string;
}

export function PatternHeader({
	pattern,
	description,
	entryCount,
	className,
}: PatternHeaderProps) {
	return (
		<div className={cn("bg-fd-card border-b border-fd-border", className)}>
			<div className="container-responsive py-8">
				{/* Back navigation */}
				<Link
					href="/gallery"
					className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground mb-6 group"
				>
					<ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
					Back to Gallery
				</Link>

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-fd-foreground mb-2">
							{pattern}
						</h1>

						{description && (
							<p className="text-lg text-fd-muted-foreground max-w-2xl">
								{description}
							</p>
						)}

						<p className="text-sm text-fd-muted-foreground mt-2">
							{entryCount} {entryCount === 1 ? "example" : "examples"}
						</p>
					</div>

					{/* Link to pattern documentation */}
					<Link
						href={`/docs/patterns/${pattern.toLowerCase().replace(/\s+/g, "-")}`}
						className="inline-flex items-center gap-2 px-4 py-2 bg-fd-primary text-fd-primary-foreground rounded-lg hover:bg-fd-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-fd-primary focus:ring-offset-2"
					>
						<span>View Documentation</span>
						<ExternalLink className="w-4 h-4" />
					</Link>
				</div>
			</div>
		</div>
	);
}
