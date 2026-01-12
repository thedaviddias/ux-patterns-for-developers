import Link from "next/link";
import { Header } from "@/components/layout/header";
import { GitHubStarsWrapper } from "@ux-patterns/ui/components/custom/github-stars-wrapper";
import { SearchToggle } from "@/components/search";
import { TRACKING_EVENTS } from "@/lib/tracking";

export default function NotFoundPage() {
	return (
		<div className="flex flex-1 flex-col">
			<Header
				githubStars={
					<GitHubStarsWrapper
						variant="small"
						asLink={true}
						trackingEvent={TRACKING_EVENTS.GITHUB_STAR_CLICK}
					/>
				}
				searchToggle={<SearchToggle />}
			/>
			<main className="flex flex-1 items-center justify-center px-4">
				<div className="flex flex-col items-center justify-center space-y-6 text-center max-w-lg">
					<div className="relative">
						<span className="absolute -top-16 left-1/2 -translate-x-1/2 select-none text-[10rem] font-bold text-zinc-200/20 dark:text-zinc-800/30 leading-none">
							404
						</span>
						<h1 className="relative text-3xl font-bold tracking-tighter sm:text-4xl">
							Page Not Found
						</h1>
					</div>
					<p className="text-zinc-500 dark:text-zinc-400 text-lg">
						The page you are looking for does not exist.
					</p>
					<Link
						href="/"
						className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-9 px-4 bg-primary text-primary-foreground shadow hover:bg-primary/90"
					>
						Return to Home
					</Link>
				</div>
			</main>
		</div>
	);
}
