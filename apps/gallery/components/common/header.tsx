import { SOCIAL_LINKS } from "@ux-patterns/constants/social";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { HeaderSearchWrapper } from "@/components/header/header-search-wrapper";
import { TRACKING_CLASSES } from "@/lib/tracking";
import { StarsWrapper } from "../stars/stars-wrapper";

export function Header() {
	return (
		<header className="bg-fd-card border-b border-fd-border">
			<div className="container-responsive">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center space-x-6">
						<Link
							href="/"
							className="text-xl font-bold text-fd-foreground hover:text-fd-primary transition-colors"
						>
							UX Patterns Gallery
						</Link>

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
						<nav className="hidden md:flex items-center space-x-6">
							<Link
								href="https://uxpatterns.dev"
								className={`text-fd-muted-foreground hover:text-fd-foreground transition-colors ${TRACKING_CLASSES.MAIN_SITE_LINK_CLICK}`}
							>
								Patterns
								<span className="ml-1 inline-flex items-center">
									<ExternalLinkIcon className="w-4 h-4" />
								</span>
							</Link>
							<Link
								href="https://kit.uxpatterns.dev"
								className={`text-fd-muted-foreground hover:text-fd-foreground transition-colors ${TRACKING_CLASSES.MAIN_SITE_LINK_CLICK}`}
							>
								Kit
								<span className="ml-1 inline-flex items-center">
									<ExternalLinkIcon className="w-4 h-4" />
								</span>
							</Link>
						</nav>

						<div className="scale-90 -mx-2">
							<StarsWrapper variant="small" />
						</div>
						{SOCIAL_LINKS.filter((social) => social.label !== "GitHub").map(
							(social) => (
								<a
									key={social.label}
									href={social.link}
									target="_blank"
									rel="noopener noreferrer"
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
