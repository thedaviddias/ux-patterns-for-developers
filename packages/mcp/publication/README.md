# Connector publication draft

`openai/` is a portable plugin draft containing the public MCP configuration,
the existing project icon and five positive/three negative review cases.
Publisher text currently follows the repository author, David Dias; confirm it
matches the verified portal identity before uploading. It is not submission-ready:
add an approved public terms URL and a reviewer-accessible demo recording URL,
verify privacy disclosures, and deploy/test the upgraded endpoint first.
No registered server IDs, challenge tokens or credentials are included.

Package only the plugin contents from `openai/` after resolving these gaps.
Do not include source code, environment files or local build output in the ZIP.
See the repository's `docs/mcp-publication.md` for current official references.

For Anthropic, use the same endpoint, product copy and icon in
`https://claude.ai/directory/manage`, choosing MCP connector. Category:
Developer tools. Authentication: none; the server exposes public content.
Documentation: `https://uxpatterns.dev/mcp`. Privacy:
`https://uxpatterns.dev/privacy-policy`. Support: the repository issue tracker.
Confirm the publisher/company contact rather than inventing a legal entity.
Review guidance: the connector has eleven read-only tools, no account setup,
and no write/deployment tools. Code and accessibility checks accept submitted
snippets for deterministic analysis; describe request/log processing accurately.
Complete portal policy acknowledgments using verified facts, not assumptions.
