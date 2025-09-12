import "@/app/global.css";
import { MetadataGenerator } from "@ux-patterns/seo/metadata";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import PlausibleProvider from "next-plausible";

const inter = Inter({
	subsets: ["latin"],
});

const metadataGenerator = new MetadataGenerator({
	site: {
		name: "UX Patterns Kit",
		description:
			"UX Patterns (UP) Kit is a React component library that provides a set of reusable components for building web applications.",
		url: "https://kit.uxpatterns.dev",
		author: "David Dias",
	},
	defaults: {
		openGraph: {
			images: [
				{
					url: "/og-image.png",
					width: 1200,
					height: 630,
				},
			],
		},
	},
});

export const metadata = metadataGenerator.getBase();

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" className={inter.className} suppressHydrationWarning>
			<head />
			<body className="flex flex-col min-h-screen">
				<PlausibleProvider
					domain="kit.uxpatterns.dev"
					trackOutboundLinks={true}
					taggedEvents={true}
				>
					<RootProvider
						search={{
							options: {
								type: "static",
							},
						}}
					>
						{children}
					</RootProvider>
				</PlausibleProvider>
			</body>
		</html>
	);
}
