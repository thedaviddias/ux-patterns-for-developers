/**
 * MCP Server HTTP Endpoint
 * Handles JSON-RPC 2.0 requests for the MCP protocol
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServer, UXPatternsMCPServer } from '@ux-patterns/mcp'
import { registerAllTools } from '@ux-patterns/mcp/tools'
import { checkRateLimit, getClientIdentifier } from '@ux-patterns/mcp/utils'

// Create and configure the MCP server
let server: UXPatternsMCPServer | null = null

function getServer(): UXPatternsMCPServer {
  if (!server) {
    server = createServer()
    registerAllTools(server)
  }
  return server
}

// Max request size (100KB)
const MAX_REQUEST_SIZE = 100 * 1024

// Max batch size
const MAX_BATCH_SIZE = 10

/**
 * GET /api/mcp - Server info endpoint
 */
export async function GET() {
  const mcpServer = getServer()
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
  // Check content length
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
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

  // Parse request body
  let body: unknown
  try {
    body = await request.json()
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

  const mcpServer = getServer()

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

    const results = await Promise.all(
      body.map((req) => mcpServer.handleRequest(req as Parameters<typeof mcpServer.handleRequest>[0]))
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
  const result = await mcpServer.handleRequest(body as Parameters<typeof mcpServer.handleRequest>[0])

  return NextResponse.json(result, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...rateLimit.headers,
    },
  })
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
