import "@/app/global.css";
import { AnalyticsHead } from "@ux-patterns/analytics/head";
import type { Metadata } from "next";
import { Geist_Mono, Libre_Baskerville, Outfit } from "next/font/google";
import { Footer } from "@/components/footer/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TextSelectionHandler } from "@/components/text-to-social/text-selection-handler";
import { Body } from "./layout.client";
import { metadataSEO } from "./metadata";

const outfit = Outfit({
	variable: "--font-ui",
	subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["400", "700"],
});

const mono = Geist_Mono({
	variable: "--font-mono-source",
	subsets: ["latin"],
});

export const metadata: Metadata = metadataSEO;

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={`${outfit.variable} ${libreBaskerville.variable} ${mono.variable}`}
			suppressHydrationWarning
		>
			<head>
				<AnalyticsHead
					openPanelClientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}
				/>
			</head>
			<Body>
				<ThemeProvider>
					{children}
					<TextSelectionHandler />
					<Footer />
				</ThemeProvider>
			</Body>
		</html>
	);
}
