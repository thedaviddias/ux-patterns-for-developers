# MCP token budgets

Use `https://mcp.uxpatterns.dev` for public clients. Prefer narrow searches and
`get_pattern` with `sections: ["Accessibility", "Examples"]` when those are the
sections needed. Omit `sections` to retrieve the full guide. Unknown sections
return the available headings rather than silently returning unrelated content.
Selected sections default to no table of contents; full retrieval retains its
existing default. Every pattern result includes its canonical source URL.

## Reproduce

```sh
pnpm --filter web exec velite build
pnpm --filter @ux-patterns/mcp build
pnpm --filter @ux-patterns/mcp eval:tokens
pnpm --filter @ux-patterns/mcp report:tokens
```

Dependencies are pinned development dependencies: gpt-tokenizer 4.0.0 and
Promptfoo 0.123.1. No model provider, credential, paid API call, cloud sharing,
or telemetry is used by the evaluation command. It drives actual native SDK
requests against the local handler, not mocked handler responses. CI runs it
after corpus generation and builds. Report output defaults to a temporary
`/tmp/ux-mcp-token-report.json`; the checked-in baseline is
`packages/mcp/evals/baseline.json`.

## Measurement and budgets

Counts use OpenAI `o200k_base`. They conservatively include complete MCP JSON,
including both text and structured content, requests, and all eleven tool
schemas. Report columns also separate text-only overhead. Hosts may transform
or deduplicate these fields, so these are payload measurements, not invoices.
A flow includes discovery once; it does not model repeated conversation
history, host framing, model reasoning or final answer generation.

October 5 baseline:

| Flow | Complete payload tokens |
| --- | ---: |
| Full search-field retrieval without TOC | 9,419 |
| Accessibility and Examples retrieval | 3,538 |
| Search then full retrieval | 9,862 |
| Search then targeted retrieval | 3,981 |

Targeted search/retrieval saves about 60% in this fixture. This is a controlled
comparison of the same pattern, not a claim that every conversation saves 60%.
Full-guide corpus retrieval covers all 92 patterns; the largest response is
about 16,500 tokens when duplicate structured content is counted. Full guides
are available for tasks that need them; they are not a cheap default for narrow
questions. No exact Claude token count or pricing claim is made.

Promptfoo evaluates all eleven tools, multi-tool flows, missing results,
advisor continuation/retry, maximum list/search pages, the full quick reference
with related links, and the complete corpus. Assertions enforce discovery
<=2,100 tokens, requests <=250 per fixture, and per-flow response budgets.
Targeted retrieval is capped at 2,200 response tokens; search plus targeted
retrieval at 2,800. Full-corpus responses have an 18,000-token ceiling. These
Maximum list/search/reference fixtures use ceilings of 9,500/10,000/10,000
response tokens respectively. The full quick reference reaches the existing
character cap and explicitly reports truncation; use a category and a small
limit for useful, inexpensive context. These
are fixture regression ceilings with headroom, not runtime token caps or limits
on arbitrary user input. Existing response character and request byte limits
still apply. The negative gate test proves oversized/degraded outputs fail.

Quality assertions retain real code examples, selected headings, working source
URLs, honest missing results, deterministic advisor retries, accessibility
limitations, and an empty unsupported WCAG pass list. This offline suite does
not assess an LLM's tool selection or final answer quality. Real ChatGPT/Claude
review cases remain a separate publication check.

API dollar estimates require current model-specific input/output prices and
actual host usage. ChatGPT/Claude plan consumption is not interchangeable with
API billing. Paid comparative model evaluations need an approved budget.

References: [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer),
[Promptfoo custom providers](https://www.promptfoo.dev/docs/providers/custom-api/).
