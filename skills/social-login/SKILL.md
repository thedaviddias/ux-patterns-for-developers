---
name: social-login
description: "Use when implementing oAuth and social media authentication."
metadata:
  id: social-login
  category: authentication
  pattern: Social Login
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/authentication/social-login
  sourcePath: apps/web/content/patterns/authentication/social-login.mdx
---

# Social Login

OAuth and social media authentication

## What it solves

**Social Login** allows users to authenticate using their existing accounts with third-party identity providers like Google, Apple, GitHub, or Facebook. Instead of creating a new username and password, users authorize the application to receive their profile information from a trusted provider via OAuth 2.0 or OpenID Connect.
Social login reduces registration friction dramatically — turning a multi-field form into a single-click action — while providing the application with a verified email address and basic profile data.

## When to use

Use **Social Login** to **reduce sign-up and login friction by leveraging users' existing accounts with trusted providers**.
**Common scenarios include:**
- Consumer web applications where speed of registration matters
- Developer tools where GitHub authentication is natural
- Mobile apps where Google or Apple sign-in follows platform conventions
- E-commerce sites reducing checkout friction for guest users
- Community platforms where social identity adds credibility

## When to avoid

- Enterprise or B2B applications where corporate SSO (SAML) is the norm
- Highly regulated industries (healthcare, finance) where provider dependency is a risk
- Applications requiring identity verification beyond what providers offer
- Offline-first applications where OAuth redirects are impractical
- When your user base has strong privacy concerns about third-party data sharing

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

**Do's ✅**
- Ensure social buttons are focusable and activatable with Enter/Space
- Include the provider name in the button text for screen readers (not just an icon)
- Show loading state with `aria-busy="true"` during the redirect
- Announce errors if the OAuth flow fails (popup blocked, provider error)
**Don'ts ❌**
- Don't use icon-only social buttons without accessible text
- Don't open the OAuth flow in a popup that may be blocked by browsers
- Don't rely on color alone to distinguish provider buttons

## Performance guardrails

### Target Metrics
- **Button render:** < 50ms for all social buttons
- **Redirect initiation:** < 100ms from click to navigation start
- **Callback processing:** < 500ms server-side token exchange
- **Total flow time:** < 10 seconds (user's time, mostly on provider's consent screen)
### Optimization Strategies
**No SDK Dependency for Basic OAuth**
```javascript
// Use simple redirect — no heavy SDKs needed
window.location.href = `${authUrl}?${params}`;
```

## Common mistakes

### Requesting Excessive Permissions
**The Problem:**
Asking for access to contacts, posts, or other unrelated data during login scares users away from granting consent.

**How to Fix It:**
Request only the minimum scopes needed: `email`, `profile`, and `openid`. Request additional permissions incrementally when the user triggers a feature that needs them.

### No Account Linking
**The Problem:**
A user signs up with email, then later tries "Continue with Google" using the same email. The system creates a duplicate account.

**How to Fix It:**
Check if the social provider's email matches an existing account. Prompt the user to link accounts or automatically link if the email is verified by both sides.

### Popup OAuth Flow
**The Problem:**
Opening the OAuth flow in a popup window gets blocked by browsers or breaks on mobile, leaving users stuck.

**How to Fix It:**
Use full-page redirect OAuth flow. It works consistently across all browsers and devices.

## Related patterns

- https://uxpatterns.dev/patterns/authentication/login
- https://uxpatterns.dev/patterns/authentication/signup
- https://uxpatterns.dev/patterns/authentication/two-factor

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/authentication/social-login
