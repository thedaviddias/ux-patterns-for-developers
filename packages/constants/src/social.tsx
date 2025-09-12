import { SiDiscord, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import { AUTHOR, PROJECT } from "./author";

interface SocialLink {
	label: string;
	link: string;
	icon?: React.ReactNode;
	rel?: "me";
}

export const SOCIAL_LINKS: SocialLink[] = [
	{
		label: "Discord",
		link: PROJECT.discord,
		icon: <SiDiscord />,
	},
	{
		label: "X",
		link: AUTHOR.social.twitterUrl,
		rel: "me" as const,
		icon: <SiX />,
	},
	{
		label: "Instagram",
		link: AUTHOR.social.instagramUrl,
		icon: <SiInstagram />,
	},
];
