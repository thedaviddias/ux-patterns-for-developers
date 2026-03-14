"use client";

import { usePlausible } from "next-plausible";
import { useId, useState } from "react";
import {
	getTrackingClass,
	TRACKING_EVENTS,
	trackNewsletterEvent,
} from "@/lib/tracking";

interface SubscribeFormProps {
	variant?: "default" | "inline";
}

// Shared CSS classes to avoid duplication
const FORM_CLASSES = "w-full max-w-md mx-auto";
const SECTION_CLASSES = {
	inline:
		"mt-12 mb-8 rounded-[1.5rem] border border-border/70 bg-card/80 px-6 py-6 text-center backdrop-blur",
	default:
		"container mx-auto mt-6 max-w-4xl rounded-[2rem] border border-border/70 bg-card/85 px-6 py-10 text-center backdrop-blur sm:px-8",
};

export const SubscribeForm = ({ variant = "default" }: SubscribeFormProps) => {
	const plausible = usePlausible();
	const subscribeTitleId = useId();
	const subscribeMessageId = useId();
	const newsletterEmailId = useId();
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [message, setMessage] = useState("");
	const [honeypot, setHoneypot] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const trimmedEmail = email.trim();

		// Client-side validation
		if (!trimmedEmail) {
			setStatus("error");
			setMessage("Please enter a valid email");
			return;
		}

		// Basic email pattern validation
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(trimmedEmail)) {
			setStatus("error");
			setMessage("Please enter a valid email");
			return;
		}

		setStatus("loading");
		setMessage("");

		// Basic bot mitigation - ignore if honeypot is filled
		if (honeypot) {
			setStatus("error");
			setMessage("Invalid submission detected.");
			return;
		}

		try {
			const response = await fetch("/api/newsletter", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: trimmedEmail,
					honeypot: honeypot || "",
					brand: "uxpatterns",
					source_domain: "uxpatterns.dev",
					language: "en",
					product: "newsletter",
				}),
			});

			const contentType = response.headers.get("content-type") || "";
			const data = contentType.includes("application/json")
				? await response.json()
				: null;

			if (response.ok && data?.success) {
				setStatus("success");
				setMessage(data.message || "Subscribed successfully.");
				setEmail("");
				trackNewsletterEvent(plausible, "success", variant);
			} else {
				setStatus("error");
				setMessage((data && (data.message as string)) || "Failed to subscribe");
				trackNewsletterEvent(plausible, "error", variant);
			}
		} catch (_error) {
			setStatus("error");
			setMessage("Network error. Please try again.");
			trackNewsletterEvent(plausible, "error", variant);
		}
	};

	const isInline = variant === "inline";

	return (
		<section
			className={SECTION_CLASSES[isInline ? "inline" : "default"]}
			aria-labelledby={subscribeTitleId}
		>
			{isInline ? (
				<>
					<h3
						id={subscribeTitleId}
						className="text-lg font-semibold mb-2 text-foreground"
					>
						Stay updated with new patterns
					</h3>
					<p className="text-sm text-muted-foreground mb-4">
						Get notified when new UX patterns are added to the collection.
					</p>
				</>
			) : (
				<>
					<h2
						id={subscribeTitleId}
						className="text-3xl font-semibold text-foreground sm:text-4xl"
					>
						Get new patterns in your inbox
					</h2>
					<p className="mx-auto mb-5 mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
						Occasional updates when a new pattern, comparison guide, or major
						reference section lands.
					</p>
				</>
			)}

			<form
				onSubmit={handleSubmit}
				aria-busy={status === "loading"}
				className={FORM_CLASSES}
			>
				<div className="flex flex-col sm:flex-row gap-3">
					<label htmlFor={newsletterEmailId} className="sr-only">
						Email address
					</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						onFocus={() => {
							const eventName = isInline
								? TRACKING_EVENTS.NEWSLETTER_INLINE_INPUT_FOCUS
								: TRACKING_EVENTS.NEWSLETTER_INPUT_FOCUS;
							plausible(eventName);
						}}
						placeholder="Enter your email"
						name="email"
						id={newsletterEmailId}
						autoComplete="email"
						inputMode="email"
						required
						disabled={status === "loading"}
						aria-invalid={status === "error"}
						aria-describedby={message ? subscribeMessageId : undefined}
						aria-errormessage={
							status === "error" ? subscribeMessageId : undefined
						}
						className={`${getTrackingClass(variant).newsletterInputFocus} flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-50`}
					/>
					{/* Honeypot field for basic bot mitigation */}
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
						disabled={status === "loading"}
						className={`${getTrackingClass(variant).newsletterButtonClick} rounded-2xl border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/92 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2`}
					>
						{status === "loading" ? "Subscribing..." : "Subscribe"}
					</button>
				</div>

				{message && (
					<output
						id={subscribeMessageId}
						role={status === "error" ? "alert" : "status"}
						aria-live={status === "error" ? "assertive" : "polite"}
						className={`${isInline ? "mt-2" : "mt-3"} text-sm block ${status === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
					>
						{message}
					</output>
				)}
			</form>
		</section>
	);
};
