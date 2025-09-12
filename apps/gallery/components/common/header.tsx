import { SOCIAL_LINKS } from "@ux-patterns/constants/social";
import { GitHubStarsWrapper } from "@ux-patterns/ui/components/custom/github-stars-wrapper";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { HeaderSearchWrapper } from "@/components/header/header-search-wrapper";
import { GALLERY_TRACKING_EVENTS, TRACKING_CLASSES } from "@/lib/tracking";

export function Header() {
	return (
		<header className="bg-fd-card border-b border-fd-border">
			<div className="container-responsive">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center space-x-6">
						<div className="flex items-center">
							{/* Desktop: Full breadcrumb */}
							<Link
								href="https://uxpatterns.dev"
								className="hidden md:flex items-center gap-1 text-xl font-bold text-fd-muted-foreground hover:text-fd-primary transition-colors group"
								title="Go to UX Patterns main site"
							>
								UX Patterns
								<ArrowUpRight className="w-3 h-3" />
							</Link>
							<span className="hidden md:block mx-2 text-fd-muted-foreground">
								/
							</span>

							{/* Both mobile and desktop: Gallery links to homepage */}
							<Link
								href="/"
								className="text-xl font-bold text-fd-primary hover:text-fd-primary/90 transition-colors"
							>
								Gallery
							</Link>
						</div>

						<nav className="hidden md:flex items-center space-x-6">
							<Link
								href="/website"
								className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
							>
								Websites
							</Link>
						</nav>
					</div>

					{/* Search */}
					<div className="flex-1 max-w-md mx-6">
						<HeaderSearchWrapper />
					</div>

					<div className="flex items-center gap-2">
						<div className="scale-90 -mx-2">
							<GitHubStarsWrapper
								variant="small"
								asLink={true}
								trackingEvent={GALLERY_TRACKING_EVENTS.GITHUB_STAR_CLICK}
							/>
						</div>
						{SOCIAL_LINKS.filter((social) => social.label !== "GitHub").map(
							(social) => (
								<a
									key={social.label}
									href={social.link}
									target="_blank"
									rel="noopener noreferrer nofollow"
									className={`text-fd-muted-foreground hover:text-fd-foreground transition-colors ${TRACKING_CLASSES.FOOTER_SOCIAL_CLICK}`}
								>
									{social.icon}
									<span className="sr-only">{social.label}</span>
								</a>
							),
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
