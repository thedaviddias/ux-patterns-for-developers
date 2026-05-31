import { createServer, type UXPatternsMCPServer } from "@ux-patterns/mcp";
import { registerAllTools } from "@ux-patterns/mcp/tools";
import { checkRateLimit, getClientIdentifier } from "@ux-patterns/mcp/utils";
import { type NextRequest, NextResponse } from "next/server";

// Create and configure the MCP server with race-safe initialization
let server: UXPatternsMCPServer | null = null;
let serverInit: Promise<UXPatternsMCPServer> | null = null;

async function getServer(): Promise<UXPatternsMCPServer> {
	// Return existing server if already initialized
	if (server) {
		return server;
	}

	// If initialization is in progress, wait for it
	if (serverInit) {
		return serverInit;
	}

	serverInit = (async () => {
		const serverInstance = createServer();
		registerAllTools(serverInstance);
		server = serverInstance;
		serverInit = null;
		return server;
	})();

	return serverInit;
}

const MAX_REQUEST_SIZE = 100 * 1024;

function withResponseHeaders(
	response: Response,
	extraHeaders?: HeadersInit,
): Response {
	const headers = new Headers(response.headers);
	const mergedExtraHeaders = new Headers(extraHeaders);

	headers.set("Access-Control-Allow-Origin", "*");

	for (const [key, value] of mergedExtraHeaders.entries()) {
		headers.set(key, value);
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

/**
 * GET /api/mcp - Server info endpoint
 */
export async function GET() {
	const mcpServer = await getServer();
	const info = mcpServer.getServerInfo();

	return NextResponse.json(info, {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	});
}

/**
 * POST /api/mcp - JSON-RPC 2.0 handler
 */
export async function POST(request: NextRequest) {
	let text: string;

	try {
		text = await request.text();
	} catch {
		return NextResponse.json(
			{
				jsonrpc: "2.0",
				id: null,
				error: { code: -32700, message: "Failed to read request body" },
			},
			{ status: 400 },
		);
	}

	if (text.length > MAX_REQUEST_SIZE) {
		return NextResponse.json(
			{
				jsonrpc: "2.0",
				id: null,
				error: { code: -32600, message: "Request too large (max 100KB)" },
			},
			{ status: 413 },
		);
	}

	const clientId = getClientIdentifier(request.headers);
	const rateLimit = checkRateLimit(clientId);

	if (!rateLimit.allowed) {
		return NextResponse.json(
			{
				jsonrpc: "2.0",
				id: null,
				error: { code: -32000, message: "Rate limit exceeded" },
			},
			{
				status: 429,
				headers: rateLimit.headers,
			},
		);
	}

	let body: unknown;

	try {
		body = JSON.parse(text);
	} catch {
		return NextResponse.json(
			{
				jsonrpc: "2.0",
				id: null,
				error: { code: -32700, message: "Parse error" },
			},
			{ status: 400, headers: rateLimit.headers },
		);
	}

	const mcpServer = await getServer();
	const mcpRequest = new Request(request.url, {
		method: request.method,
		headers: request.headers,
	});

	try {
		const response = await mcpServer.handleHttpRequest(mcpRequest, body);
		return withResponseHeaders(response, rateLimit.headers);
	} catch (error) {
		const requestId = (body as { id?: string | number })?.id ?? null;

		return NextResponse.json(
			{
				jsonrpc: "2.0",
				id: requestId,
				error: {
					code: -32603,
					message: error instanceof Error ? error.message : "Internal error",
				},
			},
			{
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					...rateLimit.headers,
				},
			},
		);
	}
}

/**
 * OPTIONS /api/mcp - CORS preflight
 */
export async function OPTIONS() {
	return new NextResponse(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers":
				"Accept, Content-Type, MCP-Protocol-Version, MCP-Session-Id",
			"Access-Control-Expose-Headers": "MCP-Session-Id",
			"Access-Control-Max-Age": "86400",
		},
	});
}
