import { SOCIAL_LINKS } from "@ux-patterns/constants/social";
import { GitHubStarsWrapper } from "@ux-patterns/ui/components/custom/github-stars-wrapper";
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
							<Link
								href="https://uxpatterns.dev"
								className="text-xl font-bold text-fd-foreground hover:text-fd-primary transition-colors"
							>
								UX Patterns
							</Link>
							<span className="mx-2 text-fd-muted-foreground">/</span>
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
						<nav className="hidden md:flex items-center space-x-1 mr-4">
							<Link
								href="https://uxpatterns.dev"
								className={`px-3 py-1 rounded-md text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted/50 transition-all ${TRACKING_CLASSES.MAIN_SITE_LINK_CLICK}`}
							>
								Patterns
							</Link>
							<Link
								href="https://kit.uxpatterns.dev"
								className={`px-3 py-1 rounded-md text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted/50 transition-all ${TRACKING_CLASSES.MAIN_SITE_LINK_CLICK}`}
							>
								Kit
							</Link>
						</nav>

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
