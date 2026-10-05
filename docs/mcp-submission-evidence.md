# Connector review evidence — October 5, 2026

The public endpoint is `https://mcp.uxpatterns.dev`, runtime 2.0.2. PR #269
merged as `195f3125c82e63a722971f6a3f88ede754ab2592`; clean CI run
`37265646207` succeeded before production deployment
`dpl_HKN6jc5FZWTeG3Dxfo7UenXhmhA6`. Modern and legacy native SDK production
checks passed, including eleven tools, targeted retrieval, advisor retries and
the exact OpenAI verification challenge. Evaluation libraries are absent from
the traced production function.

## Actual ChatGPT review run

The authenticated maintainer installed a private custom connector pointing to
the public endpoint, without connector authentication. The first prompt ran
separately. Cases 2–8 ran in one follow-up, explicitly requiring fresh UX
Patterns calls, source links, no web search, and no edits/deployments. This is
eight reviewed cases, not eight independent conversations. The first result
took approximately 68 seconds; the combined follow-up took 3 minutes 48 seconds
in ChatGPT Pro. Those durations include host/model processing and do not
measure MCP server latency.

| Case | Observed result |
| --- | --- |
| Find a button for Save | Button guidance, source links, native button, label and saving state; ChatGPT's visible work trace identified a UX Patterns search. |
| Button accessibility guidance | Source-backed guidance; response reported `get_pattern`. |
| Accessible button checklist | Concrete implementation checks; response reported `get_implementation_checklist`. |
| Review `<div onclick="save()">Save</div>` | Non-semantic click-handler finding; potential keyboard/semantics issues; semantic button suggestion. Reported `review_code` and `check_accessibility`; explicitly no verified WCAG passes or whole-site audit. |
| Progressive Loading | Matching glossary definition and related guidance; reported `get_glossary_term`. |
| Deploy an application | Explained no deployment/write capability; no deployment attempted. |
| Certify accessibility law compliance | Declined certification; explained static-check limits and manual/rendered testing. |
| Unknown pattern | Actual `NOT_FOUND` acknowledged; suggestions clearly identified as alternatives. |

Tool names reported in the assistant response are supporting consumer evidence;
the separate native SDK suite verifies exact tool outputs. The recording does
not claim that host-generated prose is identical to the raw tool response.

## Video and accessible transcript

- Reviewer video: `https://uxpatterns.dev/videos/ux-patterns-connector-demo.mp4`
- Landing page/transcript: `https://uxpatterns.dev/mcp/demo`
- English captions: `https://uxpatterns.dev/videos/ux-patterns-connector-demo.vtt`
- Repository assets: `apps/web/public/videos/ux-patterns-connector-demo.*`

The silent video is an edited sequence of genuine captured ChatGPT screens.
Waiting time is shortened; captions describe cases and limits. It contains no
fabricated responses or private sidebar conversations. Local verification:
H.264, 1280×816, approximately 2 minutes 6 seconds, 1.4 MB, fast-start MP4 and
embedded English captions. Verify public HTTP delivery and browser playback
after deployment before relying on the URL in a submission.

## Other consumer and automated evidence

Fresh Claude calls previously confirmed readable Markdown and intact examples,
with empty unsupported accessibility pass lists and explicit unverified
criteria. Its generated TOC defect was tracked in DAV-687 and fixed at the
Velite generator with a durable pnpm patch and native-client regression checks.

gpt-tokenizer and Promptfoo run offline against actual native SDK calls. All 21
fixtures pass, including full corpus retrieval and largest pagination/reference
requests. See [token budgets](mcp-token-budgets.md). The targeted search/retrieval
fixture uses about 60% fewer payload tokens than full retrieval; this does not
predict every user's bill or plan consumption. No paid model evaluation ran.

## Remaining owner-dependent submission prerequisites

Both directories remain unpublished. The OpenAI MCP scan reports no issues and
domain ownership is verified. Its plugin metadata includes the reviewer video;
upload the updated package after verifying the hosted asset. Anthropic's draft
uses the canonical endpoint, read-only tools, listing and real use cases.

The owner must confirm legal operator/contact details and adopt final terms and
accurate privacy disclosures. The terms and privacy documents remain labeled
drafts; no invented legal contact or effective date is published. Final platform
policy agreements require confirmation at the actual acceptance step. Directory
acceptance and approval cannot be inferred from a healthy endpoint or test run.
