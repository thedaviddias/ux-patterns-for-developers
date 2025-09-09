import {
	SiDiscord,
	SiGithub,
	SiInstagram,
	SiX,
} from "@icons-pack/react-simple-icons";

interface SocialLink {
	label: string;
	link: string;
	icon?: React.ReactNode;
	rel?: "me";
}

export const SOCIAL_LINKS: SocialLink[] = [
	{
		label: "Discord",
		link: "https://discord.gg/8fsJFcCGbq",
		icon: (
			<SiDiscord className="w-9 h-9 p-1.5 transition-colors duration-200" />
		),
	},
	{
		label: "X",
		link: "https://x.com/thedaviddias",
		rel: "me" as const,
		icon: <SiX className="w-9 h-9 p-1.5 transition-colors duration-200" />,
	},
	{
		label: "Instagram",
		link: "https://www.instagram.com/uxpatternsfordevs",
		icon: (
			<SiInstagram className="w-9 h-9 p-1.5 transition-colors duration-200" />
		),
	},
	{
		label: "GitHub",
		link: "https://github.com/thedaviddias",
		rel: "me" as const,
		icon: <SiGithub className="w-9 h-9 p-1.5 transition-colors duration-200" />,
	},
];
