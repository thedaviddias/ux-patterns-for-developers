import type {
	KitConfig,
	NewsletterSubscriber,
	SubscribeRequest,
	SubscribeResponse,
} from "./schema";

const API_BASE = "https://api.kit.com/v4";

export class KitProvider {
	private config: KitConfig;

	constructor(config: KitConfig) {
		this.config = config;

		if (!config.apiKey) {
			throw new Error("Kit (ConvertKit) API key is required");
		}
		if (!config.formId) {
			throw new Error("Kit (ConvertKit) form ID is required");
		}
	}

	async subscribe(data: SubscribeRequest): Promise<SubscribeResponse> {
		try {
			this.config.logger?.debug("Kit: Creating subscriber", {
				data: { email: data.email, tagsCount: data.groups?.length },
				tags: { type: "newsletter" },
			});

			// First, create the subscriber
			const createSubscriberBody: any = {
				email_address: data.email,
			};

			// Convert groups to tags for Kit (groups in our API = tags in Kit)
			// Kit API expects tag IDs as numbers
			const tags =
				data.groups
					?.map((tag) => (typeof tag === "string" ? Number(tag) : tag))
					.filter((tag) => typeof tag === "number" && !Number.isNaN(tag)) ||
				this.config.defaultTagIds;
			if (tags && tags.length > 0) {
				createSubscriberBody.tags = tags;
			}

			// Create subscriber first
			const createResponse = await fetch(`${API_BASE}/subscribers`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Kit-Api-Key": this.config.apiKey,
				},
				body: JSON.stringify(createSubscriberBody),
			});

			if (!createResponse.ok) {
				const errorText = await createResponse.text();

				// If subscriber already exists (409), continue to add to form
				if (createResponse.status !== 409) {
					throw new Error(
						`Failed to create subscriber: ${createResponse.status} - ${errorText}`,
					);
				}
			}

			// Now add subscriber to the form
			const formRequestBody = {
				email_address: data.email,
			};

			const url = `${API_BASE}/forms/${this.config.formId}/subscribers`;

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Kit-Api-Key": this.config.apiKey,
				},
				body: JSON.stringify(formRequestBody),
			});

			if (!response.ok) {
				const errorText = await response.text();

				// Handle specific Kit errors
				if (response.status === 400) {
					try {
						const errorData = JSON.parse(errorText);
						if (errorData.error?.includes("already subscribed")) {
							return {
								success: true, // Kit considers this a success
								message: "Already subscribed to newsletter",
								subscriber: {
									id: "existing",
									email: data.email,
									status: "active",
									createdAt: new Date().toISOString(),
								},
							};
						}
					} catch {
						// If we can't parse the error, fall back to generic message
					}
				}

				throw new Error(
					`Failed to create subscriber: ${response.status} - ${errorText}`,
				);
			}

			const result = await response.json();

			// Map Kit v4 response to our common format
			const subscriber: NewsletterSubscriber = {
				id: result.subscriber?.id || result.id || "unknown",
				email: result.subscriber?.email_address || data.email,
				status: result.subscriber?.state || "active",
				createdAt: result.subscriber?.created_at || new Date().toISOString(),
			};

			// Step 3: Assign tags to the subscriber (if we have tags to assign)
			if (tags && tags.length > 0 && subscriber.id !== "unknown") {
				try {
					const _tagResponse = await fetch(
						`${API_BASE}/subscribers/${subscriber.id}/tags`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"X-Kit-Api-Key": this.config.apiKey,
							},
							body: JSON.stringify({ tags: tags }),
						},
					);
				} catch {
					// Don't fail the entire operation if tag assignment fails
				}
			}

			return {
				success: true,
				message: "Successfully subscribed to newsletter",
				subscriber,
			};
		} catch (error) {
			this.config.logger?.error("Kit subscription error", {
				data: error,
				tags: { provider: "kit" },
			});

			return {
				success: false,
				message: "Failed to subscribe to newsletter",
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	async unsubscribe(
		email: string,
	): Promise<{ success: boolean; message: string }> {
		try {
			// First, get the subscriber to get their ID
			const searchResponse = await fetch(
				`${API_BASE}/subscribers?email_address=${encodeURIComponent(email)}`,
				{
					method: "GET",
					headers: {
						"X-Kit-Api-Key": this.config.apiKey,
					},
				},
			);

			if (!searchResponse.ok) {
				throw new Error("Failed to find subscriber");
			}

			const searchResult = await searchResponse.json();
			const subscriber = searchResult.subscribers?.[0];

			if (!subscriber) {
				return {
					success: false,
					message: "Subscriber not found",
				};
			}

			// Kit v4 API - unsubscribe the subscriber
			const response = await fetch(
				`${API_BASE}/subscribers/${subscriber.id}/unsubscribe`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Kit-Api-Key": this.config.apiKey,
					},
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to unsubscribe: ${errorText}`);
			}

			return {
				success: true,
				message: "Successfully unsubscribed",
			};
		} catch (error) {
			this.config.logger?.error("Kit unsubscribe error", {
				data: error,
				tags: { provider: "kit" },
			});

			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to unsubscribe",
			};
		}
	}

	async getSubscriber(email: string): Promise<NewsletterSubscriber | null> {
		try {
			// Kit v4 API - search for subscriber
			const response = await fetch(
				`${API_BASE}/subscribers?email_address=${encodeURIComponent(email)}`,
				{
					method: "GET",
					headers: {
						"X-Kit-Api-Key": this.config.apiKey,
					},
				},
			);

			if (!response.ok) {
				return null;
			}

			const result = await response.json();
			const subscriber = result.subscribers?.[0];

			if (!subscriber) {
				return null;
			}

			return {
				id: subscriber.id,
				email: subscriber.email_address,
				status: subscriber.state,
				createdAt: subscriber.created_at,
			};
		} catch (error) {
			this.config.logger?.error("Kit get subscriber error", {
				data: error,
				tags: { provider: "kit" },
			});
			return null;
		}
	}
}
