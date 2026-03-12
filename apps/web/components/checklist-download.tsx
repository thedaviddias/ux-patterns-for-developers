"use client";

import { cn } from "@ux-patterns/ui/lib/utils";
import { Download, X } from "lucide-react";
import { usePlausible } from "next-plausible";
import { useEffect, useId, useRef, useState } from "react";
import {
	type PatternChecklist,
	TESTING_CHECKLISTS,
} from "@/lib/testing-checklists";
import { TRACKING_EVENTS } from "@/lib/tracking";

interface ChecklistDownloadProps {
	patternSlug: string;
}

type FormStatus = "idle" | "email-prompt" | "loading" | "success" | "error";

function generateMarkdown(checklist: PatternChecklist): string {
	const date = new Date().toISOString().split("T")[0];
	const lines: string[] = [
		`# ${checklist.patternName} — Testing Checklist`,
		`> Source: uxpatterns.dev${checklist.patternUrl}`,
		`> Downloaded: ${date}`,
		"",
	];

	for (const section of checklist.sections) {
		lines.push(`## ${section.title}`);
		lines.push("");
		for (const item of section.items) {
			lines.push(`- [ ] ${item}`);
		}
		lines.push("");
	}

	return lines.join("\n");
}

function triggerMarkdownDownload(
	checklist: PatternChecklist,
	slug: string,
): void {
	const md = generateMarkdown(checklist);
	const blob = new Blob([md], { type: "text/markdown" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${slug}-testing-checklist.md`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export const ChecklistDownload = ({ patternSlug }: ChecklistDownloadProps) => {
	const plausible = usePlausible();
	const emailId = useId();
	const messageId = useId();
	const [status, setStatus] = useState<FormStatus>("idle");
	const [alreadyDownloaded, setAlreadyDownloaded] = useState(false);
	const [email, setEmail] = useState("");
	const [honeypot, setHoneypot] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const emailInputRef = useRef<HTMLInputElement>(null);

	const storageKey = `checklist_downloaded_${patternSlug}`;
	const EMAIL_STORAGE_KEY = "checklist_email";
	const checklist = TESTING_CHECKLISTS[patternSlug];

	useEffect(() => {
		if (typeof window !== "undefined") {
			setAlreadyDownloaded(!!localStorage.getItem(storageKey));
			const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
			if (savedEmail) setEmail(savedEmail);
		}
	}, [storageKey]);

	// Focus email input when prompt opens
	useEffect(() => {
		if (status === "email-prompt") {
			emailInputRef.current?.focus();
		}
	}, [status]);

	if (!checklist) return null;

	const handleDownloadClick = () => {
		plausible(TRACKING_EVENTS.CHECKLIST_DOWNLOAD_CLICK, {
			props: { pattern: patternSlug },
		});

		if (alreadyDownloaded) {
			triggerMarkdownDownload(checklist, patternSlug);
			return;
		}

		// If we already have a saved email, submit silently without showing the form
		const savedEmail =
			typeof window !== "undefined"
				? localStorage.getItem(EMAIL_STORAGE_KEY)
				: null;
		if (savedEmail) {
			submitDownload(savedEmail);
			return;
		}

		setStatus("email-prompt");
	};

	const submitDownload = async (emailToUse: string) => {
		setStatus("loading");
		setErrorMessage("");

		try {
			const response = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: emailToUse,
					honeypot: "",
					brand: "ux-patterns",
					source_domain: "uxpatterns.dev",
					language: "en",
					product: "testing-guidelines",
				}),
			});

			const contentType = response.headers.get("content-type") || "";
			const data = contentType.includes("application/json")
				? await response.json()
				: null;

			if (response.ok && data?.success) {
				triggerMarkdownDownload(checklist, patternSlug);
				localStorage.setItem(storageKey, "1");
				localStorage.setItem(EMAIL_STORAGE_KEY, emailToUse);
				setAlreadyDownloaded(true);
				setStatus("success");
				plausible(TRACKING_EVENTS.CHECKLIST_DOWNLOAD_SUCCESS, {
					props: { pattern: patternSlug },
				});
			} else {
				setErrorMessage(
					(data && (data.message as string)) || "Failed to subscribe.",
				);
				setStatus("error");
				plausible(TRACKING_EVENTS.CHECKLIST_DOWNLOAD_ERROR, {
					props: { pattern: patternSlug },
				});
			}
		} catch {
			setErrorMessage("Network error. Please try again.");
			setStatus("error");
			plausible(TRACKING_EVENTS.CHECKLIST_DOWNLOAD_ERROR, {
				props: { pattern: patternSlug },
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const trimmedEmail = email.trim();
		if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
			setErrorMessage("Please enter a valid email address.");
			return;
		}

		if (honeypot) {
			setErrorMessage("Invalid submission detected.");
			return;
		}

		await submitDownload(trimmedEmail);
	};

	const handleCollapse = () => {
		setStatus("idle");
		setEmail("");
		setErrorMessage("");
	};

	const isLoading = status === "loading";
	const showForm =
		status === "email-prompt" || status === "loading" || status === "error";

	return (
		<section
			aria-label="Download testing checklist"
			className={cn(
				"not-prose relative mt-8 mb-8 rounded-lg overflow-hidden",
				"border border-border/50",
				"px-4 py-3 transition-all duration-200",
			)}
		>
			{/* Background gradient — blue/indigo theme */}
			<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 opacity-50" />

			{/* Geometric SVG pattern */}
			<svg
				className="absolute inset-0 w-full h-full opacity-10"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<defs>
					<pattern
						id={`checklist-pattern-${patternSlug}`}
						x="0"
						y="0"
						width="40"
						height="40"
						patternUnits="userSpaceOnUse"
					>
						<rect
							x="10"
							y="10"
							width="20"
							height="20"
							fill="none"
							stroke="currentColor"
							strokeWidth="1"
							className="text-indigo-500"
						/>
					</pattern>
				</defs>
				<rect
					width="100%"
					height="100%"
					fill={`url(#checklist-pattern-${patternSlug})`}
				/>
			</svg>

			<div className="relative">
				{/* Header row */}
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm shrink-0">
							<Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
						</div>
						<div className="flex flex-col">
							<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Testing Checklist
							</span>
							<span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
								{status === "success"
									? "Downloaded! Check your inbox too."
									: "Take this checklist into your project"}
							</span>
							{status !== "success" && (
								<span className="text-xs text-muted-foreground mt-0.5">
									Get the <strong>{checklist.patternName}</strong> testing
									checklist as a .md file
								</span>
							)}
						</div>
					</div>

					{!showForm && status !== "success" && (
						<button
							type="button"
							onClick={handleDownloadClick}
							className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							<Download className="h-3.5 w-3.5" />
							{alreadyDownloaded ? "Download again" : "Download .md"}
						</button>
					)}

					{showForm && (
						<button
							type="button"
							onClick={handleCollapse}
							aria-label="Cancel download"
							className="shrink-0 p-1 rounded text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				{/* Inline email form */}
				{showForm && (
					<form
						onSubmit={handleSubmit}
						aria-busy={isLoading}
						className="mt-3"
						noValidate
					>
						<div className="flex flex-col sm:flex-row gap-2">
							<label htmlFor={emailId} className="sr-only">
								Email address
							</label>
							<input
								ref={emailInputRef}
								id={emailId}
								type="email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email to download"
								autoComplete="email"
								inputMode="email"
								required
								disabled={isLoading}
								aria-invalid={!!errorMessage}
								aria-describedby={errorMessage ? messageId : undefined}
								className="flex-1 px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
							/>
							{/* Honeypot */}
							<input
								type="text"
								value={honeypot}
								onChange={(e) => setHoneypot(e.target.value)}
								style={{ display: "none" }}
								tabIndex={-1}
								autoComplete="off"
								aria-hidden="true"
							/>
							<button
								type="submit"
								disabled={isLoading}
								className="shrink-0 px-4 py-1.5 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
							>
								{isLoading ? "Downloading..." : "Download"}
							</button>
						</div>

						{errorMessage && (
							<output
								id={messageId}
								role="alert"
								aria-live="assertive"
								className="mt-2 text-sm block text-red-600 dark:text-red-400"
							>
								{errorMessage}
							</output>
						)}
					</form>
				)}
			</div>
		</section>
	);
};
