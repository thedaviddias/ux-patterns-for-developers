/**
 * Tests for MCP Server
 */

import { jest } from '@jest/globals'

// Mock the MCP SDK
jest.unstable_mockModule('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: jest.fn().mockImplementation(() => ({
    setRequestHandler: jest.fn(),
    connect: jest.fn(),
  })),
}))

jest.unstable_mockModule('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: jest.fn(),
}))

jest.unstable_mockModule('@modelcontextprotocol/sdk/types.js', () => ({
  CallToolRequestSchema: {},
  ListToolsRequestSchema: {},
}))

const { UXPatternsMCPServer, createServer } = await import('../server')
import type { ToolHandler } from '../server'

describe('MCP Server', () => {
  describe('createServer', () => {
    it('should create a new server instance', () => {
      const server = createServer()

      expect(server).toBeInstanceOf(UXPatternsMCPServer)
    })
  })

  describe('UXPatternsMCPServer', () => {
    let server: InstanceType<typeof UXPatternsMCPServer>

    const mockTool: ToolHandler = {
      name: 'test_tool',
      description: 'A test tool',
      inputSchema: {
        type: 'object',
        properties: {
          arg1: { type: 'string' },
        },
        required: ['arg1'],
      },
      handler: jest.fn<() => Promise<{ result: string }>>().mockResolvedValue({
        result: 'success',
      }),
    }

    const errorTool: ToolHandler = {
      name: 'error_tool',
      description: 'A tool that throws',
      inputSchema: { type: 'object', properties: {} },
      handler: jest.fn<() => Promise<never>>().mockRejectedValue(new Error('Tool error')),
    }

    beforeEach(() => {
      jest.clearAllMocks()
      server = new UXPatternsMCPServer()
    })

    describe('registerTool', () => {
      it('should register a single tool', async () => {
        server.registerTool(mockTool)

        // Verify tool is accessible via tools/list
        const response = await server.handleRequest({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
        })

        const result = response.result as { tools: any[] }
        expect(result.tools).toHaveLength(1)
        expect(result.tools[0].name).toBe('test_tool')
        expect(result.tools[0].description).toBe('A test tool')
      })

      it('should allow overwriting existing tool', async () => {
        server.registerTool(mockTool)

        const updatedTool = {
          ...mockTool,
          description: 'Updated description',
        }
        server.registerTool(updatedTool)

        // Verify the updated description is used
        const response = await server.handleRequest({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
        })

        const result = response.result as { tools: any[] }
        expect(result.tools).toHaveLength(1)
        expect(result.tools[0].description).toBe('Updated description')
      })
    })

    describe('registerTools', () => {
      it('should register multiple tools at once', async () => {
        const tools: ToolHandler[] = [
          mockTool,
          {
            name: 'another_tool',
            description: 'Another test tool',
            inputSchema: { type: 'object', properties: {} },
            handler: jest.fn().mockResolvedValue({}),
          },
        ]

        server.registerTools(tools)

        // Verify both tools are accessible via tools/list
        const response = await server.handleRequest({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
        })

        const result = response.result as { tools: any[] }
        expect(result.tools).toHaveLength(2)

        const toolNames = result.tools.map((t) => t.name)
        expect(toolNames).toContain('test_tool')
        expect(toolNames).toContain('another_tool')
      })
    })

    describe('getServerInfo', () => {
      it('should return server metadata', () => {
        const info = server.getServerInfo()

        expect(info.name).toBe('ux-patterns-mcp')
        expect(info.version).toBe('1.0.0')
        expect(info.protocolVersion).toBe('2025-11-25')
        expect(info.capabilities.tools.listChanged).toBe(false)
      })

      it('should include serverInfo section', () => {
        const info = server.getServerInfo()

        expect(info.serverInfo.name).toBe('UX Patterns MCP Server')
        expect(info.serverInfo.version).toBe('1.0.0')
      })
    })

    describe('handleRequest', () => {
      beforeEach(() => {
        server.registerTool(mockTool)
        server.registerTool(errorTool)
      })

      describe('request validation', () => {
        it('should reject requests with invalid JSON-RPC version', async () => {
          const response = await server.handleRequest({
            jsonrpc: '1.0',
            id: 1,
            method: 'tools/list',
          })

          expect(response.error).toBeDefined()
          expect(response.error?.code).toBe(-32600)
          expect(response.error?.message).toContain('Invalid JSON-RPC version')
        })

        it('should reject requests with missing id', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: null as any,
            method: 'tools/list',
          })

          expect(response.error).toBeDefined()
          expect(response.error?.code).toBe(-32600)
          expect(response.error?.message).toContain('Missing request id')
          expect(response.id).toBeNull()
        })

        it('should reject requests with undefined id', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: undefined as any,
            method: 'tools/list',
          })

          expect(response.error).toBeDefined()
          expect(response.error?.code).toBe(-32600)
        })
      })

      describe('tools/list method', () => {
        it('should return list of registered tools', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/list',
          })

          expect(response.jsonrpc).toBe('2.0')
          expect(response.id).toBe(1)
          expect(response.result).toBeDefined()

          const result = response.result as { tools: any[] }
          expect(result.tools.length).toBe(2)
          expect(result.tools.some((t) => t.name === 'test_tool')).toBe(true)
        })

        it('should include tool descriptions and schemas', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/list',
          })

          const result = response.result as { tools: any[] }
          const testTool = result.tools.find((t) => t.name === 'test_tool')

          expect(testTool.description).toBe('A test tool')
          expect(testTool.inputSchema).toEqual(mockTool.inputSchema)
        })

        it('should return empty list when no tools registered', async () => {
          const emptyServer = new UXPatternsMCPServer()

          const response = await emptyServer.handleRequest({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/list',
          })

          const result = response.result as { tools: any[] }
          expect(result.tools).toEqual([])
        })
      })

      describe('tools/call method', () => {
        it('should call the correct tool handler', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
              name: 'test_tool',
              arguments: { arg1: 'test' },
            },
          })

          expect(mockTool.handler).toHaveBeenCalledWith({ arg1: 'test' })
          expect(response.result).toBeDefined()
        })

        it('should return formatted content', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
              name: 'test_tool',
              arguments: {},
            },
          })

          const result = response.result as { content: any[] }
          expect(result.content).toBeDefined()
          expect(result.content[0].type).toBe('text')
          expect(JSON.parse(result.content[0].text)).toEqual({ result: 'success' })
        })

        it('should return error for missing tool name', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {},
          })

          expect(response.error).toBeDefined()
          expect(response.error?.code).toBe(-32602)
          expect(response.error?.message).toContain('Missing tool name')
        })

        it('should return error for non-existent tool', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
              name: 'nonexistent',
            },
          })

          expect(response.error).toBeDefined()
          expect(response.error?.code).toBe(-32601)
          expect(response.error?.message).toContain('not found')
        })

        it('should handle tool handler errors', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
              name: 'error_tool',
              arguments: {},
            },
          })

          expect(response.error).toBeDefined()
          expect(response.error?.code).toBe(-32603)
          expect(response.error?.message).toBe('Tool error')
        })

        it('should pass empty object when no arguments provided', async () => {
          await server.handleRequest({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
              name: 'test_tool',
            },
          })

          expect(mockTool.handler).toHaveBeenCalledWith({})
        })
      })

      describe('unknown method', () => {
        it('should return method not found error', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: 1,
            method: 'unknown/method',
          })

          expect(response.error).toBeDefined()
          expect(response.error?.code).toBe(-32601)
          expect(response.error?.message).toContain('unknown/method')
        })
      })

      describe('request id handling', () => {
        it('should preserve string request id', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: 'request-123',
            method: 'tools/list',
          })

          expect(response.id).toBe('request-123')
        })

        it('should preserve numeric request id', async () => {
          const response = await server.handleRequest({
            jsonrpc: '2.0',
            id: 42,
            method: 'tools/list',
          })

          expect(response.id).toBe(42)
        })
      })
    })
  })
})
