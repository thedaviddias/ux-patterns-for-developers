#!/usr/bin/env node
/**
 * CLI entry point for UX Patterns MCP Server (stdio mode)
 * Used by Claude Code via .mcp.json configuration
 */

import { createServer } from "./server"
import { registerAllTools } from "./tools"

async function main(): Promise<void> {
	const server = createServer()

	// Register all tools
	registerAllTools(server)

	// Run with stdio transport
	await server.runStdio()
}

main().catch((error) => {
	console.error("Failed to start MCP server:", error)
	process.exit(1)
})
