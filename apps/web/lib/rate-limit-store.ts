const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_RATE_LIMIT_STORE_TIMEOUT_MS = 2_000;
const LOCAL_DEV_RATE_LIMIT_WARNING =
	"Neither UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN nor KV_REST_API_URL/KV_REST_API_TOKEN are configured. Falling back to an in-memory rate limiter in development.";
const PROD_RATE_LIMIT_WARNING =
	"Neither UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN nor KV_REST_API_URL/KV_REST_API_TOKEN are configured in production. Falling back to per-instance in-memory rate limiting.";
const PRIMARY_STORE_FAILURE_WARNING =
	"Primary rate-limit store failed. Falling back to per-instance in-memory rate limiting for this runtime.";

function resolveRateLimitEnv() {
	const directUrl = process.env.UPSTASH_REDIS_REST_URL;
	const directToken = process.env.UPSTASH_REDIS_REST_TOKEN;

	if (directUrl && directToken) {
		return { url: directUrl, token: directToken };
	}

	const vercelKvUrl = process.env.KV_REST_API_URL;
	const vercelKvToken = process.env.KV_REST_API_TOKEN;

	if (vercelKvUrl && vercelKvToken) {
		return { url: vercelKvUrl, token: vercelKvToken };
	}

	return { url: null, token: null };
}

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

const fallbackRateLimitStore = new InMemoryRateLimitStore();
const emittedWarnings = new Set<string>();

let cachedRateLimitStore: DistributedRateLimitStore | undefined;

function logRateLimitMessageOnce(
	level: "warn" | "error",
	message: string,
	context?: Record<string, unknown>,
) {
	if (emittedWarnings.has(message)) {
		return;
	}

	emittedWarnings.add(message);
	if (context) {
		console[level](message, context);
		return;
	}

	console[level](message);
}

async function evaluateRateLimit(
	store: DistributedRateLimitStore,
	key: string,
	maxRequests: number,
	windowMs: number,
): Promise<RateLimitCheckResult> {
	const { count, retryAfterSeconds } = await store.increment(key, windowMs);
	return {
		allowed: count <= maxRequests,
		retryAfterSeconds,
	};
}

export function getRateLimitStore(): DistributedRateLimitStore {
	if (cachedRateLimitStore) {
		return cachedRateLimitStore;
	}

	const { url, token } = resolveRateLimitEnv();

	if (url && token) {
		cachedRateLimitStore = new UpstashRateLimitStore(url, token);
		return cachedRateLimitStore;
	}

	logRateLimitMessageOnce(
		"warn",
		process.env.NODE_ENV === "development"
			? LOCAL_DEV_RATE_LIMIT_WARNING
			: PROD_RATE_LIMIT_WARNING,
	);
	cachedRateLimitStore = fallbackRateLimitStore;
	return cachedRateLimitStore;
}

export async function checkRateLimit(
	store: DistributedRateLimitStore,
	key: string,
	maxRequests: number,
	windowMs: number = DEFAULT_WINDOW_MS,
): Promise<RateLimitCheckResult> {
	try {
		return await evaluateRateLimit(store, key, maxRequests, windowMs);
	} catch (error) {
		logRateLimitMessageOnce("error", PRIMARY_STORE_FAILURE_WARNING, {
			key,
			maxRequests,
			windowMs,
			defaultWindowMs: DEFAULT_WINDOW_MS,
			error,
		});

		if (store === fallbackRateLimitStore) {
			return {
				allowed: true,
				retryAfterSeconds: 0,
			};
		}

		try {
			return await evaluateRateLimit(
				fallbackRateLimitStore,
				key,
				maxRequests,
				windowMs,
			);
		} catch (fallbackError) {
			console.error(
				"In-memory rate-limit fallback failed; allowing request to avoid fail-closed outage.",
				{
					key,
					maxRequests,
					windowMs,
					defaultWindowMs: DEFAULT_WINDOW_MS,
					error: fallbackError,
				},
			);
			return {
				allowed: true,
				retryAfterSeconds: 0,
			};
		}
	}
}
