import type { NextRequest } from "next/server";

// Good bots — aligned with robots.ts createSEORobots allowlist
const GOOD_BOTS = /Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|facebookexternalhit|Twitterbot|LinkedInBot|Lighthouse|PageSpeed|AhrefsBot|SemrushBot/i;

// Bad bots — from robots.ts (DotBot, MJ12bot, BlexBot) + AI scrapers + headless + scanners
const BAD_BOTS =
	/DotBot|MJ12bot|BlexBot|GPTBot|ClaudeBot|anthropic-ai|CCBot|HeadlessChrome|PhantomJS|Puppeteer|sqlmap|nikto|masscan|Bytespider|PetalBot|Scrapy|HTTrack|wget\/|curl\/|python-requests/i;

// Paths commonly probed by vulnerability scanners
const SUSPICIOUS_PATHS =
	/^\/(wp-admin|wp-login|wp-content|wp-includes|\.env|\.git|phpmyadmin|phpinfo|administrator|cgi-bin|\.aws|\.well-known\/security\.txt)/i;

export type BotType = "good" | "bad" | "suspicious" | "human";

export interface BotDetectionResult {
	isBot: boolean;
	botType: BotType;
	botName: string | null;
}

export function detectBot(
	userAgent: string | null,
	pathname: string,
): BotDetectionResult {
	if (!userAgent || userAgent.trim() === "") {
		return { isBot: true, botType: "suspicious", botName: "empty-ua" };
	}

	const goodMatch = userAgent.match(GOOD_BOTS);
	if (goodMatch) {
		return { isBot: true, botType: "good", botName: goodMatch[0] };
	}

	const badMatch = userAgent.match(BAD_BOTS);
	if (badMatch) {
		return { isBot: true, botType: "bad", botName: badMatch[0] };
	}

	if (SUSPICIOUS_PATHS.test(pathname)) {
		return { isBot: true, botType: "suspicious", botName: "path-scanner" };
	}

	return { isBot: false, botType: "human", botName: null };
}

export function getClientIP(request: NextRequest): string {
	const forwardedFor = request.headers.get("x-forwarded-for");
	const realIp = request.headers.get("x-real-ip");
	const cfConnectingIp = request.headers.get("cf-connecting-ip");

	return (
		forwardedFor?.split(",")[0]?.trim() ||
		realIp ||
		cfConnectingIp ||
		"unknown"
	);
}

// --- Rate limiter (Map-based, Node.js runtime) ---

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Periodic cleanup every 5 minutes to prevent unbounded growth
setInterval(
	() => {
		const now = Date.now();
		for (const [key, entry] of rateLimitMap) {
			if (entry.resetTime < now) {
				rateLimitMap.delete(key);
			}
		}
	},
	5 * 60 * 1000,
);

export function checkRateLimit(
	key: string,
	maxRequests: number,
	windowMs: number = 60_000,
): boolean {
	const now = Date.now();
	const entry = rateLimitMap.get(key);

	if (!entry || entry.resetTime < now) {
		rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
		return true;
	}

	if (entry.count >= maxRequests) {
		return false;
	}

	entry.count++;
	return true;
}

export function getRouteCategory(pathname: string): {
	category: string;
	limit: number;
} {
	if (pathname === "/proxy/api/event" || pathname === "/api/event") {
		return { category: "analytics", limit: 10 };
	}
	if (pathname.startsWith("/api/")) {
		return { category: "api", limit: 20 };
	}
	return { category: "page", limit: 30 };
}
