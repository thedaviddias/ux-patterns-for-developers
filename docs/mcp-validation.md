# MCP upgrade validation — 2026-10-04

The local upgrade uses MCP SDK 2.3.0 and the 2026-07-28 protocol with legacy
client support. Verification below covers the repository implementation;
deployment and directory approval remain separate release steps.

## Evidence

- Production Next.js build passed compilation, TypeScript and generation of
  368 static pages. Some pages retried after the 60-second worker timeout;
  all completed. Do not treat the build duration as request latency.
- MCP: 356 tests across 17 suites, including real modern/legacy clients,
  all eleven tools, schema validation, request isolation and submitted-code
  cache exclusion. Coverage: 85.84% lines, 80% branches. Interactive
  continuation tests verify retry safety, fresh-worker resumption and rejection
  of invalid choices/tokens. Search recovery tests ensure temporary errors are
  retried rather than cached.
- HTTP route: five tests covering malformed/oversized requests, methods,
  CORS, Origin validation, rate limits and modern header mismatches.
- Five middleware tests verify the exact domain-verification file bypasses
  MCP rewriting, accepts only reads and preserves limits on ordinary MCP calls.
  Generic HTTP clients are accepted on the public subdomain; vulnerability
  scanners are rejected before reaching the function.
- Stdio: real spawned clients passed in both protocol eras on the host runtime
  and target Node 24.21.0 LTS.
- All seven workspace typecheck tasks passed. Frozen pnpm installation,
  workspace dependency consistency and 26 CI regression checks passed.
- All 530 workspace tests passed after the consumer-output corrections below.
  Initial release CI run 37260400756 passed on
  `02ee2bc`; its tree matches squash merge `81c8b5f` exactly.
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

A repeat during production deployment measured 232 requests/second, p50
4.95 ms and p95 252 ms, with about 3.9 MB retained heap growth. These local runs
were not controlled comparisons; neither demonstrates production capacity.

## Initial production verification — October 4, 2026

Version 2.0.0 was deployed at `https://mcp.uxpatterns.dev` from the clean
`02ee2bc` build with identical source tree to merged PR #265 (`81c8b5f`).
Vercel deployment `dpl_7k3tKZ2d6K2DNK1KHDd1ZTxk4DBV` is Ready and aliases
both the website and MCP subdomain. Direct SDK clients passed all eleven tools
with the modern protocol, legacy discovery/retrieval, deterministic advisor
retries and the exact public verification challenge. Production checks required
no authentication or preview bypass.

A small direct HTTP sample of ten requests at concurrency two measured p50
116 ms and p95 225 ms; connection took 674 ms and the first search took 230 ms.
This includes network overhead. It is a smoke sample, not a capacity test,
cold-start guarantee, SLA or long-running soak. It stayed below the public
per-IP limit. OpenAI's portal verified the domain and discovered all eleven tools,
with no MCP scan issues; directory publication remains pending.

## Consumer output corrections — October 5, 2026

A real Claude conversation successfully used search, retrieval, code review and
accessibility tools, but exposed compiled MDX in pattern bodies and unsupported
WCAG pass claims. Patch 2.0.1 uses original source content, preserves fenced and
inline code examples, resolves unique short slugs, leaves `passed` empty, and
returns explicit unverified criteria and limitations. It also flags missing
semantics on clickable divs. Tests exercise actual generated content over both
protocol eras rather than only checking that a response is nonempty.

PR #267 merged as `7634d23`; its clean source tree matches build `a6f7c4a`.
CI run `37264067315` passed tests, types, coverage and production build.
Version 2.0.1 is deployed at the canonical subdomain in Ready deployment
`dpl_HZKRpw5jwMtrFL1G8kvHsLWfKXtU`. Direct production SDK checks passed all
eleven modern tools, legacy discovery/retrieval, advisor retries and the exact
domain challenge. Fresh Claude calls confirmed readable Markdown, intact
examples, short-slug resolution, empty `passed`, unverified contrast/focus, and
keyboard/name-role issues. OpenAI rescanned all eleven tools with no issues.
These checks do not establish complete ChatGPT prompt coverage or directory
approval. Claude also identified generated TOC titles with an `undefined`
prefix; that separate content-generation defect is tracked in DAV-687.

A ten-request production sample at concurrency two measured p50 101 ms and
p95 1,960 ms, including one slow request; connection took 308 ms and first
search 230 ms. This small sample is not a capacity or cold-start guarantee.
A local 1,000-request
sample after the corrections measured 4,504 requests/second and p95 5.26 ms,
with about 3.9 MB retained heap growth. Host load differed from earlier runs;
do not interpret the difference as a controlled performance improvement.

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

Before release, the public endpoint reported server version 1.0.0.
The upgraded server was deployed to a protected Vercel preview from commit
`86ebf663deec32b568e322d3306ee364c9c4f4f7`. Real SDK clients passed all eleven
tools using the modern protocol, legacy discovery/retrieval, and deterministic
advisor retries. The public verification file returned the exact expected token.
These checks used authenticated preview access and a permitted client Origin;
CLI authentication overhead makes their duration unsuitable as a latency benchmark.
The production verification above supersedes that staging result. Directory
publication is still pending. Follow
[the publication runbook](mcp-publication.md) for production proof, publisher
identity, terms/privacy review, domain verification and platform approval.
