import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { jsonSchemaToZod } from "./schema-utils";
import type { MCPError } from "./types";
import {
	capResponseText,
	DEFAULT_MAX_RESPONSE_CHARS,
} from "./utils/response-cap";

// Server constants
export const MCP_PROTOCOL_VERSION = "2025-06-18";
export const MCP_SERVER_INFO = {
	name: "ux-patterns-mcp",
	version: "1.0.0",
} as const;

interface UXPatternsMCPServerOptions {
	maxResponseChars?: number;
}

export interface ToolHandler {
	name: string;
	description: string;
	inputSchema: Tool["inputSchema"];
	handler: (args: Record<string, unknown>) => Promise<unknown>;
}

export class UXPatternsMCPServer {
	private tools: Map<string, ToolHandler> = new Map();
	private maxResponseChars: number;

	constructor(options: UXPatternsMCPServerOptions = {}) {
		this.maxResponseChars =
			options.maxResponseChars ?? DEFAULT_MAX_RESPONSE_CHARS;
	}

	/**
	 * Register a tool with the server
	 */
	registerTool(tool: ToolHandler): void {
		this.tools.set(tool.name, tool);
	}

	/**
	 * Register multiple tools at once
	 */
	registerTools(tools: ToolHandler[]): void {
		for (const tool of tools) {
			this.registerTool(tool);
		}
	}

	/**
	 * Create an SDK-backed server from the current tool registry.
	 */
	private createSdkServer(): McpServer {
		const server = new McpServer(MCP_SERVER_INFO, {
			capabilities: {
				tools: {},
			},
		});

		for (const tool of this.tools.values()) {
			server.registerTool(
				tool.name,
				{
					description: tool.description,
					inputSchema: jsonSchemaToZod(
						tool.inputSchema as Parameters<typeof jsonSchemaToZod>[0],
					),
				},
				async (args: unknown) => {
					try {
						const result = await tool.handler(
							(args || {}) as Record<string, unknown>,
						);
						return {
							content: [
								{
									type: "text" as const,
									text: capResponseText(
										JSON.stringify(result, null, 2),
										this.maxResponseChars,
									),
								},
							],
							structuredContent: result as Record<string, unknown>,
						};
					} catch (error) {
						const errorPayload: MCPError = {
							error: "INTERNAL_ERROR",
							message: error instanceof Error ? error.message : "Unknown error",
						};

						return {
							content: [
								{
									type: "text" as const,
									text: JSON.stringify(errorPayload, null, 2),
								},
							],
							structuredContent: errorPayload as unknown as Record<
								string,
								unknown
							>,
							isError: true,
						};
					}
				},
			);
		}

		return server;
	}

	/**
	 * Run the server with stdio transport
	 */
	async runStdio(): Promise<void> {
		const server = this.createSdkServer();
		const transport = new StdioServerTransport();
		await server.connect(transport);
	}

	/**
	 * Handle a Streamable HTTP request using the official MCP SDK transport.
	 */
	async handleHttpRequest(
		request: Request,
		parsedBody?: unknown,
	): Promise<Response> {
		const server = this.createSdkServer();
		const transport = new WebStandardStreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
			enableJsonResponse: true,
		});
		const normalizedRequest = withDefaultTransportHeaders(request, parsedBody);

		try {
			await server.connect(transport);
			return await transport.handleRequest(
				normalizedRequest,
				parsedBody === undefined ? undefined : { parsedBody },
			);
		} finally {
			await transport.close();
			await server.close();
		}
	}

	/**
	 * Get server info for HTTP GET endpoint
	 */
	getServerInfo(): {
		name: string;
		version: string;
		protocolVersion: string;
		capabilities: { tools: { listChanged: boolean } };
		serverInfo: { name: string; version: string };
	} {
		return {
			name: MCP_SERVER_INFO.name,
			version: MCP_SERVER_INFO.version,
			protocolVersion: MCP_PROTOCOL_VERSION,
			capabilities: {
				tools: {
					listChanged: false,
				},
			},
			serverInfo: {
				name: "UX Patterns MCP Server",
				version: MCP_SERVER_INFO.version,
			},
		};
	}

	/**
	 * Handle a JSON-RPC request (for HTTP endpoint)
	 */
	async handleRequest(request: {
		jsonrpc: string;
		id: string | number;
		method: string;
		params?: Record<string, unknown>;
	}): Promise<{
		jsonrpc: string;
		id: string | number | null;
		result?: unknown;
		error?: { code: number; message: string };
	}> {
		const { jsonrpc, id, method, params } = request;

		// Validate request id is present
		if (id === undefined || id === null) {
			return {
				jsonrpc: "2.0",
				id: null,
				error: { code: -32600, message: "Missing request id" },
			};
		}

		if (jsonrpc !== "2.0") {
			return {
				jsonrpc: "2.0",
				id,
				error: { code: -32600, message: "Invalid JSON-RPC version" },
			};
		}

		try {
			if (method === "tools/list") {
				const tools = Array.from(this.tools.values()).map((tool) => ({
					name: tool.name,
					description: tool.description,
					inputSchema: tool.inputSchema,
				}));
				return { jsonrpc: "2.0", id, result: { tools } };
			}

			if (method === "tools/call") {
				const toolName = (params as { name?: string })?.name;
				const toolArgs = (params as { arguments?: Record<string, unknown> })
					?.arguments;

				if (!toolName) {
					return {
						jsonrpc: "2.0",
						id,
						error: { code: -32602, message: "Missing tool name" },
					};
				}

				const tool = this.tools.get(toolName);
				if (!tool) {
					return {
						jsonrpc: "2.0",
						id,
						error: { code: -32601, message: `Tool "${toolName}" not found` },
					};
				}

				const result = await tool.handler(toolArgs ?? {});
				return {
					jsonrpc: "2.0",
					id,
					result: {
						content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
					},
				};
			}

			return {
				jsonrpc: "2.0",
				id,
				error: { code: -32601, message: `Method "${method}" not found` },
			};
		} catch (error) {
			return {
				jsonrpc: "2.0",
				id,
				error: {
					code: -32603,
					message: error instanceof Error ? error.message : "Internal error",
				},
			};
		}
	}
}

function withDefaultTransportHeaders(
	request: Request,
	parsedBody?: unknown,
): Request {
	const headers = new Headers(request.headers);

	if (!headers.has("accept")) {
		headers.set("accept", "application/json, text/event-stream");
	}

	if (!headers.has("mcp-protocol-version")) {
		headers.set("mcp-protocol-version", MCP_PROTOCOL_VERSION);
	}

	if (
		parsedBody === undefined &&
		request.method !== "GET" &&
		request.method !== "HEAD"
	) {
		return new Request(request.url, {
			method: request.method,
			headers,
			body: request.body,
			duplex: "half",
		} as RequestInit & { duplex: "half" });
	}

	return new Request(request.url, {
		method: request.method,
		headers,
	});
}

export function createServer(
	options: UXPatternsMCPServerOptions = {},
): UXPatternsMCPServer {
	return new UXPatternsMCPServer(options);
}
