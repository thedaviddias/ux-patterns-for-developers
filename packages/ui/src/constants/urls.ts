// URL constants for the UI package

export const BASE_URL = "https://uxpatterns.dev";

export const URLS = {
	// Main app URL
	WEB_APP: BASE_URL,

	// External services
	V0_CHAT_API: "https://v0.dev/chat/api/open",
} as const;

// Helper functions for building URLs
export const buildRegistryUrl = (name: string) => `/r/${name}.json`;
export const buildV0Url = (registryUrl: string) =>
	`${URLS.V0_CHAT_API}?url=${encodeURIComponent(registryUrl)}`;

/**
 * Get the appropriate web app URL based on the environment
 * - In development/test: http://localhost:3060
 * - In production: https://uxpatterns.dev
 * - Override with NEXT_PUBLIC_WEB_APP_URL environment variable
 */
export const getWebAppUrl = () => {
	const env = process.env.NODE_ENV;
	if (env === "development" || env === "test") {
		return "http://localhost:3060";
	}
	return process.env.NEXT_PUBLIC_WEB_APP_URL ?? BASE_URL;
};
