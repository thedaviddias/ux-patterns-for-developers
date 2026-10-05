# MCP upgrade validation — 2026-10-04

The local upgrade uses MCP SDK 2.3.0 and the 2026-07-28 protocol with legacy
client support. Verification below covers the repository implementation;
deployment and directory approval remain separate release steps.

## Evidence

- Production Next.js build passed compilation, TypeScript and generation of
  368 static pages. Some pages retried after the 60-second worker timeout;
  all completed. Do not treat the build duration as request latency.
- MCP: 343 tests across 15 suites, including real modern/legacy clients,
  all eleven tools, schema validation, request isolation and submitted-code
  cache exclusion. Coverage: 82.13% lines, 75.2% branches.
- HTTP route: five tests covering malformed/oversized requests, methods,
  CORS, Origin validation, rate limits and modern header mismatches.
- Stdio: real spawned clients passed in both protocol eras on the host runtime
  and target Node 24.21.0 LTS.
- All seven workspace typecheck tasks passed. Frozen pnpm installation,
  workspace dependency consistency and seven CI workflow checks passed.
- The MCP function trace contains 173 files, including `.velite/docs.json`,
  with no `.env` files or public assets. The previous broad repository tracing
  warning is gone.

## Local performance

Run after building content and MCP:

```sh
MCP_BENCHMARK_REQUESTS=1000 MCP_BENCHMARK_CONCURRENCY=10 \
pnpm --filter @ux-patterns/mcp exec node --expose-gc scripts/benchmark.mjs
```

One run with 1,000 mixed discovery/search requests and concurrency 10 measured
466 requests/second, p50 7.38 ms, p95 88.89 ms and p99 400.06 ms. Cold search
took 715 ms; connection took 388 ms. Maximum payload was 7,167 bytes. Retained
heap growth after collection was about 3.9 MB. This run overlapped a production
build and excludes network/serverless overhead; it is neither a production SLA
nor a long-running memory-leak assessment.

## Publication review cases

Test these in both ChatGPT and Claude against a deployed staging connector:

| Prompt | Expected behavior |
| --- | --- |
| Find an accessible search field pattern. | Search and retrieve relevant guidance with working source links. |
| Compare autocomplete and select for a list of countries. | Use the comparison/decision tools and explain tradeoffs. |
| Review this button: `<div onclick="save()">Save</div>`. | Identify heuristic accessibility issues; explain a semantic button alternative. |
| Find a pattern named definitely-not-a-real-pattern. | Give an honest missing result and useful next steps. |
| Change my application and deploy it. | Explain that the connector provides guidance and has no write/deploy tools. |
| Run a complete certified accessibility audit. | Explain heuristic limits without claiming certification. |

The public endpoint still reported server version 1.0.0 during this session.
The upgraded server has not been deployed or submitted. Follow
[the publication runbook](mcp-publication.md) for production proof, publisher
identity, terms/privacy review, domain verification and platform approval.
