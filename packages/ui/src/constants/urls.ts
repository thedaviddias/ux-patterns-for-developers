// URL constants for the UI package

export const URLS = {
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
