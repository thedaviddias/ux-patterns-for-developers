"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<div className="flex flex-1 flex-col">
			{/* Simple inline header - avoids complex components that could fail */}
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
				<div className="container mx-auto flex h-14 items-center px-4 md:px-6">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold text-lg mr-6"
					>
						UX Patterns
					</Link>
					<nav className="hidden md:flex items-center gap-1">
						<Link
							href="/patterns/getting-started"
							className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
						>
							Patterns
						</Link>
						<Link
							href="/pattern-guide"
							className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
						>
							Patterns Guide
						</Link>
						<Link
							href="/glossary"
							className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
						>
							Glossary
						</Link>
						<Link
							href="/blog"
							className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
						>
							Blog
						</Link>
					</nav>
				</div>
			</header>

			<main className="flex flex-1 items-center justify-center px-4">
				<div className="flex flex-col items-center justify-center space-y-6 text-center max-w-lg">
					<div className="relative">
						<span className="absolute -top-16 left-1/2 -translate-x-1/2 select-none text-[10rem] font-bold text-zinc-200/20 dark:text-zinc-800/30 leading-none">
							500
						</span>
						<h1 className="relative text-3xl font-bold tracking-tighter sm:text-4xl">
							Something went wrong
						</h1>
					</div>
					<p className="text-zinc-500 dark:text-zinc-400 text-lg">
						An unexpected error occurred. Our team has been notified.
					</p>
					{error.message && (
						<p className="w-full rounded-md bg-zinc-100 px-4 py-2 font-mono text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
							{error.message}
						</p>
					)}
					{error.digest && (
						<p className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
							Error ID: {error.digest}
						</p>
					)}
					<div className="flex gap-3">
						<button
							type="button"
							onClick={reset}
							className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-9 px-4 bg-primary text-primary-foreground shadow hover:bg-primary/90"
						>
							Try again
						</button>
						<Link
							href="/"
							className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-9 px-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
						>
							Return to Home
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
