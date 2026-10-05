import { createServer, validateMcpOrigin } from "@ux-patterns/mcp";
import { registerAllTools } from "@ux-patterns/mcp/tools";
import { checkRateLimit, getClientIdentifier } from "@ux-patterns/mcp/utils";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

// The registry is shared; the SDK creates and disposes a server per request.
const server = createServer();
registerAllTools(server);

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Expose-Headers":
		"Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset",
};

function withResponseHeaders(
	response: Response,
	extraHeaders?: HeadersInit,
): Response {
	const headers = new Headers(response.headers);
	for (const [key, value] of new Headers({
		...CORS_HEADERS,
		"Cache-Control": "no-store",
	}).entries())
		headers.set(key, value);
	for (const [key, value] of new Headers(extraHeaders).entries())
		headers.set(key, value);
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

// This server does not provide standalone SSE streams or session termination.
export async function GET(request?: NextRequest) {
	const rejected = request ? validateMcpOrigin(request) : undefined;
	if (rejected) return withResponseHeaders(rejected);
	return withResponseHeaders(
		new Response(null, { status: 405, headers: { Allow: "POST, OPTIONS" } }),
	);
}
export const DELETE = GET;

export async function POST(request: NextRequest) {
	const rateLimit = checkRateLimit(getClientIdentifier(request.headers));
	if (!rateLimit.allowed) {
		return withResponseHeaders(
			Response.json(
				{
					jsonrpc: "2.0",
					id: null,
					error: { code: -32000, message: "Rate limit exceeded" },
				},
				{ status: 429 },
			),
			{
				...rateLimit.headers,
				"Retry-After": String(
					Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
				),
			},
		);
	}
	try {
		// The SDK enforces the byte limit while reading and validates both eras.
		return withResponseHeaders(
			await server.handleHttpRequest(request),
			rateLimit.headers,
		);
	} catch {
		return withResponseHeaders(
			Response.json(
				{
					jsonrpc: "2.0",
					id: null,
					error: { code: -32603, message: "Internal server error" },
				},
				{ status: 500 },
			),
			rateLimit.headers,
		);
	}
}

export async function OPTIONS(request?: NextRequest) {
	const rejected = request ? validateMcpOrigin(request) : undefined;
	if (rejected) return withResponseHeaders(rejected);
	return new Response(null, {
		status: 204,
		headers: {
			...CORS_HEADERS,
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers":
				"Accept, Content-Type, MCP-Protocol-Version, Mcp-Method, Mcp-Name",
			"Access-Control-Max-Age": "86400",
		},
	});
}
