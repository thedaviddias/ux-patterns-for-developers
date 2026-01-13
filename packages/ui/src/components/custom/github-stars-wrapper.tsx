import { GitHubStars } from "./github-stars";
import { getGitHubStars } from "./github-stars-utils";

type GitHubStarsWrapperProps = {
	variant?: "default" | "small";
	asLink?: boolean;
	onClick?: () => void;
	trackingEvent?: string;
};

export const GitHubStarsWrapper = async ({
	variant = "default",
	asLink = false,
	onClick,
	trackingEvent,
}: GitHubStarsWrapperProps) => {
	try {
		const starsCount = await getGitHubStars();
		return (
			<GitHubStars
				variant={variant}
				starsCount={starsCount}
				asLink={asLink}
				onClick={onClick}
				trackingEvent={trackingEvent}
			/>
		);
	} catch {
		// Silently fallback - network errors during build are expected
		return (
			<div className="flex items-center justify-center gap-2">
				<span className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-sm font-medium text-neutral-900 dark:text-neutral-100 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-200 dark:focus:ring-neutral-700">
					Loading...
				</span>
			</div>
		);
	}
};
