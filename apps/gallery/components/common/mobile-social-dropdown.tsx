"use client";

import { SOCIAL_LINKS } from "@ux-patterns/constants/social";
import { GitHubStarsWrapper } from "@ux-patterns/ui/components/custom/github-stars-wrapper";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { GALLERY_TRACKING_EVENTS, TRACKING_CLASSES } from "@/lib/tracking";

export function MobileSocialDropdown() {
	const [showSocialDropdown, setShowSocialDropdown] = useState(false);

	return (
		<div className="flex md:hidden items-center gap-1 relative">
			<div className="scale-75">
				<GitHubStarsWrapper
					variant="small"
					asLink={true}
					trackingEvent={GALLERY_TRACKING_EVENTS.GITHUB_STAR_CLICK}
				/>
			</div>
			<button
				type="button"
				onClick={() => setShowSocialDropdown(!showSocialDropdown)}
				className="p-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
				aria-label="More social links"
			>
				<ChevronDown className={`h-4 w-4 transition-transform ${showSocialDropdown ? "rotate-180" : ""}`} />
			</button>
			
			{/* Dropdown */}
			{showSocialDropdown && (
				<div className="absolute top-full right-0 mt-1 bg-fd-card border border-fd-border rounded-lg shadow-lg p-2 flex gap-3 z-50">
					{SOCIAL_LINKS.filter((social) => social.label !== "GitHub").map(
						(social) => (
							<a
								key={social.label}
								href={social.link}
								target="_blank"
								rel="noopener noreferrer nofollow"
								className={`text-fd-muted-foreground hover:text-fd-foreground transition-colors ${TRACKING_CLASSES.FOOTER_SOCIAL_CLICK}`}
								onClick={() => setShowSocialDropdown(false)}
							>
								{social.icon}
								<span className="sr-only">{social.label}</span>
							</a>
						),
					)}
				</div>
			)}
		</div>
	);
}