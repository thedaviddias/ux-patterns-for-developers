import { SOCIAL_LINKS } from "@ux-patterns/constants/social";
import {
	FOOTER_GENERAL_LINKS,
	FOOTER_OPENSOURCE_LINKS,
	FOOTER_RESOURCES_LINKS,
} from "@/constants/footer";
import { FooterCopyright } from "./footer-copyright";
import { FooterLink } from "./footer-link";

type FooterLinksProps = {
	title: string;
	links: Array<{
		label: string;
		path?: string;
		shortlink?: string;
		rel?: string;
	}>;
	linkType?: "general" | "resource" | "social";
};

const FooterLinks = ({
	title,
	links,
	linkType = "general",
}: FooterLinksProps) => {
	return (
		<div>
			<h3 className="text-sm font-semibold text-fd-foreground mb-3">{title}</h3>
			<ul className="mt-3 space-y-1">
				{links.map(({ label, path, shortlink, rel }) => (
					<li key={path || shortlink || label}>
						<FooterLink
							label={label}
							path={path}
							shortlink={shortlink}
							rel={rel}
							linkType={linkType}
						/>
					</li>
				))}
			</ul>
		</div>
	);
};

const FooterGeneralLinks = () => (
	<FooterLinks
		title="General"
		links={FOOTER_GENERAL_LINKS}
		linkType="general"
	/>
);

const FooterResourcesLinks = () => (
	<FooterLinks
		title="Resources"
		links={FOOTER_RESOURCES_LINKS}
		linkType="resource"
	/>
);

const FooterSocialIcons = () => (
	<div className="flex gap-2 mt-4">
		{SOCIAL_LINKS.filter((link) => link.icon).map(
			({ label, link, rel, icon }) => (
				<a
					key={label}
					href={link}
					aria-label={label}
					rel={rel ? `${rel} noopener noreferrer` : "noopener noreferrer"}
					target="_blank"
					className="inline-flex"
				>
					{icon}
				</a>
			),
		)}
	</div>
);

const FooterOpenSourceLinks = () => (
	<FooterLinks
		title="Open Source"
		links={FOOTER_OPENSOURCE_LINKS}
		linkType="resource"
	/>
);

// Client component for footer content
const FooterContent = () => {
	return (
		<footer className="w-full pb-5">
			<div className="mx-auto container px-4 border-t border-fd-border pt-12">
				<div className="w-full">
					<h2 className="sr-only">Footer</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-fd-border">
						{/* Brand Section */}
						<div className="md:col-span-1">
							<span className="mb-3 block text-xl font-bold">
								UX Patterns Kit
							</span>
							<p className="text-sm text-fd-muted-foreground">
								UP Kit is a React component library that provides a set of
								reusable components for building web applications.
							</p>
							<FooterSocialIcons />
						</div>

						{/* General Links */}
						<div className="md:col-span-1">
							<FooterGeneralLinks />
						</div>

						{/* Resources Links */}
						<div className="md:col-span-1">
							<FooterResourcesLinks />
						</div>

						{/* Open Source Links */}
						<div className="md:col-span-1">
							<FooterOpenSourceLinks />
						</div>
					</div>
					{/* Copyright Section */}
					<FooterCopyright />
				</div>
			</div>
		</footer>
	);
};

export const Footer = () => {
	return <FooterContent />;
};
