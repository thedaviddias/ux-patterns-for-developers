> Historical review draft: approved by David Dias on October 5, 2026.
> The adopted public text is in apps/web/content/pages/privacy-policy.mdx.
> Operator: David Dias. Support/privacy: hello@thedaviddias.com.

# UX Patterns privacy policy — draft for review

Draft prepared October 5, 2026. Do not publish until the operator, private
contact and provider retention/configuration have been confirmed. This replaces
unsupported claims that the website has no analytics or monitoring.

## Scope and operator

This policy covers uxpatterns.dev and the public connector at
https://mcp.uxpatterns.dev. Operator and private privacy contact: pending owner
confirmation. Your AI provider separately controls its prompts, conversations,
model processing and account settings.

## Connector requests

The public connector does not require an account or API key. It processes tool
names and arguments to respond, including queries and code snippets submitted
for static review. Submit only information you are authorized to share; avoid
credentials and unnecessary personal or confidential information.

The connector does not edit applications or deploy them. Code checks are local
deterministic heuristics rather than calls to a model provider. Submitted code
is not placed in the public search cache. Public search responses and their
query keys may be cached temporarily in process memory for up to five minutes.
The implementation does not write reviewed snippets to an application database;
this does not mean infrastructure or error logs can never contain request
context. Network addresses are processed for request delivery and rate limiting.

## Website measurement and reliability

The production website uses OpenPanel for page views, outgoing-link events and
explicitly tracked attributes. It uses Sentry for error monitoring and diagnostic
context. Vercel hosts the site and connector and provides infrastructure and
security functions. The website uses BotID protection on newsletter and feedback
requests. These services have their own processing and retention settings.
The published policy must reflect actual enabled settings; do not claim that
there is no monitoring, no tracking, or that only email addresses are processed.

## Newsletter

Newsletter signup collects an email address and submitted subscription metadata,
such as language, product and source domain, where provided. Resend processes
subscriptions and newsletter delivery. Newsletter consent and unsubscribe
behavior must match the current subscription implementation.

## Purposes and service providers

Information is processed to respond to requests, deliver requested newsletters,
operate and secure the service, diagnose errors and understand website usage.
Hosting, diagnostics, analytics and email delivery involve the providers named
above. Confirm the applicable provider arrangements and processing locations
before describing transfers or making legal-basis claims.

## Retention and requests

Application/provider retention periods and deletion procedures remain to be
confirmed from the provider dashboards. Do not promise immediate deletion or a
specific retention duration without verifying it. A private contact must be
published for privacy requests; public GitHub issues are for non-sensitive
support only. Rights and response procedures should match the operator's
location and applicable requirements.

## Owner decisions required before adoption

- Confirm full legal operator name and public support/private privacy email.
- Verify OpenPanel, Sentry, Vercel and Resend retention, locations and options.
- Confirm applicable privacy rights and request-handling procedures.
- Approve the final public text and effective date.

Technical evidence: packages/analytics/providers/openpanel.tsx,
apps/web/instrumentation-client.ts, apps/web/sentry.server.config.ts,
apps/web/app/api/newsletter/route.ts and the MCP server request/cache code.
This draft intentionally preserves uncertainty rather than publishing invented
provider settings or assurances.
