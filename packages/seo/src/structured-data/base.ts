import type { StructuredDataConfig } from "../types";

/**
 * Base class for creating structured data
 */
export class StructuredDataGenerator {
	protected config: StructuredDataConfig;

	constructor(config: StructuredDataConfig) {
		this.config = config;
	}

	protected absoluteUrl(url?: string): string | undefined {
		if (!url) return undefined;
		if (url.startsWith("http")) return url;
		return new URL(url, this.config.baseUrl).toString();
	}
}
