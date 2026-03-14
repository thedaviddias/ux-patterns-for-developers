import { cn } from "@ux-patterns/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
	url: string;
	title: string;
	description: string;
	date: string;
	thumbnail?: string;
	showRightBorder?: boolean;
}

export function BlogCard({
	url,
	title,
	description,
	date,
	thumbnail,
	showRightBorder = true,
}: BlogCardProps) {
	return (
		<Link
			href={url}
			className={cn(
				"group block relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_26px_80px_-52px_rgba(15,23,42,0.45)]",
				showRightBorder && "md:border-r border-border border-b-0",
			)}
		>
			<div className="flex flex-col">
				{thumbnail && (
					<div className="relative h-56 w-full overflow-hidden border-b border-border/60">
						<Image
							src={thumbnail}
							alt={title}
							fill
							className="object-cover transition-transform duration-300 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					</div>
				)}

				<div className="p-6 flex flex-col gap-3">
					<time className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
						{date}
					</time>
					<h3 className="text-2xl font-semibold text-card-foreground group-hover:underline underline-offset-4">
						{title}
					</h3>
					<p className="text-muted-foreground text-sm leading-6">
						{description}
					</p>
				</div>
			</div>
		</Link>
	);
}
