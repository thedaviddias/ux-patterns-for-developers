import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PlausibleProvider from "next-plausible";
import { Footer } from "@/components/footer/footer";
import { DefaultSearchDialog } from "@/components/search";
import { TextSelectionHandler } from "@/components/text-to-social/text-selection-handler";
import { Body } from "./layout.client";
import { metadataSEO } from "./metadata";

const geist = Geist({
	variable: "--font-sans",
	subsets: ["latin"],
});

const mono = Geist_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = metadataSEO;

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={`${geist.variable} ${mono.variable}`}
			suppressHydrationWarning
		>
			<head>
				<PlausibleProvider
					domain="uxpatterns.dev"
					trackOutboundLinks={true}
					taggedEvents={true}
				/>
			</head>
			<Body>
				<RootProvider
					search={{
						SearchDialog: DefaultSearchDialog,
					}}
				>
					{children}
					<TextSelectionHandler />
				</RootProvider>
				<Footer />
			</Body>
		</html>
	);
}
