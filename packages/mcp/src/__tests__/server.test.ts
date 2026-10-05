import {
	Client,
	StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { createServer, MCP_PROTOCOL_VERSION } from "../server";

function setup() {
	const server = createServer();
	server.registerTool({
		name: "echo",
		description: "Echo a message",
		inputSchema: {
			type: "object",
			properties: { message: { type: "string" } },
			required: ["message"],
		},
		handler: async (args) => ({ message: args.message }),
	});
	server.registerTool({
		name: "fail",
		description: "Failure test",
		inputSchema: { type: "object", properties: {} },
		handler: async () => {
			throw new Error("Test failure");
		},
	});
	return server;
}

async function connect(mode: "legacy" | "auto") {
	const server = setup();
	const requests: Request[] = [];
	const client = new Client(
		{ name: "integration-test", version: "1.0.0" },
		{ versionNegotiation: { mode } },
	);
	const transport = new StreamableHTTPClientTransport(
		new URL("https://mcp.uxpatterns.dev"),
		{
			fetch: async (input, init) => {
				const request = new Request(input, init);
				requests.push(request.clone());
				return server.handleHttpRequest(request);
			},
		},
	);
	await client.connect(transport);
	return { client, requests };
}

describe("real stateless MCP transport", () => {
	for (const mode of ["legacy", "auto"] as const) {
		it(`discovers and calls tools using ${mode} clients`, async () => {
			const { client, requests } = await connect(mode);
			try {
				const list = await client.listTools();
				expect(list.tools).toHaveLength(2);
				expect(list.tools[0].annotations).toMatchObject({
					readOnlyHint: true,
					destructiveHint: false,
				});
				const result = await client.callTool({
					name: "echo",
					arguments: { message: "hello" },
				});
				expect(result.structuredContent).toEqual({ message: "hello" });
				expect(client.getProtocolEra()).toBe(
					mode === "auto" ? "modern" : "legacy",
				);
				expect(requests.every((r) => !r.headers.has("mcp-session-id"))).toBe(
					true,
				);
				if (mode === "auto")
					expect(list).toMatchObject({ ttlMs: 3600000, cacheScope: "public" });
			} finally {
				await client.close();
			}
		});
	}
	it("marks handler failures as tool errors", async () => {
		const { client } = await connect("auto");
		try {
			expect(
				await client.callTool({ name: "fail", arguments: {} }),
			).toMatchObject({ isError: true });
		} finally {
			await client.close();
		}
	});
	it("rejects invalid tool arguments", async () => {
		const { client } = await connect("auto");
		try {
			const result = await client.callTool({
				name: "echo",
				arguments: { message: 42 },
			});
			expect(result.isError).toBe(true);
		} finally {
			await client.close();
		}
	});
	it("rejects malformed JSON and unsupported methods", async () => {
		const server = setup();
		const response = await server.handleHttpRequest(
			new Request("https://mcp.uxpatterns.dev", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json, text/event-stream",
				},
				body: "{",
			}),
		);
		expect(response.status).toBe(400);
		expect((await response.json()).error.code).toBe(-32700);
		expect(
			(
				await server.handleHttpRequest(
					new Request("https://mcp.uxpatterns.dev"),
				)
			).status,
		).toBe(405);
	});
	it("does not mix request IDs or arguments under concurrency", async () => {
		const server = setup();
		const results = await Promise.all(
			Array.from({ length: 40 }, async (_, id) => {
				const response = await server.handleHttpRequest(
					new Request("https://mcp.uxpatterns.dev", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json, text/event-stream",
						},
						body: JSON.stringify({
							jsonrpc: "2.0",
							id,
							method: "tools/call",
							params: { name: "echo", arguments: { message: String(id) } },
						}),
					}),
				);
				const text = await response.text();
				const data = response.headers
					.get("content-type")
					?.includes("text/event-stream")
					? JSON.parse(text.split("data: ")[1].split("\n")[0])
					: JSON.parse(text);
				expect(data.id).toBe(id);
				expect(data.result.structuredContent.message).toBe(String(id));
				return data;
			}),
		);
		expect(results).toHaveLength(40);
	});
	it("advertises the modern protocol", () => {
		expect(setup().getServerInfo().protocolVersion).toBe(MCP_PROTOCOL_VERSION);
	});
	it("caps the complete response without duplicating uncapped structured content", async () => {
		const server = createServer({ maxResponseChars: 1000 });
		server.registerTool({
			name: "large",
			description: "Large output",
			inputSchema: { type: "object", properties: {} },
			handler: async () => ({ text: "x".repeat(100000) }),
		});
		const client = new Client(
			{ name: "cap-test", version: "1" },
			{ versionNegotiation: { mode: "auto" } },
		);
		await client.connect(
			new StreamableHTTPClientTransport(new URL("https://mcp.uxpatterns.dev"), {
				fetch: (input, init) =>
					server.handleHttpRequest(new Request(input, init)),
			}),
		);
		try {
			const result = await client.callTool({ name: "large", arguments: {} });
			expect(result.structuredContent).toBeUndefined();
			expect(JSON.stringify(result).length).toBeLessThan(1500);
		} finally {
			await client.close();
		}
	});
	it("retries failed public searches and caches only the recovered result", async () => {
		const server = createServer();
		let calls = 0;
		server.registerTool({
			name: "search_patterns",
			description: "Recoverable public search",
			inputSchema: { type: "object", properties: { query: { type: "string" } } },
			handler: async () =>
				++calls === 1 ? { error: "TEMPORARY_FAILURE" } : { results: ["button"] },
		});
		const client = new Client(
			{ name: "cache-recovery-test", version: "1" },
			{ versionNegotiation: { mode: "auto" } },
		);
		await client.connect(
			new StreamableHTTPClientTransport(new URL("https://mcp.uxpatterns.dev"), {
				fetch: (input, init) => server.handleHttpRequest(new Request(input, init)),
			}),
		);
		try {
			const request = { name: "search_patterns", arguments: { query: "button" } };
			expect((await client.callTool(request)).isError).toBe(true);
			const recovered = await client.callTool(request);
			expect(recovered.isError).not.toBe(true);
			expect(recovered.structuredContent).toEqual({ results: ["button"] });
			expect(await client.callTool(request)).toEqual(recovered);
			expect(calls).toBe(2);
		} finally {
			await client.close();
		}
	});
	it("reuses bounded public search results but does not cache submitted code", async () => {
		const server = createServer();
		let searchCalls = 0;
		let codeCalls = 0;
		server.registerTool({
			name: "search_patterns",
			description: "Public search",
			inputSchema: {
				type: "object",
				properties: { query: { type: "string" } },
			},
			handler: async () => ({ calls: ++searchCalls }),
		});
		server.registerTool({
			name: "review_code",
			description: "Submitted code",
			inputSchema: { type: "object", properties: { code: { type: "string" } } },
			handler: async () => ({ calls: ++codeCalls }),
		});
		const client = new Client(
			{ name: "cache-test", version: "1" },
			{ versionNegotiation: { mode: "auto" } },
		);
		await client.connect(
			new StreamableHTTPClientTransport(new URL("https://mcp.uxpatterns.dev"), {
				fetch: (input, init) =>
					server.handleHttpRequest(new Request(input, init)),
			}),
		);
		try {
			for (let i = 0; i < 2; i++) {
				await client.callTool({
					name: "search_patterns",
					arguments: { query: "button" },
				});
				await client.callTool({
					name: "review_code",
					arguments: { code: "private snippet" },
				});
			}
			expect(searchCalls).toBe(1);
			expect(codeCalls).toBe(2);
		} finally {
			await client.close();
		}
	});
});
