import { KitProvider } from "@ux-patterns/newsletter/kit-provider";
import {
	checkRateLimit,
	getRateLimitKey,
} from "@ux-patterns/newsletter/rate-limiter";
import {
	type KitConfig,
	subscribeSchema,
} from "@ux-patterns/newsletter/schema";
import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";

// POST handler for newsletter subscription
export async function POST(request: Request) {
	try {
		// BotID verification - blocks automated bots
		const verification = await checkBotId();
		if (verification.isBot) {
			return NextResponse.json(
				{ success: false, message: "Access denied" },
				{ status: 403 },
			);
		}

		const body = await request.json();
		const validationResult = subscribeSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{ success: false, message: "Invalid email address" },
				{ status: 400 },
			);
		}

		const { email, groups, honeypot } = validationResult.data;

		// Bot detection: if honeypot field is filled, reject the request
		if (honeypot && honeypot.trim() !== "") {
			return NextResponse.json(
				{ success: false, message: "Invalid submission detected." },
				{ status: 400 },
			);
		}

		// Server-side rate limiting based on IP address
		const rateLimitKey = getRateLimitKey(request);
		if (!checkRateLimit(rateLimitKey)) {
			return NextResponse.json(
				{
					success: false,
					message: "Too many requests. Please try again in a minute.",
				},
				{ status: 429 },
			);
		}

		// Initialize Kit provider
		const kitConfig: KitConfig = {
			provider: "kit",
			apiKey: process.env.KIT_API_KEY as string,
			formId: process.env.KIT_FORM_ID as string,
			defaultTagIds: process.env.KIT_DEFAULT_TAG_IDS?.split(",")
				.map((id) => Number(id.trim()))
				.filter((id) => !Number.isNaN(id)),
			logger: {
				debug: (message: string, options?: any) =>
					console.debug(message, options),
				warn: (message: string, options?: any) =>
					console.warn(message, options),
				error: (message: string, options?: any) =>
					console.error(message, options),
			},
		};

		if (!kitConfig.apiKey || !kitConfig.formId) {
			console.error("ConvertKit configuration missing");
			return NextResponse.json(
				{
					success: false,
					message: "Newsletter service not configured. Please try again later.",
				},
				{ status: 503 },
			);
		}

		const provider = new KitProvider(kitConfig);
		const result = await provider.subscribe({ email, groups });

		if (result.success) {
			return NextResponse.json(result, { status: 200 });
		} else {
			return NextResponse.json(result, { status: 400 });
		}
	} catch (error) {
		console.error("Newsletter subscription error:", error);

		return NextResponse.json(
			{
				success: false,
				message: "An unexpected error occurred. Please try again later.",
			},
			{ status: 500 },
		);
	}
}
