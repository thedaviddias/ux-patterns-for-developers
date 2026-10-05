// @vitest-environment node

import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { DELETE, GET, OPTIONS, POST } from "./route";

let nextIP = 0;
function request(body: string, extra: Record<string, string> = {}) {
	return new NextRequest("https://mcp.uxpatterns.dev", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json, text/event-stream",
			"x-forwarded-for": `test-${++nextIP}`,
			...extra,
		},
		body,
	});
}

describe("public MCP route", () => {
	it("returns CORS headers on malformed and oversized requests", async () => {
		for (const [body, status] of [
			["{", 400],
			[JSON.stringify({ payload: "界".repeat(40000) }), 413],
		] as const) {
			const result = await POST(request(body));
			expect(result.status).toBe(status);
			expect(result.headers.get("access-control-allow-origin")).toBe("*");
		}
	});
	it("does not offer sessions and advertises modern CORS headers", async () => {
		expect((await GET()).status).toBe(405);
		expect((await DELETE()).status).toBe(405);
		const response = await OPTIONS();
		expect(response.status).toBe(204);
		expect(response.headers.get("access-control-allow-headers")).toContain(
			"Mcp-Method",
		);
		expect(response.headers.get("access-control-allow-headers")).not.toContain(
			"Session",
		);
	});
	it("rate limits bursts with retry guidance", async () => {
		const ip = `limited-${++nextIP}`;
		const body = JSON.stringify({
			jsonrpc: "2.0",
			method: "notifications/initialized",
		});
		for (let i = 0; i < 30; i++)
			expect(
				(await POST(request(body, { "x-forwarded-for": ip }))).status,
			).toBe(202);
		const response = await POST(request(body, { "x-forwarded-for": ip }));
		expect(response.status).toBe(429);
		expect(Number(response.headers.get("retry-after"))).toBeGreaterThan(0);
		expect(response.headers.get("access-control-allow-origin")).toBe("*");
	});
	it("rejects protocol/header mismatches before serving metadata", async () => {
		const body = JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/list",
			params: {
				_meta: {
					"io.modelcontextprotocol/protocolVersion": "2026-07-28",
					"io.modelcontextprotocol/clientInfo": { name: "test", version: "1" },
					"io.modelcontextprotocol/clientCapabilities": {},
				},
			},
		});
		const response = await POST(
			request(body, {
				"MCP-Protocol-Version": "2026-07-28",
				"Mcp-Method": "tools/call",
			}),
		);
		expect(response.status).toBe(400);
	});
	it("rejects untrusted browser origins while allowing hosted clients", async () => {
		const body = JSON.stringify({
			jsonrpc: "2.0",
			method: "notifications/initialized",
		});
		expect(
			(await POST(request(body, { Origin: "https://evil.example" }))).status,
		).toBe(403);
		expect(
			(await POST(request(body, { Origin: "https://chatgpt.com" }))).status,
		).toBe(202);
	});
});
