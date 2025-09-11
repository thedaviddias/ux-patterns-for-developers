/**
 * TypeScript types for tracking functionality
 */

import type { SharedEventName } from "./events";

// Plausible tracking function type
export type PlausibleTracker = (
	event: SharedEventName | string,
	options?: { props?: Record<string, string | number> },
) => void;

// Common tracking prop types
export interface FooterLinkProps {
	link_type: "general" | "resource" | "social";
	link_label: string;
}

export interface NavigationProps {
	url: string;
	label?: string;
}

export interface ComponentProps {
	component_name: string;
}

export interface NewsletterProps {
	variant?: "default" | "inline";
}

// Helper function parameter types
export type FooterLinkType = "general" | "resource" | "social";
export type NavigationType = "github" | "main_site" | "pattern";
export type NewsletterEventType = "success" | "error";
export type NewsletterVariant = "default" | "inline";
