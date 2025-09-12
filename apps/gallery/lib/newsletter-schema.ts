import { z } from "zod";

// Common validation schemas - matching exactly what's in apps/web
export const subscribeSchema = z.object({
	email: z.email({ message: "Invalid email address" }),
	groups: z.array(z.union([z.string(), z.number()])).optional(), // Accept both string and number tag IDs
	honeypot: z.string().optional(), // Hidden field for bot detection
});

export type SubscribeRequest = z.infer<typeof subscribeSchema>;

// Common response format
export interface NewsletterSubscriber {
	id: string | number;
	email: string;
	status: string;
	createdAt: string;
	updatedAt?: string;
	groups?: string[];
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
		debug: (message: string, options?: any) => void;
		warn: (message: string, options?: any) => void;
		error: (message: string, options?: any) => void;
	};
}

export type ProviderConfig = KitConfig;
