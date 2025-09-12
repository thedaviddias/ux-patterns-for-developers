import {
	SiDiscord,
	SiGithub,
	SiInstagram,
	SiX,
} from "@icons-pack/react-simple-icons";
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
		icon: (
			<SiDiscord className="w-9 h-9 p-1.5 transition-colors duration-200" />
		),
	},
	{
		label: "X",
		link: AUTHOR.social.twitterUrl,
		rel: "me" as const,
		icon: <SiX className="w-9 h-9 p-1.5 transition-colors duration-200" />,
	},
	{
		label: "Instagram",
		link: AUTHOR.social.instagramUrl,
		icon: (
			<SiInstagram className="w-9 h-9 p-1.5 transition-colors duration-200" />
		),
	},
	{
		label: "GitHub",
		link: AUTHOR.social.githubUrl,
		rel: "me" as const,
		icon: <SiGithub className="w-9 h-9 p-1.5 transition-colors duration-200" />,
	},
];
