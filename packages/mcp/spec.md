# MCP Server for UX Patterns - Specification

## Overview

Create an MCP (Model Context Protocol) server for **uxpatterns.dev** exposing UX/UI patterns, glossary, and decision guides to AI agents. Deployed at `mcp.uxpatterns.dev`.

---

## Core Requirements

| Aspect | Decision |
|--------|----------|
| **Use Case** | Full-featured: AI code review, pattern discovery, documentation lookup |
| **Content Scope** | Patterns, glossary, decision guides (NO blog) |
| **Draft Content** | Published/complete patterns only |
| **Deployment** | Both stdio (Claude Code) and HTTP API modes |
| **Package Location** | `packages/mcp/` |
| **Subdomain** | `mcp.uxpatterns.dev` → `/api/mcp` |

---

## Tools (11 Total)

### Proactive Tools (AI auto-initiates)

| Tool | Description | Parameters |
|------|-------------|------------|
| `review_code` | Analyze UI code against UX patterns | `code`, `focus?`, `minPriority?` |
| `check_accessibility` | Dedicated a11y pattern validation | `code`, `patternType?` |
| `suggest_pattern` | Recommend patterns based on UI context | `context`, `category?` |
| `get_quick_reference` | Compact summaries for token efficiency | `category?`, `limit?` |

### Reactive Tools (On-demand)

| Tool | Description | Parameters |
|------|-------------|------------|
| `get_pattern` | Retrieve full pattern with related patterns | `name`, `includeToc?` |
| `search_patterns` | Full-text search with filters | `query`, `category?`, `tags?`, `limit?`, `cursor?` |
| `list_categories` | List all pattern categories | (none) |
| `get_glossary_term` | Lookup UX/UI terminology | `term` |
| `pattern_advisor` | Interactive/direct pattern recommendations | `mode`, `requirements?`, `answers?` |
| `get_implementation_checklist` | Checklist for implementing a pattern | `pattern` |
| `list_patterns` | List patterns with filters | `category?`, `status?`, `limit?`, `cursor?` |

---

## Tool Details

### `review_code` (Proactive)

Automatically analyzes UI code against multiple UX patterns, detecting potential issues and suggesting improvements.

```typescript
interface ReviewCodeParams {
  code: string          // Required: UI code to analyze (HTML/CSS/JS/JSX)
  focus?: string[]      // Optional: categories to focus on (e.g., ['forms', 'accessibility'])
  minPriority?: 'low' | 'medium' | 'high' | 'critical'  // Optional: minimum priority filter
}

interface ReviewCodeResponse {
  issues: {
    pattern: string       // Pattern slug that was violated
    title: string         // Pattern title
    severity: string      // 'error' | 'warning' | 'suggestion'
    message: string       // Description of the issue
    line?: number         // Line number if detectable
    suggestion: string    // How to fix it
  }[]
  summary: {
    total: number
    byCategory: Record<string, number>
    bySeverity: Record<string, number>
  }
}
```

### `check_accessibility` (Proactive)

Dedicated accessibility checker focusing on WCAG compliance and UX pattern best practices.

```typescript
interface CheckAccessibilityParams {
  code: string           // Required: UI code to check
  patternType?: string   // Optional: specific pattern context (e.g., 'modal', 'form')
  wcagLevel?: 'A' | 'AA' | 'AAA'  // Optional: WCAG conformance level (default: 'AA')
}

interface CheckAccessibilityResponse {
  issues: {
    criterion: string     // WCAG criterion (e.g., '1.1.1')
    level: string         // A, AA, or AAA
    pattern?: string      // Related UX pattern
    message: string       // Issue description
    impact: string        // 'critical' | 'serious' | 'moderate' | 'minor'
    fix: string           // How to fix
  }[]
  passed: string[]        // List of checks that passed
}
```

### `suggest_pattern` (Proactive)

Recommends relevant patterns based on the current UI context or code being written.

```typescript
interface SuggestPatternParams {
  context: string        // Required: description of what user is building OR code snippet
  category?: string      // Optional: limit suggestions to category
  limit?: number         // Optional: max suggestions (default: 5)
}

interface SuggestPatternResponse {
  suggestions: {
    pattern: string       // Pattern slug
    title: string
    relevance: number     // 0-100 relevance score
    reason: string        // Why this pattern is relevant
    category: string
  }[]
}
```

### `get_quick_reference` (Proactive)

Returns compact pattern summaries optimized for AI context windows.

```typescript
interface GetQuickReferenceParams {
  category?: string      // Optional: filter by category
  limit?: number         // Optional: max patterns (default: 20)
  includeRelated?: boolean  // Optional: include relationship hints
}

interface GetQuickReferenceResponse {
  patterns: {
    slug: string
    title: string
    summary: string       // 1-2 sentences max
    category: string
    tags: string[]
  }[]
  total: number
}
```

### `get_pattern` (Reactive)

Retrieves a complete pattern with metadata, related patterns, and auto-linked glossary terms.

```typescript
interface GetPatternParams {
  name: string           // Required: pattern slug
  includeToc?: boolean   // Optional: include table of contents (default: false)
}

interface GetPatternResponse {
  slug: string
  title: string
  summary: string
  description: string
  category: string[]
  tags: string[]
  status: 'complete' | 'published'
  body: string           // Plain markdown (MDX stripped)
  toc?: {                // Only if includeToc=true
    items: {
      title: string
      url: string
      depth: number
    }[]
  }
  relatedPatterns: {
    slug: string
    title: string
    relationship: 'related' | 'alternative' | 'complementary' | 'prerequisite'
    reason?: string
  }[]
  glossaryTerms: {       // Auto-detected terms in the pattern
    term: string
    definition: string
  }[]
  metadata: {
    wordCount: number
    readingTime: number
  }
}

// Error response with fuzzy suggestions
interface PatternNotFoundError {
  error: 'NOT_FOUND'
  message: string
  suggestions: string[]  // Similar pattern slugs
}
```

### `search_patterns` (Reactive)

Full-text search with multiple filter options.

```typescript
interface SearchPatternsParams {
  query: string          // Required: search query
  category?: string      // Optional: filter by category
  tags?: string[]        // Optional: filter by tags (AND logic)
  limit?: number         // Optional: results per page (default: 20, max: 100)
  cursor?: string        // Optional: pagination cursor
}

interface SearchPatternsResponse {
  results: {
    slug: string
    title: string
    summary: string
    category: string[]
    tags: string[]
    score: number        // Search relevance score
  }[]
  total: number
  cursor?: string        // Next page cursor
  hasMore: boolean
}
```

### `list_categories` (Reactive)

Lists all available pattern categories with metadata.

```typescript
interface ListCategoriesResponse {
  categories: {
    slug: string
    name: string
    description: string
    patternCount: number
  }[]
}
```

### `get_glossary_term` (Reactive)

Looks up UX/UI terminology definitions.

```typescript
interface GetGlossaryTermParams {
  term: string           // Required: term to look up
}

interface GetGlossaryTermResponse {
  term: string
  definition: string
  relatedTerms?: string[]
  relatedPatterns?: string[]
}

// Error with suggestions
interface TermNotFoundError {
  error: 'NOT_FOUND'
  message: string
  suggestions: string[]  // Similar terms
}
```

### `pattern_advisor` (Reactive)

Interactive pattern recommendation system with two modes.

```typescript
interface PatternAdvisorParams {
  mode: 'interactive' | 'direct'

  // For direct mode
  requirements?: string  // Describe what you're building

  // For interactive mode (continuing conversation)
  sessionId?: string     // Session ID from previous response
  answers?: Record<string, string>  // Answers to previous questions
}

// Interactive mode - returns questions
interface PatternAdvisorInteractiveResponse {
  sessionId: string
  questions: {
    id: string
    question: string
    options?: string[]   // If multiple choice
    type: 'single' | 'multiple' | 'text'
  }[]
  progress: number       // 0-100
}

// Direct mode or final interactive response
interface PatternAdvisorRecommendationResponse {
  recommendations: {
    pattern: string
    title: string
    confidence: number   // 0-100
    rationale: string
    category: string
  }[]
  alternativeApproaches?: string[]
}
```

### `get_implementation_checklist` (Reactive)

Returns a step-by-step checklist for implementing a specific pattern.

```typescript
interface GetImplementationChecklistParams {
  pattern: string        // Required: pattern slug
}

interface GetImplementationChecklistResponse {
  pattern: string
  title: string
  checklist: {
    phase: string        // 'planning' | 'structure' | 'styling' | 'behavior' | 'accessibility' | 'testing'
    items: {
      task: string
      priority: 'required' | 'recommended' | 'optional'
      details?: string
      patternRef?: string  // Link to related pattern
    }[]
  }[]
  estimatedTime: string  // e.g., "30-45 minutes"
  prerequisites?: string[]  // Patterns to know first
}
```

### `list_patterns` (Reactive)

Lists patterns with optional filtering.

```typescript
interface ListPatternsParams {
  category?: string      // Optional: filter by category
  status?: 'complete' | 'published'  // Optional: filter by status
  limit?: number         // Optional: results per page (default: 20, max: 100)
  cursor?: string        // Optional: pagination cursor
}

interface ListPatternsResponse {
  patterns: {
    slug: string
    title: string
    summary: string
    category: string[]
    status: string
  }[]
  total: number
  cursor?: string
  hasMore: boolean
}
```

---

## Technical Specifications

### Rate Limits (per IP)

| Tool Type | Limit | Retry-After |
|-----------|-------|-------------|
| `get_*` tools | 100 req/min | 60s |
| `search_*`, `list_*` | 60 req/min | 60s |
| `review_code`, `check_accessibility` | 20 req/min | 60s |

Rate limit headers:
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp
- `Retry-After`: Seconds until reset (on 429)

### Pagination

- **Style**: Cursor-based (stateless, future-proof)
- **Default limit**: 20
- **Maximum limit**: 100
- **Cursor format**: Opaque string (implementation detail)

### Caching

- **Type**: LRU (Least Recently Used) in-memory cache
- **Max entries**: 1000
- **TTL**: 5 minutes
- **Scope**: Identical request deduplication
- **Cache key**: Hash of tool name + serialized parameters

### Error Handling

All errors follow this structure:

```typescript
interface MCPError {
  error: string          // Error code
  message: string        // Human-readable message
  suggestions?: string[] // Fuzzy match alternatives (for NOT_FOUND)
  details?: object       // Additional context
}
```

Error codes:
- `NOT_FOUND`: Resource doesn't exist (includes fuzzy suggestions)
- `INVALID_PARAMS`: Invalid or missing parameters
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

Fuzzy matching uses Levenshtein distance (max 2-3 edits) to suggest alternatives.

### Content Format

- **Pattern bodies**: Plain markdown (MDX components stripped)
- **Glossary auto-linking**: Terms mentioned in patterns include inline definitions
- **No icons**: Visual metadata omitted for token efficiency
- **No code blocks**: Summary-only responses (code examples stripped for token efficiency)
- **Line length**: No artificial wrapping

### Telemetry

Anonymous, privacy-preserving usage tracking:

```typescript
interface TelemetryStats {
  toolCalls: Record<string, number>  // Calls per tool
  totalCalls: number
  cacheHits: number
  cacheMisses: number
  errors: Record<string, number>     // Errors by type
  since: string                      // ISO timestamp
}
```

Functions:
- `getTelemetryStats()`: Returns current stats
- `resetTelemetry()`: Clears counters

---

## Pattern Relationships

### Approach: Hybrid

1. **Auto-detect**: Infer relationships from shared tags, categories, and content similarity
2. **Manual override**: Curated `PATTERN_RELATIONSHIPS` map for important connections

### Relationship Types

| Type | Description |
|------|-------------|
| `related` | Similar patterns, same problem domain |
| `alternative` | Can replace each other |
| `complementary` | Often used together |
| `prerequisite` | Should know first |

### Relationship Map Structure

```typescript
const PATTERN_RELATIONSHIPS: Record<string, PatternRelation[]> = {
  'button': [
    { slug: 'input', type: 'complementary', reason: 'Forms typically combine buttons with inputs' },
    { slug: 'loading-states', type: 'related', reason: 'Buttons often show loading states' },
  ],
  // ...
}
```

---

## File Structure

```
packages/mcp/
├── src/
│   ├── cli.ts                         # Stdio entry point for Claude Code
│   ├── server.ts                      # MCP protocol handler (JSON-RPC 2.0)
│   ├── index.ts                       # Package exports
│   ├── types.ts                       # Type definitions
│   ├── tools/
│   │   ├── index.ts                   # Tool registry
│   │   ├── get-pattern.ts
│   │   ├── search-patterns.ts
│   │   ├── list-patterns.ts
│   │   ├── list-categories.ts
│   │   ├── review-code.ts
│   │   ├── check-accessibility.ts
│   │   ├── suggest-pattern.ts
│   │   ├── get-quick-reference.ts
│   │   ├── get-glossary-term.ts
│   │   ├── pattern-advisor.ts
│   │   └── get-implementation-checklist.ts
│   ├── data/
│   │   ├── relationships.ts           # Manual relationship map
│   │   └── checklists.ts              # Implementation checklists
│   └── utils/
│       ├── fuzzy-match.ts             # Levenshtein distance
│       ├── mdx-to-markdown.ts         # Strip MDX components
│       ├── pagination.ts              # Cursor helpers
│       ├── rate-limit.ts              # Per-IP rate limiting
│       ├── cache.ts                   # LRU cache
│       ├── glossary-linker.ts         # Auto-link glossary terms
│       └── telemetry.ts               # Anonymous counters
├── tests/
│   ├── unit/
│   │   ├── fuzzy-match.test.ts
│   │   ├── mdx-to-markdown.test.ts
│   │   └── tools/*.test.ts
│   └── integration/
│       └── mcp-server.test.ts
├── package.json
├── tsconfig.json
├── jest.config.js
└── spec.md                            # This file
```

---

## API Route Integration

### Location

`apps/web/app/api/mcp/route.ts`

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/mcp` | JSON-RPC 2.0 requests |
| GET | `/api/mcp` | Server info & capabilities |
| OPTIONS | `/api/mcp` | CORS preflight |

### Request Format (POST)

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tools/call",
  "params": {
    "name": "get_pattern",
    "arguments": {
      "name": "button"
    }
  }
}
```

### Batch Requests

Up to 10 requests per batch:

```json
[
  { "jsonrpc": "2.0", "id": "1", "method": "tools/call", "params": {...} },
  { "jsonrpc": "2.0", "id": "2", "method": "tools/call", "params": {...} }
]
```

### Features

- **CORS**: Open for subdomain access
- **Rate limiting**: Per-IP with headers
- **Batch processing**: Up to 10 requests
- **Request size limit**: 100KB
- **Response caching**: LRU for identical requests

### GET Response (Server Info)

```json
{
  "name": "ux-patterns-mcp",
  "version": "1.0.0",
  "protocolVersion": "2024-11-05",
  "capabilities": {
    "tools": {
      "listChanged": false
    }
  },
  "serverInfo": {
    "name": "UX Patterns MCP Server",
    "version": "1.0.0"
  }
}
```

---

## Vercel Configuration

Add to `apps/web/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "mcp.uxpatterns.dev" }],
      "destination": "/api/mcp"
    }
  ]
}
```

### DNS Configuration

Add CNAME record:
- `mcp.uxpatterns.dev` → `cname.vercel-dns.com`

---

## Stdio Mode Configuration

For Claude Code local integration, add to `.mcp.json`:

```json
{
  "mcpServers": {
    "ux-patterns": {
      "command": "npx",
      "args": ["tsx", "packages/mcp/src/cli.ts"],
      "cwd": "/path/to/ux-patterns-for-developers"
    }
  }
}
```

---

## Data Flow

```text
┌─────────────────────────────────────────────────────────┐
│  Content Source                                         │
│  /apps/web/content/patterns/**/*.mdx                   │
│  /apps/web/content/glossary/**/*.mdx                   │
│  /apps/web/content/pattern-guide/**/*.mdx              │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Velite Build                                           │
│  - Parses MDX frontmatter                              │
│  - Compiles content                                     │
│  - Generates .velite/docs.json                         │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  MCP Data Layer                                         │
│  - Imports from @/.velite                              │
│  - Filters: status === 'complete' || 'published'       │
│  - Excludes: blog posts                                │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Content Processing                                     │
│  - MDX → Plain Markdown conversion                     │
│  - Glossary term auto-linking                          │
│  - Code block stripping (summary mode)                 │
│  - Relationship mapping                                │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  MCP Response                                           │
│  - JSON-RPC 2.0 format                                 │
│  - Rate limit headers                                   │
│  - Cache headers                                        │
└─────────────────────────────────────────────────────────┘
```

---

## Dependencies

### Package Dependencies

```json
{
  "name": "@repo/mcp",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts src/cli.ts --format esm --dts",
    "dev": "tsup src/index.ts src/cli.ts --format esm --dts --watch",
    "lint": "biome check .",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/node": "^20.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^2.0.0"
  }
}
```

---

## Future Considerations (Not v1)

### 1. Workflows

Curated pattern sequences for common tasks:

```typescript
interface Workflow {
  id: string
  name: string
  description: string
  steps: {
    pattern: string
    order: number
    required: boolean
    notes?: string
  }[]
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}
```

Example workflows:
- `form-accessibility-audit`
- `e-commerce-checkout-review`
- `navigation-best-practices`

### 2. Component References

Link patterns to implementations in `apps/kit`:

```typescript
interface ComponentRef {
  pattern: string
  component: string
  path: string
  framework: 'react' | 'vue' | 'svelte'
  storybook?: string
}
```

### 3. Semantic Search

AI-powered similarity matching using embeddings:

```typescript
interface SemanticSearchParams {
  query: string
  threshold?: number  // Similarity threshold (0-1)
  limit?: number
}
```

---

## Implementation Order

1. **Package setup** (`packages/mcp/`)
   - Initialize with package.json, tsconfig.json
   - Add to workspace root

2. **Core infrastructure**
   - `server.ts`: JSON-RPC 2.0 handler
   - `cli.ts`: Stdio entry point
   - `types.ts`: Type definitions

3. **Utilities**
   - `fuzzy-match.ts`
   - `mdx-to-markdown.ts`
   - `pagination.ts`
   - `rate-limit.ts`
   - `cache.ts`
   - `glossary-linker.ts`
   - `telemetry.ts`

4. **Data layer**
   - Connect to Velite output
   - Filter published content
   - Build relationship map

5. **Reactive tools** (simpler, foundation)
   - `get_pattern`
   - `search_patterns`
   - `list_patterns`
   - `list_categories`
   - `get_glossary_term`

6. **Proactive tools** (more complex)
   - `review_code`
   - `check_accessibility`
   - `suggest_pattern`
   - `get_quick_reference`

7. **Advanced tools**
   - `pattern_advisor`
   - `get_implementation_checklist`

8. **API route**
   - `apps/web/app/api/mcp/route.ts`
   - CORS, rate limiting, caching

9. **Deployment**
   - Vercel rewrite configuration
   - DNS setup for subdomain

10. **Testing**
    - Unit tests for utilities
    - Integration tests for tools
    - E2E tests for API route

---

## Verification Plan

### 1. Local Stdio Test

```bash
# Add to .mcp.json
{
  "mcpServers": {
    "ux-patterns": {
      "command": "npx",
      "args": ["tsx", "packages/mcp/src/cli.ts"]
    }
  }
}

# Test with Claude Code
# Should see ux-patterns tools available
```

### 2. HTTP Test

```bash
# Test single request
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/list"
  }'

# Test tool call
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/call",
    "params": {
      "name": "get_pattern",
      "arguments": { "name": "button" }
    }
  }'
```

### 3. Rate Limit Test

```bash
# Rapid requests to trigger limit
for i in {1..150}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:3000/api/mcp \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":"1","method":"tools/call","params":{"name":"get_pattern","arguments":{"name":"button"}}}'
done

# Should see 429 responses after limit
```

### 4. Fuzzy Match Test

```bash
# Request non-existent pattern
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/call",
    "params": {
      "name": "get_pattern",
      "arguments": { "name": "buton" }
    }
  }'

# Should return suggestions: ["button"]
```

### 5. Integration Test

```bash
# Full flow test
pnpm test packages/mcp
```

### 6. Subdomain Test

After deployment:
```bash
curl https://mcp.uxpatterns.dev
# Should return server info
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | TBD | Initial release |
