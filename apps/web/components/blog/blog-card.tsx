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
				"group block relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-0 after:h-px after:w-screen after:bg-border after:content-['']",
				showRightBorder && "md:border-r border-border border-b-0",
			)}
		>
			<div className="flex flex-col">
				{thumbnail && (
					<div className="relative w-full h-48 overflow-hidden">
						<Image
							src={thumbnail}
							alt={title}
							fill
							className="object-cover transition-transform duration-300 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					</div>
				)}

				<div className="p-6 flex flex-col gap-2">
					<h3 className="text-xl font-semibold text-card-foreground group-hover:underline underline-offset-4">
						{title}
					</h3>
					<p className="text-muted-foreground text-sm">{description}</p>
					<time className="block text-sm font-medium text-muted-foreground">
						{date}
					</time>
				</div>
			</div>
		</Link>
	);
}
