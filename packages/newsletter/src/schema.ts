import { z } from "zod";

// Common validation schemas
export const subscribeSchema = z.object({
	email: z.email({ message: "Invalid email address" }),
	honeypot: z.string().optional(), // Hidden field for bot detection
	// metadata — all optional, provided by call-site context
	brand: z.string().optional(),
	source_domain: z.string().optional(),
	language: z.string().optional(),
	product: z.string().optional(),
});

export type SubscribeRequest = z.infer<typeof subscribeSchema>;

// Common response format
export interface NewsletterSubscriber {
	id: string | number;
	email: string;
	status: string;
	createdAt: string;
	updatedAt?: string;
}

export interface SubscribeResponse {
	success: boolean;
	message: string;
	subscriber?: NewsletterSubscriber;
	error?: string;
}

// Provider configuration
export interface KitConfig {
	provider: "kit";
	apiKey: string;
	formId: string;
	// Optional: fallback tags if none provided in request
	defaultTagIds?: number[];
	logger?: {
		debug?: (message: string, options?: any) => void;
		warn?: (message: string, options?: any) => void;
		error?: (message: string, options?: any) => void;
	};
}

export interface ResendConfig {
	provider: "resend";
	apiKey: string;
	audienceId: string;
	logger?: {
		debug?: (message: string, options?: any) => void;
		warn?: (message: string, options?: any) => void;
		error?: (message: string, options?: any) => void;
	};
}

export type ProviderConfig = KitConfig | ResendConfig;
