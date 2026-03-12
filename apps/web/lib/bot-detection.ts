import type { NextRequest } from "next/server";

// Good bots — aligned with robots.ts createSEORobots allowlist
const GOOD_BOTS =
	/Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|facebookexternalhit|Twitterbot|LinkedInBot|Lighthouse|PageSpeed|AhrefsBot|SemrushBot/i;

// Bad bots — from robots.ts (DotBot, MJ12bot, BlexBot) + AI scrapers + headless + scanners
const BAD_BOTS =
	/DotBot|MJ12bot|BlexBot|GPTBot|ClaudeBot|anthropic-ai|CCBot|HeadlessChrome|PhantomJS|Puppeteer|sqlmap|nikto|masscan|Bytespider|PetalBot|Scrapy|HTTrack|wget\/|curl\/|python-requests/i;

// Paths commonly probed by vulnerability scanners
const SUSPICIOUS_PATHS =
	/^\/(wp-admin|wp-login|wp-content|wp-includes|\.env|\.git|phpmyadmin|phpinfo|administrator|cgi-bin|\.aws)/i;

export type BotType = "good" | "bad" | "suspicious" | "human";

export interface BotDetectionResult {
	isBot: boolean;
	botType: BotType;
	botName: string | null;
}

const TRUSTED_CLIENT_IP_HEADERS = [
	"x-vercel-forwarded-for",
	"x-forwarded-for",
	"cf-connecting-ip",
	"x-real-ip",
	"fly-client-ip",
] as const;

function getTrustedHeaderValue(
	request: NextRequest,
	headerName: (typeof TRUSTED_CLIENT_IP_HEADERS)[number],
): string | null {
	const value = request.headers.get(headerName)?.trim();
	if (!value) {
		return null;
	}

	const firstValue = value
		.split(",")
		.map((part) => part.trim())
		.find(Boolean);

	return firstValue ?? null;
}

export function detectBot(
	userAgent: string | null,
	pathname: string,
): BotDetectionResult {
	if (!userAgent || userAgent.trim() === "") {
		return { isBot: true, botType: "suspicious", botName: "empty-ua" };
	}

	// Mixed user agents like "Googlebot HeadlessChrome" must remain blocked.
	const badMatch = userAgent.match(BAD_BOTS);
	if (badMatch) {
		return { isBot: true, botType: "bad", botName: badMatch[0] };
	}

	if (SUSPICIOUS_PATHS.test(pathname)) {
		return { isBot: true, botType: "suspicious", botName: "path-scanner" };
	}

	const goodMatch = userAgent.match(GOOD_BOTS);
	if (goodMatch) {
		return { isBot: true, botType: "good", botName: goodMatch[0] };
	}

	return { isBot: false, botType: "human", botName: null };
}

export function getClientIP(request: NextRequest): string | null {
	for (const headerName of TRUSTED_CLIENT_IP_HEADERS) {
		const clientIp = getTrustedHeaderValue(request, headerName);
		if (clientIp) {
			return clientIp;
		}
	}

	return null;
}

export function getRouteCategory(pathname: string): {
	category: string;
	limit: number;
} {
	const normalizedPathname =
		pathname !== "/" && pathname.endsWith("/")
			? pathname.slice(0, -1)
			: pathname;

	if (
		normalizedPathname === "/proxy/api/event" ||
		normalizedPathname === "/api/event"
	) {
		return { category: "analytics", limit: 10 };
	}
	if (normalizedPathname.startsWith("/api/")) {
		return { category: "api", limit: 20 };
	}
	return { category: "page", limit: 30 };
}
