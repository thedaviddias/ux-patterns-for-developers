import "@/app/global.css";
import { ThemeToggle } from "fumadocs-ui/components/layout/theme-toggle";
import { RootProvider } from "fumadocs-ui/provider";
import { Github } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { HeaderSearchWrapper } from "@/components/header/header-search-wrapper";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "UX Patterns Gallery",
	description:
		"Visual examples of UX patterns - good and bad implementations from real websites",
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
				<RootProvider>
					<NuqsAdapter>
						<div className="min-h-screen bg-fd-background">
							{/* Header */}
							<header className="bg-fd-card border-b border-fd-border">
								<div className="container-responsive">
									<div className="flex items-center justify-between h-16">
										<Link
											href="/"
											className="text-xl font-bold text-fd-foreground hover:text-fd-primary transition-colors"
										>
											UX Patterns Gallery
										</Link>

										<nav className="hidden md:flex items-center space-x-6">
											<Link
												href="/"
												className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
											>
												Gallery
											</Link>
											<Link
												href="/gallery/websites"
												className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
											>
												Websites
											</Link>
											<Link
												href="/docs"
												className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
											>
												Docs
											</Link>
										</nav>

										{/* Search */}
										<div className="flex-1 max-w-md mx-6">
											<HeaderSearchWrapper />
										</div>

										<div className="flex items-center gap-2">
											<ThemeToggle />
											<a
												href="https://github.com/thedaviddias/ux-patterns-for-developers"
												target="_blank"
												rel="noopener noreferrer"
												className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
											>
												<Github className="w-5 h-5" />
												<span className="sr-only">GitHub</span>
											</a>
										</div>
									</div>
								</div>
							</header>

							{/* Main content */}
							<main className="flex-1">{children}</main>

							{/* Footer */}
							<footer className="bg-fd-card border-t border-fd-border mt-16">
								<div className="container-responsive py-8">
									<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
										<p className="text-fd-muted-foreground text-sm">
											Educational examples for UX pattern analysis
										</p>
										<div className="flex items-center gap-6 text-sm">
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
								</div>
							</footer>
						</div>
					</NuqsAdapter>
				</RootProvider>
			</body>
		</html>
	);
}
