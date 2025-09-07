// URL constants for the UI package

export const BASE_URL = "https://uxpatterns.dev";

export const URLS = {
	// Main app URL
	WEB_APP: BASE_URL,

	// Registry API endpoints
	REGISTRY_BASE: "https://kit.uxpatterns.dev",
	REGISTRY_API: "https://kit.uxpatterns.dev/r",
	REGISTRY_DOCS: "https://kit.uxpatterns.dev/docs/components",

	// External services
	V0_CHAT_API: "https://v0.dev/chat/api/open",
} as const;

// Helper functions for building URLs
export const buildRegistryUrl = (name: string) =>
	`${URLS.REGISTRY_API}/${name}.json`;
export const buildLocalRegistryUrl = (name: string) => `/r/${name}.json`;
export const buildDocsUrl = (componentName: string, variant?: string) => {
	const baseUrl = `${URLS.REGISTRY_DOCS}/${componentName}`;
	return variant ? `${baseUrl}#${variant}` : baseUrl;
};
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
