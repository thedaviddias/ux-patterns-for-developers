import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { detectBot, getClientIP, getRouteCategory } from "@/lib/bot-detection";
import { checkRateLimit, getRateLimitStore } from "@/lib/rate-limit-store";

export async function proxy(request: NextRequest) {
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
		return new Response("Forbidden", { status: 403 });
	}

	// Block suspicious requests (empty UA, vulnerability scanners)
	if (detection.botType === "suspicious") {
		return new Response("Forbidden", { status: 403 });
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
	const rateLimitIdentifier = clientIP ?? "anonymous";

	if (!clientIP) {
		console.warn(
			"Client IP headers were missing in proxy middleware. Falling back to the anonymous rate-limit bucket.",
		);
	}

	// Public page traffic is naturally bursty across route navigations and RSC fetches.
	// Scope page limits to the pathname to avoid cross-page contention for legitimate users.
	const rateLimitKey =
		category === "page"
			? `${rateLimitIdentifier}:${category}:${pathname}`
			: `${rateLimitIdentifier}:${category}`;
	const rateLimitResult = await checkRateLimit(
		getRateLimitStore(),
		rateLimitKey,
		limit,
	);

	if (!rateLimitResult.allowed) {
		return new Response("Too Many Requests", {
			status: 429,
			headers: {
				"Retry-After": String(rateLimitResult.retryAfterSeconds),
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
