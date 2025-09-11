import "@/app/global.css";

import { RootProvider } from "fumadocs-ui/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Header } from "@/components/common/header";
import { KeyboardShortcuts } from "@/components/common/keyboard-shortcuts";
import { FooterCopyright } from "@/components/footer/footer-copyright";
import { SearchProvider } from "@/lib/search-context";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "UX Patterns Gallery",
	description:
		"Visual examples of UX patterns - good and bad implementations from real websites for educational purposes",
	keywords: [
		"UX patterns",
		"UI design",
		"user experience",
		"educational",
		"design examples",
	],
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		title: "UX Patterns Gallery",
		description: "Educational examples of UX patterns from real websites",
		type: "website",
	},
};

interface LayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${inter.className}`}
			suppressHydrationWarning
		>
			<body className="flex flex-col min-h-screen">
				<RootProvider
					search={{
						enabled: false,
					}}
				>
					<NuqsAdapter>
						<SearchProvider>
							<KeyboardShortcuts />
							<div className="min-h-screen bg-fd-background">
								{/* Header */}
								<Header />

								{/* Main content */}
								<main className="flex-1">{children}</main>

								{/* Footer */}
								<footer className="bg-fd-card border-t border-fd-border mt-16">
									<div className="container-responsive py-8">
										<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
											<div className="flex items-center gap-6 text-sm">
												<Link
													href="/disclaimer"
													className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
												>
													Disclaimer
												</Link>
												<Link
													href="/privacy-policy"
													className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
												>
													Privacy
												</Link>
												<a
													href="https://uxpatterns.dev"
													className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
													target="_blank"
													rel="noopener noreferrer"
												>
													UX Patterns
												</a>
											</div>
										</div>
										{/* Copyright Section */}
										<FooterCopyright />
									</div>
								</footer>
							</div>
						</SearchProvider>
					</NuqsAdapter>
				</RootProvider>
			</body>
		</html>
	);
}
