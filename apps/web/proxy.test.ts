import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit-store";
import { proxy } from "./proxy";

vi.mock("@/lib/rate-limit-store", () => ({
	checkRateLimit: vi.fn(async () => ({ allowed: true })),
	getRateLimitStore: vi.fn(() => ({})),
}));

describe("MCP hostname verification routing", () => {
	beforeEach(() => vi.clearAllMocks());
	const request = (path: string, method = "GET") =>
		new NextRequest(`https://mcp.uxpatterns.dev${path}`, {
			method,
			headers: {
				host: "mcp.uxpatterns.dev",
				"user-agent": "OpenAI-Verification",
			},
		});
	it("serves verification reads without rewriting them or consuming tool limits", async () => {
		for (const method of ["GET", "HEAD"]) {
			const response = await proxy(
				request("/.well-known/openai-apps-challenge", method),
			);
			expect(response.headers.get("x-middleware-next")).toBe("1");
			expect(response.headers.has("x-middleware-rewrite")).toBe(false);
		}
		expect(checkRateLimit).not.toHaveBeenCalled();
	});
	it("does not treat writes to the verification file as MCP calls", async () => {
		const response = await proxy(
			request("/.well-known/openai-apps-challenge", "POST"),
		);
		expect(response.status).toBe(405);
		expect(response.headers.get("Allow")).toBe("GET, HEAD");
		expect(checkRateLimit).not.toHaveBeenCalled();
	});
	it("preserves MCP routing and limiting outside the exact verification path", async () => {
		for (const path of ["/", "/.well-known/openai-apps-challenge-extra"]) {
			const response = await proxy(request(path, "POST"));
			expect(response.headers.get("x-middleware-rewrite")).toBe(
				"https://mcp.uxpatterns.dev/api/mcp",
			);
		}
		expect(checkRateLimit).toHaveBeenCalledTimes(2);
	});
});
