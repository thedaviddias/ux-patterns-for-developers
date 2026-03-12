import { Resend } from "resend";
import type {
	NewsletterSubscriber,
	ResendConfig,
	SubscribeRequest,
	SubscribeResponse,
} from "./schema";

export class ResendProvider {
	private resend: Resend;
	private config: ResendConfig;

	constructor(config: ResendConfig) {
		this.config = config;

		if (!config.apiKey) {
			throw new Error("Resend API key is required");
		}
		if (!config.audienceId) {
			throw new Error("Resend audience ID is required");
		}

		this.resend = new Resend(config.apiKey);
	}

	async subscribe(data: SubscribeRequest): Promise<SubscribeResponse> {
		try {
			this.config.logger?.debug("Resend: Adding contact", {
				email: data.email,
				product: data.product,
				brand: data.brand,
			});

			// Build custom properties from metadata fields
			const properties: Record<string, string | number | null> = {};
			if (data.brand) properties.brand = data.brand;
			if (data.source_domain) properties.source_domain = data.source_domain;
			if (data.language) properties.language = data.language;
			if (data.product) properties.product = data.product;

			const { data: contact, error } = await this.resend.contacts.create({
				email: data.email,
				unsubscribed: false,
				...(Object.keys(properties).length > 0 ? { properties } : {}),
			});

			if (error) {
				// "Contact already exists" is treated as success
				if (
					"name" in error &&
					(error.name === "validation_error" ||
						error.message?.includes("already exists"))
				) {
					return {
						success: true,
						message: "Already subscribed to newsletter",
						subscriber: {
							id: "existing",
							email: data.email,
							status: "existing",
							createdAt: new Date().toISOString(),
						},
					};
				}

				throw new Error(`Resend error: ${error.message}`);
			}

			const subscriber: NewsletterSubscriber = {
				id: contact?.id ?? "unknown",
				email: data.email,
				status: "active",
				createdAt: new Date().toISOString(),
			};

			return {
				success: true,
				message: "Successfully subscribed to newsletter",
				subscriber,
			};
		} catch (error) {
			this.config.logger?.error("Resend subscription error", { error });

			return {
				success: false,
				message: "Failed to subscribe to newsletter",
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}
