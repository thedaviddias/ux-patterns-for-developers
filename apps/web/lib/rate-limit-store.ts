const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_RATE_LIMIT_STORE_TIMEOUT_MS = 2_000;
const LOCAL_DEV_RATE_LIMIT_WARNING =
	"UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not configured. Falling back to an in-memory rate limiter in development only.";

export interface DistributedRateLimitStore {
	increment(
		key: string,
		windowMs: number,
	): Promise<{ count: number; retryAfterSeconds: number }>;
}

export interface RateLimitCheckResult {
	allowed: boolean;
	retryAfterSeconds: number;
}

class InMemoryRateLimitStore implements DistributedRateLimitStore {
	private readonly entries = new Map<
		string,
		{ count: number; resetTime: number }
	>();
	private cleanupCounter = 0;

	async increment(key: string, windowMs: number) {
		const now = Date.now();

		this.cleanupCounter++;
		if (this.cleanupCounter >= 100) {
			this.cleanupCounter = 0;
			for (const [entryKey, entry] of this.entries) {
				if (entry.resetTime <= now) {
					this.entries.delete(entryKey);
				}
			}
		}

		const currentEntry = this.entries.get(key);
		if (!currentEntry || currentEntry.resetTime <= now) {
			const resetTime = now + windowMs;
			this.entries.set(key, { count: 1, resetTime });
			return {
				count: 1,
				retryAfterSeconds: Math.max(1, Math.ceil(windowMs / 1000)),
			};
		}

		currentEntry.count++;

		return {
			count: currentEntry.count,
			retryAfterSeconds: Math.max(
				1,
				Math.ceil((currentEntry.resetTime - now) / 1000),
			),
		};
	}
}

class UpstashRateLimitStore implements DistributedRateLimitStore {
	constructor(
		private readonly url: string,
		private readonly token: string,
	) {}

	async increment(key: string, windowMs: number) {
		const ttlSeconds = Math.max(1, Math.ceil(windowMs / 1000));
		const timeoutMs = Number(
			process.env.RATE_LIMIT_STORE_TIMEOUT_MS ??
				DEFAULT_RATE_LIMIT_STORE_TIMEOUT_MS,
		);
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), timeoutMs);
		let response: Response;

		try {
			response = await fetch(new URL("multi-exec", this.url), {
				method: "POST",
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify([
					["SET", key, "0", "EX", String(ttlSeconds), "NX"],
					["INCR", key],
					["TTL", key],
				]),
				cache: "no-store",
				signal: controller.signal,
			});
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				throw new Error(
					`Upstash rate limit request timed out after ${timeoutMs}ms`,
				);
			}

			throw error;
		} finally {
			clearTimeout(timeout);
		}

		if (!response.ok) {
			throw new Error(
				`Upstash rate limit request failed with ${response.status}`,
			);
		}

		const data = (await response.json()) as
			| Array<{
					result?: number | string | null;
					error?: string;
			  }>
			| { error?: string };

		if (!Array.isArray(data)) {
			throw new Error(data.error ?? "Upstash rate limit transaction failed");
		}

		if (data.some((entry) => entry.error)) {
			throw new Error(
				data.find((entry) => entry.error)?.error ??
					"Upstash rate limit transaction returned an error",
			);
		}

		if (data.length < 3) {
			throw new Error("Upstash rate limit response was malformed");
		}

		const count = Number(data[1]?.result);
		const retryAfterSeconds = Math.max(1, Number(data[2]?.result));

		if (!Number.isFinite(count) || !Number.isFinite(retryAfterSeconds)) {
			throw new Error(
				"Upstash rate limit response contained non-numeric values",
			);
		}

		return { count, retryAfterSeconds };
	}
}

let cachedRateLimitStore: DistributedRateLimitStore | null | undefined;

export function getRateLimitStore(): DistributedRateLimitStore | null {
	if (cachedRateLimitStore !== undefined) {
		return cachedRateLimitStore;
	}

	const url = process.env.UPSTASH_REDIS_REST_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN;

	if (url && token) {
		cachedRateLimitStore = new UpstashRateLimitStore(url, token);
		return cachedRateLimitStore;
	}

	if (process.env.NODE_ENV === "development") {
		console.warn(LOCAL_DEV_RATE_LIMIT_WARNING);
		cachedRateLimitStore = new InMemoryRateLimitStore();
		return cachedRateLimitStore;
	}

	cachedRateLimitStore = null;
	return cachedRateLimitStore;
}

export async function checkRateLimit(
	store: DistributedRateLimitStore | null,
	key: string,
	maxRequests: number,
	windowMs: number = DEFAULT_WINDOW_MS,
): Promise<RateLimitCheckResult> {
	if (!store) {
		console.error(
			"Rate-limit store unavailable; allowing request to avoid fail-closed outage.",
			{ key, maxRequests, windowMs, defaultWindowMs: DEFAULT_WINDOW_MS },
		);
		return {
			allowed: true,
			retryAfterSeconds: 0,
		};
	}

	try {
		const { count, retryAfterSeconds } = await store.increment(key, windowMs);
		return {
			allowed: count <= maxRequests,
			retryAfterSeconds,
		};
	} catch (error) {
		console.error("Rate-limit store request failed; allowing request.", {
			key,
			maxRequests,
			windowMs,
			error,
		});
		return {
			allowed: true,
			retryAfterSeconds: 0,
		};
	}
}
