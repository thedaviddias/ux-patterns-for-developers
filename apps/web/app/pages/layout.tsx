import { Header } from "@/components/layout/header";
import { GitHubStarsWrapper } from "@ux-patterns/ui/components/custom/github-stars-wrapper";
import { SearchToggle } from "@/components/search";
import { TRACKING_EVENTS } from "@/lib/tracking";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
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
			{children}
		</>
	);
}
