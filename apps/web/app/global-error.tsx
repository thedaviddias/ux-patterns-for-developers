"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
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
		<html lang="en">
			<head>
				<title>Something went wrong | UX Patterns</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<style
					dangerouslySetInnerHTML={{
						__html: `
							:root {
								--background: 0 0% 100%;
								--foreground: 222.2 84% 4.9%;
								--muted-foreground: 215.4 16.3% 46.9%;
								--primary: 222.2 47.4% 11.2%;
								--primary-foreground: 210 40% 98%;
								--border: 214.3 31.8% 91.4%;
							}
							@media (prefers-color-scheme: dark) {
								:root {
									--background: 0 0% 3.9%;
									--foreground: 0 0% 98%;
									--muted-foreground: 0 0% 63.9%;
									--primary: 0 0% 98%;
									--primary-foreground: 0 0% 3.9%;
									--border: 0 0% 14.9%;
								}
							}
							* { margin: 0; padding: 0; box-sizing: border-box; }
							body {
								font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
								background-color: hsl(var(--background));
								color: hsl(var(--foreground));
								min-height: 100vh;
								display: flex;
								flex-direction: column;
							}
							.header {
								position: sticky;
								top: 0;
								z-index: 50;
								width: 100%;
								height: 3.5rem;
								border-bottom: 1px solid hsl(var(--border));
								background-color: hsl(var(--background) / 0.95);
								backdrop-filter: blur(8px);
								display: flex;
								align-items: center;
								padding: 0 1rem;
							}
							.header-inner {
								display: flex;
								align-items: center;
								max-width: 1280px;
								margin: 0 auto;
								width: 100%;
							}
							.logo {
								font-weight: bold;
								font-size: 1.125rem;
								color: hsl(var(--foreground));
								text-decoration: none;
								margin-right: 1.5rem;
							}
							.nav { display: none; }
							@media (min-width: 768px) {
								.nav { display: flex; align-items: center; gap: 0.25rem; }
							}
							.nav-link {
								padding: 0.5rem 0.75rem;
								font-size: 0.875rem;
								font-weight: 500;
								color: hsl(var(--muted-foreground));
								text-decoration: none;
								border-radius: 0.375rem;
								transition: background-color 0.2s, color 0.2s;
							}
							.nav-link:hover {
								background-color: hsl(var(--foreground) / 0.05);
								color: hsl(var(--foreground));
							}
							.main {
								flex: 1;
								display: flex;
								align-items: center;
								justify-content: center;
								padding: 1rem;
							}
							.content {
								display: flex;
								flex-direction: column;
								align-items: center;
								gap: 1.5rem;
								text-align: center;
								max-width: 32rem;
							}
							.error-header { position: relative; }
							.error-code {
								position: absolute;
								top: -4rem;
								left: 50%;
								transform: translateX(-50%);
								font-size: 10rem;
								font-weight: bold;
								color: hsl(var(--foreground) / 0.05);
								user-select: none;
								line-height: 1;
							}
							.error-title {
								position: relative;
								font-size: 2rem;
								font-weight: bold;
								letter-spacing: -0.025em;
							}
							.error-description {
								color: hsl(var(--muted-foreground));
								font-size: 1.125rem;
							}
							.error-message {
								width: 100%;
								font-family: ui-monospace, monospace;
								font-size: 0.875rem;
								background-color: hsl(var(--foreground) / 0.05);
								color: hsl(var(--foreground) / 0.8);
								padding: 0.5rem 1rem;
								border-radius: 0.5rem;
								word-break: break-word;
							}
							.error-digest {
								font-family: ui-monospace, monospace;
								font-size: 0.75rem;
								color: hsl(var(--muted-foreground));
							}
							.buttons { display: flex; gap: 0.75rem; }
							.btn {
								display: inline-flex;
								align-items: center;
								justify-content: center;
								padding: 0 1rem;
								height: 2.25rem;
								font-size: 0.875rem;
								font-weight: 500;
								border-radius: 0.5rem;
								cursor: pointer;
								transition: opacity 0.2s;
								text-decoration: none;
							}
							.btn:hover { opacity: 0.9; }
							.btn-primary {
								background-color: hsl(var(--primary));
								color: hsl(var(--primary-foreground));
								border: none;
							}
							.btn-outline {
								background-color: transparent;
								color: hsl(var(--foreground));
								border: 1px solid hsl(var(--foreground) / 0.2);
							}
						`,
					}}
				/>
			</head>
			<body>
				<header className="header">
					<div className="header-inner">
						<Link href="/" className="logo">
							UX Patterns
						</Link>
						<nav className="nav">
							<Link href="/patterns/getting-started" className="nav-link">
								Patterns
							</Link>
							<Link href="/pattern-guide" className="nav-link">
								Patterns Guide
							</Link>
							<Link href="/glossary" className="nav-link">
								Glossary
							</Link>
							<Link href="/blog" className="nav-link">
								Blog
							</Link>
						</nav>
					</div>
				</header>
				<main className="main">
					<div className="content">
						<div className="error-header">
							<span className="error-code">500</span>
							<h1 className="error-title">Something went wrong</h1>
						</div>
						<p className="error-description">
							An unexpected error occurred. Our team has been notified.
						</p>
						{error.message && (
							<p className="error-message">{error.message}</p>
						)}
						{error.digest && (
							<p className="error-digest">Error ID: {error.digest}</p>
						)}
						<div className="buttons">
							<button type="button" onClick={reset} className="btn btn-primary">
								Try again
							</button>
							<Link href="/" className="btn btn-outline">
								Return to Home
							</Link>
						</div>
					</div>
				</main>
			</body>
		</html>
	);
}
