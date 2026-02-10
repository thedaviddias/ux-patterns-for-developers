import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
	checkRateLimit,
	detectBot,
	getClientIP,
	getRouteCategory,
} from "@/lib/bot-detection";

export function proxy(request: NextRequest) {
	const userAgent = request.headers.get("user-agent");
	const pathname = request.nextUrl.pathname;
	const clientIP = getClientIP(request);

	const detection = detectBot(userAgent, pathname);

	// Fast path: good bots pass through immediately
	if (detection.botType === "good") {
		return NextResponse.next();
	}

	// Block known bad bots
	if (detection.botType === "bad") {
		return new Response("Forbidden", {
			status: 403,
			headers: { "X-Blocked-Reason": "bad-bot" },
		});
	}

	// Block suspicious requests (empty UA, vulnerability scanners)
	if (detection.botType === "suspicious") {
		return new Response("Forbidden", {
			status: 403,
			headers: { "X-Blocked-Reason": "suspicious" },
		});
	}

	// Skip rate limiting for prefetch requests
	const isPrefetch =
		request.headers.has("next-router-prefetch") ||
		request.headers.get("purpose") === "prefetch";
	if (isPrefetch) {
		return NextResponse.next();
	}

	// Rate limiting per IP + route category
	const { category, limit } = getRouteCategory(pathname);
	const rateLimitKey = `${clientIP}:${category}`;

	if (!checkRateLimit(rateLimitKey, limit)) {
		return new Response("Too Many Requests", {
			status: 429,
			headers: {
				"Retry-After": "60",
				"X-RateLimit-Category": category,
			},
		});
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		{
			source:
				"/((?!api/health|_next/static|_next/image|_vercel|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)",
			missing: [{ type: "header", key: "next-action" }],
		},
	],
};
