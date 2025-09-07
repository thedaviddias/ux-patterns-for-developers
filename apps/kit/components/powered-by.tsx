import { cn } from "@ux-patterns/ui/lib/utils";
import Image from "next/image";

type PoweredByProps = {
	packages: { name: string; url: string }[];
};

const getHostname = (url: string) => {
	const parsedUrl = new URL(url);
	return parsedUrl.hostname;
};

export const PoweredBy = ({ packages }: PoweredByProps) => (
	<div className="not-prose mb-8 flex flex-col gap-2">
		<p className="text-muted-foreground text-sm">Powered by</p>
		<div className="flex flex-row flex-wrap items-center gap-2">
			{packages.map(({ name, url }) => (
				<a
					className={cn(
						"flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 transition-all",
						"hover:bg-secondary/80",
					)}
					href={url}
					key={name}
					rel="noopener"
					target="_blank"
				>
					<Image
						alt={name}
						className="h-4 w-4 overflow-hidden rounded-sm object-cover"
						height={16}
						src={`https://www.google.com/s2/favicons?domain=${getHostname(url)}&sz=32`}
						width={16}
					/>
					<p className="text-muted-foreground text-sm">{name}</p>
				</a>
			))}
		</div>
	</div>
);
