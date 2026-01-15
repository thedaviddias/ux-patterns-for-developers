/**
 * MCP Server HTTP Endpoint
 * Handles JSON-RPC 2.0 requests for the MCP protocol
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServer, UXPatternsMCPServer } from '@ux-patterns/mcp'
import { registerAllTools } from '@ux-patterns/mcp/tools'
import { checkRateLimit, getClientIdentifier } from '@ux-patterns/mcp/utils'

// Create and configure the MCP server with race-safe initialization
let server: UXPatternsMCPServer | null = null
let serverInit: Promise<UXPatternsMCPServer> | null = null

async function getServer(): Promise<UXPatternsMCPServer> {
  // Return existing server if already initialized
  if (server) {
    return server
  }

  // If initialization is in progress, wait for it
  if (serverInit) {
    return serverInit
  }

  // Start initialization and store the promise to prevent concurrent initializers
  serverInit = (async () => {
    const serverInstance = createServer()
    registerAllTools(serverInstance) // Synchronous - no await needed
    server = serverInstance
    serverInit = null // Clear the init promise once done
    return server
  })()

  return serverInit
}

// Max request size (100KB)
const MAX_REQUEST_SIZE = 100 * 1024

// Max batch size
const MAX_BATCH_SIZE = 10

/**
 * GET /api/mcp - Server info endpoint
 */
export async function GET() {
  const mcpServer = await getServer()
  const info = mcpServer.getServerInfo()

  return NextResponse.json(info, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

/**
 * POST /api/mcp - JSON-RPC 2.0 handler
 */
export async function POST(request: NextRequest) {
  // Parse request body first to validate actual size (headers can be spoofed)
  let text: string
  try {
    text = await request.text()
  } catch {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Failed to read request body' },
      },
      { status: 400 }
    )
  }

  // Validate actual body size
  if (text.length > MAX_REQUEST_SIZE) {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32600, message: 'Request too large (max 100KB)' },
      },
      { status: 413 }
    )
  }

  // Rate limiting
  const clientId = getClientIdentifier(request.headers)
  const rateLimit = checkRateLimit(clientId)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32000, message: 'Rate limit exceeded' },
      },
      {
        status: 429,
        headers: rateLimit.headers,
      }
    )
  }

  // Parse JSON from the already-read text
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error' },
      },
      { status: 400, headers: rateLimit.headers }
    )
  }

  const mcpServer = await getServer()

  // Handle batch requests
  if (Array.isArray(body)) {
    if (body.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: null,
          error: { code: -32600, message: `Batch too large (max ${MAX_BATCH_SIZE} requests)` },
        },
        { status: 400, headers: rateLimit.headers }
      )
    }

    // Process each request independently - one failure shouldn't abort others
    const results = await Promise.all(
      body.map(async (req) => {
        try {
          return await mcpServer.handleRequest(req as Parameters<typeof mcpServer.handleRequest>[0])
        } catch (error) {
          // Return JSON-RPC error response for this specific request
          const requestId = (req as { id?: string | number })?.id ?? null
          return {
            jsonrpc: '2.0',
            id: requestId,
            error: {
              code: -32603,
              message: error instanceof Error ? error.message : 'Internal error',
            },
          }
        }
      })
    )

    return NextResponse.json(results, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...rateLimit.headers,
      },
    })
  }

  // Handle single request
  try {
    const result = await mcpServer.handleRequest(body as Parameters<typeof mcpServer.handleRequest>[0])

    return NextResponse.json(result, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...rateLimit.headers,
      },
    })
  } catch (error) {
    // Return JSON-RPC error response for consistency with batch handling
    const requestId = (body as { id?: string | number })?.id ?? null
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: requestId,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...rateLimit.headers,
        },
      }
    )
  }
}

/**
 * OPTIONS /api/mcp - CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}
