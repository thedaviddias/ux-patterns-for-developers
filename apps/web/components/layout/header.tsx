"use client";

import { SOCIAL_LINKS } from "@ux-patterns/constants/social";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface NavItem {
	label: string;
	href: string;
	external?: boolean;
}

const navItems: NavItem[] = [
	{ label: "Patterns", href: "/patterns/getting-started" },
	{ label: "Guides", href: "/pattern-guide" },
	{ label: "Glossary", href: "/glossary" },
	{ label: "MCP", href: "/mcp" },
	{ label: "Blog", href: "/blog" },
];

interface HeaderProps {
	githubStars?: React.ReactNode;
	searchToggle?: React.ReactNode;
	/** Use full width (no container) - for docs pages with sidebar */
	fullWidth?: boolean;
}

export function Header({
	githubStars,
	searchToggle,
	fullWidth = false,
}: HeaderProps) {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div
				className={cn(
					"flex h-14 items-center px-4 md:px-6",
					!fullWidth && "container mx-auto",
				)}
			>
				{/* Logo */}
				<Link
					href="/"
					className="mr-6 flex items-center gap-2 whitespace-nowrap text-lg font-bold"
				>
					UX Patterns
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden items-center gap-1 lg:flex">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"px-3 py-2 text-sm font-medium rounded-md transition-colors",
								"hover:bg-accent hover:text-accent-foreground",
								isActive(item.href)
									? "text-foreground"
									: "text-muted-foreground",
							)}
						>
							{item.label}
						</Link>
					))}
				</nav>

				{/* Right side items */}
				<div className="flex items-center gap-2 ml-auto">
					{/* GitHub Stars */}
					{githubStars && <div className="hidden sm:block">{githubStars}</div>}

					{/* Search Toggle */}
					{searchToggle && (
						<div className="hidden max-w-[240px] items-center lg:flex">
							{searchToggle}
						</div>
					)}

					{/* Mobile Search */}
					{searchToggle && <div className="lg:hidden">{searchToggle}</div>}

					{/* Social Links - Desktop */}
					<div className="hidden items-center gap-1 xl:flex">
						{SOCIAL_LINKS.map((social) => (
							<a
								key={social.label}
								href={social.link}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 text-muted-foreground hover:text-foreground transition-colors"
								aria-label={social.label}
							>
								<span className="[&_svg]:size-4">{social.icon}</span>
							</a>
						))}
					</div>

					{/* Mobile Menu Button */}
					<button
						type="button"
						className="p-2 text-muted-foreground hover:text-foreground lg:hidden"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? (
							<X className="size-5" />
						) : (
							<Menu className="size-5" />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Navigation */}
			{mobileMenuOpen && (
				<div className="border-t bg-background lg:hidden">
					<nav className="container mx-auto px-4 md:px-6 py-4 space-y-1">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"block px-3 py-2 text-sm font-medium rounded-md transition-colors",
									"hover:bg-accent hover:text-accent-foreground",
									isActive(item.href)
										? "bg-accent text-accent-foreground"
										: "text-muted-foreground",
								)}
								onClick={() => setMobileMenuOpen(false)}
							>
								{item.label}
							</Link>
						))}
						{/* Social Links - Mobile */}
						<div className="flex items-center gap-2 pt-4 border-t mt-4">
							{SOCIAL_LINKS.map((social) => (
								<a
									key={social.label}
									href={social.link}
									target="_blank"
									rel="noopener noreferrer"
									className="p-2 text-muted-foreground hover:text-foreground transition-colors"
									aria-label={social.label}
								>
									<span className="[&_svg]:size-4">{social.icon}</span>
								</a>
							))}
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}
