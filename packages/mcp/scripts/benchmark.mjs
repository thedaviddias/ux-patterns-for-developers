import { performance } from "node:perf_hooks";
import {
	Client,
	StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { createServer } from "../dist/index.js";
import { registerAllTools } from "../dist/tools/index.js";

const endpoint = process.env.MCP_BENCHMARK_URL;
const server = endpoint ? undefined : createServer();
if (server) registerAllTools(server);
const client = new Client(
	{ name: "ux-benchmark", version: "1.0.0" },
	{ versionNegotiation: { mode: "auto" } },
);
const transport = new StreamableHTTPClientTransport(
	new URL(endpoint ?? "https://mcp.uxpatterns.dev"),
	server
		? {
				fetch: (input, init) =>
					server.handleHttpRequest(new Request(input, init)),
			}
		: {},
);
const start = performance.now();
await client.connect(transport);
const connectMs = performance.now() - start;
const count = Number(process.env.MCP_BENCHMARK_REQUESTS ?? 100);
const concurrency = Number(process.env.MCP_BENCHMARK_CONCURRENCY ?? 10);
if (
	!Number.isInteger(count) ||
	count < 1 ||
	!Number.isInteger(concurrency) ||
	concurrency < 1
)
	throw new Error("Invalid benchmark count/concurrency");
const coldStarted = performance.now();
const coldResult = await client.callTool({
	name: "search_patterns",
	arguments: { query: "search input with suggestions", limit: 5 },
});
if (coldResult.isError) throw new Error(JSON.stringify(coldResult));
const coldSearchMs = performance.now() - coldStarted;
await client.listTools();
globalThis.gc?.();
const latencies = [];
const payloadBytes = [];
let cursor = 0;
const heapBefore = process.memoryUsage().heapUsed;
const began = performance.now();
try {
	await Promise.all(
		Array.from({ length: concurrency }, async () => {
			while (cursor < count) {
				const i = cursor++;
				const started = performance.now();
				const result =
					i % 2 === 0
						? await client.listTools()
						: await client.callTool({
								name: "search_patterns",
								arguments: { query: "search input with suggestions", limit: 5 },
							});
				if (result.isError) throw new Error(JSON.stringify(result));
				latencies.push(performance.now() - started);
				payloadBytes.push(Buffer.byteLength(JSON.stringify(result)));
			}
		}),
	);
	const durationMs = performance.now() - began;
	latencies.sort((a, b) => a - b);
	const percentile = (p) =>
		latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * p))];
	const heapAfterBurst = process.memoryUsage().heapUsed;
	globalThis.gc?.();
	const retainedHeapDeltaBytes = globalThis.gc
		? process.memoryUsage().heapUsed - heapBefore
		: null;
	console.log(
		JSON.stringify(
			{
				target: endpoint ?? "local SDK handler (no network)",
				protocolEra: client.getProtocolEra(),
				count,
				concurrency,
				connectMs,
				coldSearchMs,
				durationMs,
				requestsPerSecond: count / (durationMs / 1000),
				latencyMs: {
					p50: percentile(0.5),
					p95: percentile(0.95),
					p99: percentile(0.99),
				},
				maxPayloadBytes: Math.max(...payloadBytes),
				heapDeltaBytes: heapAfterBurst - heapBefore,
				retainedHeapDeltaBytes,
			},
			null,
			2,
		),
	);
} finally {
	await client.close();
}
