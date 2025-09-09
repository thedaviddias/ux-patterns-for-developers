import { SiDiscord, SiX } from "@icons-pack/react-simple-icons";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import {
	NavbarMenu,
	NavbarMenuContent,
	NavbarMenuLink,
	NavbarMenuTrigger,
} from "fumadocs-ui/layouts/home/navbar";
import { ComponentIcon, Pencil, Server } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import Preview from "@/public/img/preview.png";

export default function BaseHome({ children }: LayoutProps<"/">) {
	return (
		<HomeLayout
			{...baseOptions()}
			links={[
				{
					type: "custom",
					on: "nav",
					children: (
						<NavbarMenu>
							<NavbarMenuTrigger>
								<Link href="/patterns/getting-started">Patterns</Link>
							</NavbarMenuTrigger>
							<NavbarMenuContent className="text-[15px]">
								<NavbarMenuLink
									href="/patterns/getting-started"
									className="md:row-span-2"
								>
									<div className="-mx-3 -mt-3">
										<Image
											src={Preview}
											alt="Perview"
											className="rounded-t-lg object-cover"
											style={{
												maskImage:
													"linear-gradient(to bottom,white 60%,transparent)",
											}}
										/>
									</div>
									<p className="font-medium">Getting Started</p>
									<p className="text-fd-muted-foreground text-sm">
										Learn to use UX Patterns for Developers
									</p>
								</NavbarMenuLink>

								<NavbarMenuLink href="/patterns" className="lg:col-start-2">
									<ComponentIcon className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
									<p className="font-medium">Patterns</p>
									<p className="text-fd-muted-foreground text-sm">
										Learn about UX patterns and how to use them.
									</p>
								</NavbarMenuLink>

								<NavbarMenuLink
									href="/pattern-guide"
									className="lg:col-start-2"
								>
									<Server className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
									<p className="font-medium">Pattern Guide</p>
									<p className="text-fd-muted-foreground text-sm">
										Compare similar patterns and make informed decisions based
										on your specific use case and requirements.
									</p>
								</NavbarMenuLink>

								<NavbarMenuLink
									href="/glossary"
									className="lg:col-start-3 lg:row-start-1"
								>
									<Pencil className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
									<p className="font-medium">Glossary</p>
									<p className="text-fd-muted-foreground text-sm">
										Get definitions of the terms used in the patterns.
									</p>
								</NavbarMenuLink>
							</NavbarMenuContent>
						</NavbarMenu>
					),
				},
				...linkItems,
				{
					type: "icon",
					text: "Discord",
					icon: (
						<SiDiscord className="h-5 w-5 text-fd-muted-foreground hover:text-fd-accent-foreground" />
					),
					url: "https://discord.gg/8fsJFcCGbq",
				},
				{
					type: "icon",
					text: "X",
					icon: (
						<SiX className="h-5 w-5 text-fd-muted-foreground hover:text-fd-accent-foreground" />
					),
					url: "https://x.com/thedaviddias",
				},
			]}
		>
			{children}
		</HomeLayout>
	);
}
