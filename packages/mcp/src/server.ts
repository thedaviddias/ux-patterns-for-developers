/**
 * MCP Server for UX Patterns
 * Handles JSON-RPC 2.0 protocol via @modelcontextprotocol/sdk
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	type Tool,
} from "@modelcontextprotocol/sdk/types.js"
import type { MCPError, ErrorCode } from "./types"

// Tool handlers will be imported from ./tools/index.ts
// For now, we define the structure

export interface ToolHandler {
	name: string
	description: string
	inputSchema: Tool["inputSchema"]
	handler: (args: Record<string, unknown>) => Promise<unknown>
}

export class UXPatternsMCPServer {
	private server: Server
	private tools: Map<string, ToolHandler> = new Map()

	constructor() {
		this.server = new Server(
			{
				name: "ux-patterns-mcp",
				version: "1.0.0",
			},
			{
				capabilities: {
					tools: {},
				},
			}
		)

		this.setupHandlers()
	}

	/**
	 * Register a tool with the server
	 */
	registerTool(tool: ToolHandler): void {
		this.tools.set(tool.name, tool)
	}

	/**
	 * Register multiple tools at once
	 */
	registerTools(tools: ToolHandler[]): void {
		for (const tool of tools) {
			this.registerTool(tool)
		}
	}

	/**
	 * Setup JSON-RPC request handlers
	 */
	private setupHandlers(): void {
		// Handle tools/list request
		this.server.setRequestHandler(ListToolsRequestSchema, async () => {
			const toolsList: Tool[] = Array.from(this.tools.values()).map(
				(tool) => ({
					name: tool.name,
					description: tool.description,
					inputSchema: tool.inputSchema,
				})
			)

			return { tools: toolsList }
		})

		// Handle tools/call request
		this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
			const { name, arguments: args } = request.params

			const tool = this.tools.get(name)
			if (!tool) {
				return this.createErrorResponse("NOT_FOUND", `Tool "${name}" not found`)
			}

			try {
				const result = await tool.handler(args ?? {})
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result, null, 2),
						},
					],
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error"
				return this.createErrorResponse("INTERNAL_ERROR", errorMessage)
			}
		})
	}

	/**
	 * Create a standardized error response
	 */
	private createErrorResponse(code: ErrorCode, message: string): {
		content: { type: "text"; text: string }[]
		isError: boolean
	} {
		const error: MCPError = {
			error: code,
			message,
		}

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(error, null, 2),
				},
			],
			isError: true,
		}
	}

	/**
	 * Run the server with stdio transport
	 */
	async runStdio(): Promise<void> {
		const transport = new StdioServerTransport()
		await this.server.connect(transport)
	}

	/**
	 * Get server info for HTTP GET endpoint
	 */
	getServerInfo(): {
		name: string
		version: string
		protocolVersion: string
		capabilities: { tools: { listChanged: boolean } }
		serverInfo: { name: string; version: string }
	} {
		return {
			name: "ux-patterns-mcp",
			version: "1.0.0",
			protocolVersion: "2024-11-05",
			capabilities: {
				tools: {
					listChanged: false,
				},
			},
			serverInfo: {
				name: "UX Patterns MCP Server",
				version: "1.0.0",
			},
		}
	}

	/**
	 * Handle a JSON-RPC request (for HTTP endpoint)
	 */
	async handleRequest(request: {
		jsonrpc: string
		id: string | number
		method: string
		params?: Record<string, unknown>
	}): Promise<{
		jsonrpc: string
		id: string | number
		result?: unknown
		error?: { code: number; message: string }
	}> {
		const { jsonrpc, id, method, params } = request

		if (jsonrpc !== "2.0") {
			return {
				jsonrpc: "2.0",
				id,
				error: { code: -32600, message: "Invalid JSON-RPC version" },
			}
		}

		try {
			if (method === "tools/list") {
				const tools = Array.from(this.tools.values()).map((tool) => ({
					name: tool.name,
					description: tool.description,
					inputSchema: tool.inputSchema,
				}))
				return { jsonrpc: "2.0", id, result: { tools } }
			}

			if (method === "tools/call") {
				const toolName = (params as { name?: string })?.name
				const toolArgs = (params as { arguments?: Record<string, unknown> })
					?.arguments

				if (!toolName) {
					return {
						jsonrpc: "2.0",
						id,
						error: { code: -32602, message: "Missing tool name" },
					}
				}

				const tool = this.tools.get(toolName)
				if (!tool) {
					return {
						jsonrpc: "2.0",
						id,
						error: { code: -32602, message: `Tool "${toolName}" not found` },
					}
				}

				const result = await tool.handler(toolArgs ?? {})
				return {
					jsonrpc: "2.0",
					id,
					result: {
						content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
					},
				}
			}

			return {
				jsonrpc: "2.0",
				id,
				error: { code: -32601, message: `Method "${method}" not found` },
			}
		} catch (error) {
			return {
				jsonrpc: "2.0",
				id,
				error: {
					code: -32603,
					message: error instanceof Error ? error.message : "Internal error",
				},
			}
		}
	}
}

export function createServer(): UXPatternsMCPServer {
	return new UXPatternsMCPServer()
}
