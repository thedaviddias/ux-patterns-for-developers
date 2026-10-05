# Public MCP connector publication

The production endpoint is `https://mcp.uxpatterns.dev`. It serves public UX
Patterns content without authentication. All eleven tools are read-only; code
review and accessibility checks are deterministic heuristics, not a full audit.

Use the subdomain root in all public setup instructions, client configurations,
installation links, and directory submissions. `https://uxpatterns.dev/mcp` is
the human-readable documentation page; `/api/mcp` is an internal route, not the
public connector address. Keep the public URL stable if hosting changes.

## Transport and deployment contract

- MCP 2026-07-28 uses the official SDK v2 stateless request factory. Legacy
  2025 clients remain supported on the same endpoint, including `initialize`.
- HTTP POST serves requests, OPTIONS handles CORS, and GET/DELETE return 405.
  The subdomain root rewrites to `/api/mcp`; the exact verification file at
  `/.well-known/openai-apps-challenge` bypasses MCP rewriting.
  No session ID is issued. Browser Origin headers are validated against UX
  Patterns, ChatGPT, Claude and loopback hosts; requests without Origin are
  accepted for cloud and CLI clients. Stdio supports both protocol eras.
- The SDK rejects malformed requests, header/body mismatches and bodies above
  100 KiB while reading. HTTP responses are not shared-cacheable. Tool-list
  results advertise a one-hour public cache hint to modern clients.
- Text responses are capped at 32,000 characters. When truncated, the uncapped
  structured duplicate is omitted. Tool schemas are compiled once per registry; protocol server instances are
  created and disposed per request. Content is cached within each process. Public search results use a bounded
  100-entry, five-minute cache; submitted code snippets are not cached.
- Pattern and glossary guidance comes from original MDX source, not the website's
  compiled rendering code. Markdown conversion preserves literal code examples.
  Unambiguous short pattern slugs resolve to their published category path.
- Accessibility results identify potential issues and unverified criteria.
  The legacy `passed` array remains empty: a static snippet cannot certify WCAG
  conformance, contrast, focus behavior or assistive-technology support.
- Interactive advisor choices travel in a validated, bounded continuation token.
  The same token and choices return the same next question across workers.
  Tokens contain only selected options, are not credentials, and are not
  retained in server-side sessions. Old or invalid tokens give a restart path.
- Rate limits currently allow 30 requests/minute per IP. Cloud-hosted connector
  users may share an egress IP; measure real platform traffic before rollout.
  Redis/KV is needed for a globally coordinated limit; in-memory fallbacks only
  cover an individual instance. Do not bypass this with caller-supplied IDs.
- Deploy the built content together with the server. Verify that the function
  includes `.velite/docs.json` and does not trace the entire repository.

## Reproducible verification

From the repository root:

```sh
pnpm build
pnpm check:type
pnpm test
pnpm --filter @ux-patterns/mcp test:coverage --runInBand
pnpm --filter @ux-patterns/mcp exec node scripts/smoke-stdio.mjs
pnpm --filter @ux-patterns/mcp benchmark
```

The SDK tests exercise real legacy and modern clients, all public tools against
built content, validation, tool errors, malformed JSON, and concurrent request
isolation. Route tests cover CORS, byte limits, throttling and header mismatches.
The benchmark reports connection time, throughput, p50/p95/p99 latency, payload
size and heap growth for a mix of discovery and search calls. Local results
exclude network and serverless cold starts; they are not production guarantees.

For staging, keep load below the public per-IP limit:

```sh
MCP_BENCHMARK_URL=https://STAGING_HOST/api/mcp \
MCP_BENCHMARK_REQUESTS=10 MCP_BENCHMARK_CONCURRENCY=2 \
pnpm --filter @ux-patterns/mcp benchmark
```

Also test real prompts in ChatGPT developer mode and Claude's custom connector
UI: find a search-field pattern; compare autocomplete and select; review an
accessible button; request an unknown pattern and follow its suggestions.
Confirm tool selection, source links, empty states and no write operations.

## Directory submissions

Release status on October 5, 2026: runtime 2.0.2 is deployed to the canonical
subdomain from merged PR #269 (`195f312`). OpenAI verified domain ownership,
discovered all eleven tools, and reported no issues in its MCP scan. The plugin
is configured but unpublished. Five positive and three negative ChatGPT review
cases completed; the captioned video and transcript are included in the
submission assets. See [review evidence](mcp-submission-evidence.md) and
[token budgets](mcp-token-budgets.md). Legal terms/privacy approval and final
portal agreements remain prerequisites; a configured connector is not a listing.

OpenAI accepts remote MCP servers as part of a plugin. Follow the
[submission flow](https://developers.openai.com/plugins/deploy/submission),
[package format](https://developers.openai.com/plugins/build/plugins), and
[remote MCP review requirements](https://developers.openai.com/plugins/deploy/app-review).
Use the universal endpoint. Complete publisher identity and domain verification
in the developer portal; use the exact issued challenge token. Provide product,
support, privacy and terms URLs, listing assets, realistic positive and negative
review cases, and supported countries. A deployed endpoint is not a published
listing. Never invent a registered server ID or verification token.

Anthropic accepts remote MCP connectors through its
[developer submission portal](https://claude.ai/directory/manage).
Every tool includes a display title and safety annotations. Follow its
[submission checklist](https://claude.com/docs/connectors/building/submission).
Test first as a [custom connector](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp),
then provide the public endpoint, publisher details, listing materials and review
instructions. Approval and publication are separate from local verification.

Before submission, resolve the publisher identity, public terms URL, portal
access, production deployment proof and real-platform prompt tests. The existing
privacy URL is `https://uxpatterns.dev/privacy-policy`; confirm it accurately
covers connector request processing and hosting logs. Do not claim that code is
never processed: two tools accept snippets, even though tools perform no writes.

## Runtime and dependency compatibility exceptions

The project targets Node 24 LTS (24.21.0) and pnpm 10.34.6. Node typings
match the runtime major. pnpm 12 migration is tracked alongside tooling upgrades
in DAV-656; the current package-manager major is retained.

TypeScript remains on 5.9.3: TypeScript 7's native compiler does not expose the
compiler API required by ts-jest and tsup. Vitest remains on the latest compatible
4.x release because the current assertion extensions do not support Vitest 5's
new types. Upgrade those together with their dependent tooling in a follow-up;
do not suppress errors or bypass hooks to claim compatibility.
