declare global {
	interface Window {
		op?: (...args: unknown[]) => void;
	}
}

/**
 * Track a custom event via OpenPanel.
 *
 * Safe to call at any time -- events are queued until the SDK loads.
 * No-ops on the server (SSR) where `window` is unavailable.
 */
export function track(
	event: string,
	properties?: Record<string, string | number>,
): void {
	if (typeof window !== "undefined" && window.op) {
		window.op("track", event, properties);
	}
}
