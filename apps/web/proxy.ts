import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { detectBot, getClientIP, getRouteCategory } from "@/lib/bot-detection";
import { checkRateLimit, getRateLimitStore } from "@/lib/rate-limit-store";

const MCP_HOST = "mcp.uxpatterns.dev";
const MCP_ROUTE = "/api/mcp";
// MCP clients (Claude Desktop, Cursor, scripts) are programmatic and bursty.
// Cap per IP so a single client/abuser can't run up function compute, while
// still allowing legitimate tool-call traffic.
const MCP_RATE_LIMIT = 30;

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
	const userAgent = request.headers.get("user-agent");
	const clientIP = getClientIP(request);

	// MCP host maps entirely to the /api/mcp function. Protect it at the edge
	// BEFORE rewriting, otherwise the function takes every hit unthrottled.
	if (host === MCP_HOST) {
		// Block known-bad scrapers, but not empty/odd UAs: legit MCP HTTP
		// clients frequently send no recognizable User-Agent.
		if (detectBot(userAgent, pathname).botType === "bad") {
			return new Response("Forbidden", { status: 403 });
		}

		const mcpRateLimit = await checkRateLimit(
			getRateLimitStore(),
			`${clientIP ?? "anonymous"}:mcp`,
			MCP_RATE_LIMIT,
		);
		if (!mcpRateLimit.allowed) {
			return new Response("Too Many Requests", {
				status: 429,
				headers: {
					"Retry-After": String(mcpRateLimit.retryAfterSeconds),
				},
			});
		}

		if (pathname !== MCP_ROUTE) {
			const url = request.nextUrl.clone();
			url.pathname = MCP_ROUTE;
			url.search = "";
			return NextResponse.rewrite(url);
		}
		return NextResponse.next();
	}

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
