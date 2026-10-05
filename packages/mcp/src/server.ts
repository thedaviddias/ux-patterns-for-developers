import {
	createMcpHandler,
	McpServer,
	originValidationResponse,
	type Tool,
} from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { jsonSchemaToZod } from "./schema-utils";
import type { MCPError } from "./types";
import { LRUCache } from "./utils/cache";
import {
	capResponseText,
	DEFAULT_MAX_RESPONSE_CHARS,
} from "./utils/response-cap";

// Server constants
export const MCP_PROTOCOL_VERSION = "2026-07-28";
export const MCP_SERVER_INFO = {
	name: "ux-patterns-mcp",
	version: "2.0.1",
} as const;

const ALLOWED_ORIGIN_HOSTNAMES = [
	"mcp.uxpatterns.dev",
	"uxpatterns.dev",
	"www.uxpatterns.dev",
	"chatgpt.com",
	"claude.ai",
	"localhost",
	"127.0.0.1",
	"[::1]",
];

export function validateMcpOrigin(request: Request): Response | undefined {
	return originValidationResponse(request, ALLOWED_ORIGIN_HOSTNAMES);
}

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
	private readonly searchCache = new LRUCache<unknown>(100, 5 * 60 * 1000);
	private readonly schemas = new Map<
		string,
		ReturnType<typeof jsonSchemaToZod>
	>();
	private readonly httpHandler = createMcpHandler(
		() => this.createSdkServer(),
		{
			legacy: "stateless",
			responseMode: "auto",
			maxRequestBodySize: 100 * 1024,
		},
	);

	constructor(options: UXPatternsMCPServerOptions = {}) {
		this.maxResponseChars =
			options.maxResponseChars ?? DEFAULT_MAX_RESPONSE_CHARS;
	}

	/**
	 * Register a tool with the server
	 */
	registerTool(tool: ToolHandler): void {
		if (tool.name === "search_patterns") this.searchCache.clear();
		this.tools.set(tool.name, tool);
		this.schemas.set(
			tool.name,
			jsonSchemaToZod(
				tool.inputSchema as Parameters<typeof jsonSchemaToZod>[0],
			),
		);
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
				tools: { listChanged: false },
			},
			cacheHints: { "tools/list": { ttlMs: 3600000, cacheScope: "public" } },
		});

		for (const tool of this.tools.values()) {
			server.registerTool(
				tool.name,
				{
					title: tool.name
						.replaceAll("_", " ")
						.replace(/\b\w/g, (letter) => letter.toUpperCase()),
					description: tool.description,
					annotations: {
						readOnlyHint: true,
						destructiveHint: false,
						idempotentHint: true,
						openWorldHint: false,
					},
					inputSchema: this.schemas.get(tool.name),
				},
				async (args: unknown) => {
					try {
						const toolArgs = (args || {}) as Record<string, unknown>;
						const cacheKey =
							tool.name === "search_patterns"
								? LRUCache.createKey(tool.name, toolArgs)
								: undefined;
						const cached = cacheKey
							? this.searchCache.get(cacheKey)
							: undefined;
						const result = cached ?? (await tool.handler(toolArgs));
						const isError =
							typeof result === "object" &&
							result !== null &&
							"error" in result;
						if (cacheKey && cached === undefined && !isError)
							this.searchCache.set(cacheKey, result);
						const text = JSON.stringify(result, null, 2);
						return {
							content: [
								{
									type: "text" as const,
									text: capResponseText(text, this.maxResponseChars),
								},
							],
							structuredContent:
								text.length <= this.maxResponseChars
									? (result as Record<string, unknown>)
									: undefined,
							isError: isError || undefined,
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
		serveStdio(() => this.createSdkServer());
	}

	/**
	 * Handle a Streamable HTTP request using the official MCP SDK transport.
	 */
	async handleHttpRequest(request: Request): Promise<Response> {
		return validateMcpOrigin(request) ?? this.httpHandler.fetch(request);
	}

	/**
	 * Get server metadata for local diagnostics
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
}

export function createServer(
	options: UXPatternsMCPServerOptions = {},
): UXPatternsMCPServer {
	return new UXPatternsMCPServer(options);
}
