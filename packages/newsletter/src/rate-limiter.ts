// Simple in-memory rate limiter (consider using Redis/Upstash in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every 5 minutes
setInterval(
	() => {
		const now = Date.now();
		const keysToDelete: string[] = [];
		rateLimitMap.forEach((value, key) => {
			if (value.resetTime < now) {
				keysToDelete.push(key);
			}
		});
		keysToDelete.forEach((key) => {
			rateLimitMap.delete(key);
		});
	},
	5 * 60 * 1000,
);

export function getRateLimitKey(request: Request): string {
	// Get client IP from headers (works with Vercel/Cloudflare)
	const forwardedFor = request.headers.get("x-forwarded-for");
	const realIp = request.headers.get("x-real-ip");
	const cfConnectingIp = request.headers.get("cf-connecting-ip");

	const clientIp =
		forwardedFor?.split(",")[0] || realIp || cfConnectingIp || "unknown";
	return `newsletter:${clientIp}`;
}

export function checkRateLimit(
	key: string,
	maxRequests: number = 3,
	windowMs: number = 60000,
): boolean {
	const now = Date.now();
	const record = rateLimitMap.get(key);

	if (!record || record.resetTime < now) {
		// Create new record or reset expired one
		rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
		return true;
	}

	if (record.count >= maxRequests) {
		return false; // Rate limit exceeded
	}

	record.count++;
	return true;
}
