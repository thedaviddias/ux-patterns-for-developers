/**
 * Anonymous usage telemetry for MCP server
 * Tracks tool usage counts without any PII
 */

interface TelemetryData {
  toolCalls: Map<string, number>
  totalRequests: number
  startTime: number
  errorCount: number
}

const telemetry: TelemetryData = {
  toolCalls: new Map(),
  totalRequests: 0,
  startTime: Date.now(),
  errorCount: 0,
}

/**
 * Record a tool call
 */
export function recordToolCall(toolName: string): void {
  const current = telemetry.toolCalls.get(toolName) || 0
  telemetry.toolCalls.set(toolName, current + 1)
  telemetry.totalRequests++
}

/**
 * Record an error
 */
export function recordError(): void {
  telemetry.errorCount++
}

/**
 * Get telemetry summary
 */
export function getTelemetrySummary(): {
  uptimeSeconds: number
  totalRequests: number
  errorCount: number
  toolBreakdown: Record<string, number>
} {
  const uptimeSeconds = Math.floor((Date.now() - telemetry.startTime) / 1000)

  const toolBreakdown: Record<string, number> = {}
  for (const [tool, count] of telemetry.toolCalls.entries()) {
    toolBreakdown[tool] = count
  }

  return {
    uptimeSeconds,
    totalRequests: telemetry.totalRequests,
    errorCount: telemetry.errorCount,
    toolBreakdown,
  }
}

/**
 * Reset telemetry data (useful for testing)
 */
export function resetTelemetry(): void {
  telemetry.toolCalls.clear()
  telemetry.totalRequests = 0
  telemetry.startTime = Date.now()
  telemetry.errorCount = 0
}

/**
 * Get most popular tools
 */
export function getMostPopularTools(limit = 5): Array<{ tool: string; count: number }> {
  return Array.from(telemetry.toolCalls.entries())
    .map(([tool, count]) => ({ tool, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
