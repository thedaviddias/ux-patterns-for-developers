import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PlausibleProvider from "next-plausible";

const inter = Inter({
	subsets: ["latin"],
});

export const metadata = {
	title: {
		template: "%s | UP Kit",
		default: "UP Kit",
	},
	description:
		"UP Kit is a React component library that provides a set of reusable components for building web applications.",
	authors: [
		{
			name: "UP Kit",
			url: "https://kit.uxpatterns.dev",
		},
	],
} satisfies Metadata;

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
