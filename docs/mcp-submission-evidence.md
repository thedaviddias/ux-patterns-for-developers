# Connector review evidence — October 5, 2026

The public endpoint is `https://mcp.uxpatterns.dev`, runtime 2.0.3. PR #270
merged as `722f65320ac19aaed3f71910dd1734bc393ad788`. Production build source
`785fa3abb750771d84e28fe66b24de75b0b52cc0` has the same tree as the merge.
Deployment `dpl_4ptE5kHJbTqFQCYnVTes16AjJ88F` is Ready. Clean CI run
`37268064018` passed the runtime source before a separately verified caption
punctuation correction and final production build. It ran 531 workspace tests
(357 MCP), seven typechecks and 21 offline token gates. MCP coverage was
86.23% lines and 80.36% branches; the build generated 369 pages.
Modern and legacy native production checks passed all eleven tools, title
annotation equality, targeted retrieval, recursive TOC titles, advisor retries
and the exact OpenAI verification challenge (23 requests). Evaluation libraries
are absent from the 173-file production function trace.

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
embedded English captions. Public verification returned HTTP 200 for the page
and captions, and HTTP 206 video/mp4 for a byte-range request. Actual browser
playback loaded the full 125.93-second duration and progressed past 35 seconds
without a media error. The accessible recording URL is live.

## Other consumer and automated evidence

Fresh Claude calls exercised all eleven tools successfully, including targeted
retrieval with intact label/input/button examples and canonical source links.
The self-tested declaration is based on actual custom-connector calls, although
the portal summary labels that checkbox as MCP Inspector. Earlier calls confirmed readable Markdown and intact examples,
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
the updated package has been uploaded after verifying the hosted asset. Anthropic's draft
uses the canonical endpoint, read-only tools, listing and real use cases.

The owner must confirm legal operator/contact details and adopt final terms and
accurate privacy disclosures. The terms and privacy documents remain labeled
drafts; no invented legal contact or effective date is published. Final platform
policy agreements require confirmation at the actual acceptance step. Directory
acceptance and approval cannot be inferred from a healthy endpoint or test run.

Runtime 2.0.3 adds `annotations.title` alongside each top-level title. Refreshing
Claude's tool list and reloading/reconnecting the saved submission now shows
all eleven read-only/idempotent tools with no missing-title suggestions.
Reconnection resets form defaults: authentication was explicitly restored to
None and the verified self-test declaration was checked again.

The updated OpenAI package 2.0.1 was uploaded and its review information saved:
five positive cases, three negative cases, the hosted video and release notes.
Metadata checks still require terms and privacy review. Anthropic's filled draft
retains three use cases, test instructions and the video link; policy agreements
remain unchecked. Neither directory has been submitted or published.

Claude also exposed non-blocking recommendation/checklist quality issues,
tracked separately as DAV-695 and DAV-696. All-tool execution success does not
mean every heuristic recommendation is optimal.
