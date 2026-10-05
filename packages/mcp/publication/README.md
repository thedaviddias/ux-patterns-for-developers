# Connector publication draft

`openai/` is a portable plugin draft containing the public MCP configuration,
the existing project icon and five positive/three negative review cases.
Publisher metadata matches the available verified portal identity, David Dias
Digital. The package was accepted as an unpublished OpenAI draft. It is not submission-ready:
add an approved public terms URL and a reviewer-accessible demo recording URL,
verify privacy disclosures, and complete directory review. Version 2.0.1 is
deployed and tested at `https://mcp.uxpatterns.dev`. OpenAI verified the domain
and discovered all eleven tools with no MCP scan issues; the plugin remains
unpublished.
Fresh Claude retrieval and accessibility calls verified readable examples and
explicit unverified criteria; this is not directory approval or certified auditing.
No registered server IDs, challenge tokens or credentials are included.

Package only the plugin contents from `openai/` after resolving these gaps.
Do not include source code, environment files or local build output in the ZIP.
See the repository's `docs/mcp-publication.md` for current official references.

For both directories, the server URL is `https://mcp.uxpatterns.dev` (the root,
with no `/api/mcp` suffix). Keep this URL in all published client examples.

For Anthropic, use the same endpoint, product copy and icon in
`https://claude.ai/directory/manage`, choosing MCP connector. Category:
Development tools. Authentication: none; the server exposes public content.
Documentation: `https://uxpatterns.dev/mcp`. Privacy:
`https://uxpatterns.dev/privacy-policy`. Support: the repository issue tracker.
Confirm the publisher/company contact rather than inventing a legal entity.
Review guidance: the connector has eleven read-only tools, no account setup,
and no write/deployment tools. Code and accessibility checks accept submitted
snippets for deterministic analysis; describe request/log processing accurately.
Complete portal policy acknowledgments using verified facts, not assumptions.
