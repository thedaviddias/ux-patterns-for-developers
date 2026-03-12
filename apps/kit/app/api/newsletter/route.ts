import {
	checkRateLimit,
	getRateLimitKey,
} from "@ux-patterns/newsletter/rate-limiter";
import { ResendProvider } from "@ux-patterns/newsletter/resend-provider";
import {
	type ResendConfig,
	subscribeSchema,
} from "@ux-patterns/newsletter/schema";
import { NextResponse } from "next/server";

// POST handler for newsletter subscription
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const validationResult = subscribeSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{ success: false, message: "Invalid email address" },
				{ status: 400 },
			);
		}

		const { email, honeypot, source_domain, language, product } =
			validationResult.data;

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

		// Initialize Resend provider
		const resendConfig: ResendConfig = {
			provider: "resend",
			apiKey: process.env.RESEND_API_KEY as string,
			audienceId: process.env.RESEND_AUDIENCE_ID as string,
			logger: {
				debug: (message: string, options?: any) =>
					console.debug(message, options),
				warn: (message: string, options?: any) =>
					console.warn(message, options),
				error: (message: string, options?: any) =>
					console.error(message, options),
			},
		};

		if (!resendConfig.apiKey || !resendConfig.audienceId) {
			console.error("Resend configuration missing");
			return NextResponse.json(
				{
					success: false,
					message: "Newsletter service not configured. Please try again later.",
				},
				{ status: 503 },
			);
		}

		const provider = new ResendProvider(resendConfig);
		const result = await provider.subscribe({
			email,
			source_domain,
			language,
			product,
		});

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
