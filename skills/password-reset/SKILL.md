---
name: Password Reset
description: "Use when implementing password recovery and reset flows."
metadata:
  id: password-reset
  category: authentication
  pattern: Password Reset
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/authentication/password-reset
  sourcePath: apps/web/content/patterns/authentication/password-reset.mdx
---

# Password Reset

Password recovery and reset flows

## What it solves

**Password Reset** is a multi-step recovery flow that allows users to regain access to their account when they've forgotten their password. The typical flow involves requesting a reset via email, receiving a time-limited token link, and setting a new password.
A well-designed password reset balances security (preventing unauthorized resets) with usability (getting legitimate users back into their accounts quickly and without frustration).

## When to use

Use **Password Reset** to **allow users to recover access to their account when they've forgotten their password**.
**Common scenarios include:**
- User forgot their password and cannot log in
- User wants to change a potentially compromised password
- Administrator triggers a mandatory password reset for security
- Account recovery after detecting suspicious activity
- Periodic password rotation required by security policies

## When to avoid

- Passwordless authentication systems (magic links replace the need)
- Applications using only social login without local passwords
- SSO-only environments where the identity provider handles password management
- Systems where admins provision temporary credentials directly

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

**Do's ✅**
- Associate labels with inputs via `for`/`id`
- Announce errors with `role="alert"` and `aria-describedby`
- Use `autocomplete="email"` on the request form and `autocomplete="new-password"` on the reset form
- Ensure all steps are navigable via keyboard
- Provide clear heading hierarchy across the multi-step flow
**Don'ts ❌**
- Don't use time-sensitive CAPTCHAs that penalize slower users
- Don't rely on color alone to indicate field errors
- Don't auto-submit forms — let users confirm with an explicit button press

## Performance guardrails

### Target Metrics
- **Form render:** < 100ms for each step
- **Reset email delivery:** < 30 seconds after request
- **Token validation:** < 200ms server-side
- **Password update:** < 500ms server-side
- **Redirect after success:** < 200ms navigation start
### Optimization Strategies
**Immediate Confirmation UI**
```javascript
// Show confirmation immediately; send email in background
setSubmitted(true);
await sendResetEmail(email);
```

## Common mistakes

### Revealing Account Existence
**The Problem:**
"No account found with that email" lets attackers enumerate valid accounts.

**How to Fix It:**
Always show "If an account exists, we've sent a reset link." Apply consistent response times for both cases.

### Token Never Expires
**The Problem:**
Reset tokens that never expire can be intercepted and used indefinitely.

**How to Fix It:**
Set tokens to expire in 1 hour (or less). Show a clear error when an expired token is used, with an option to request a new one.

### No Rate Limiting on Reset Requests
**The Problem:**
Attackers flood a user's inbox with reset emails or use the endpoint for email enumeration timing attacks.

**How to Fix It:**
Limit reset requests to 3 per email per hour. Return the same response and timing regardless of whether the email exists.

## Related patterns

- https://uxpatterns.dev/patterns/authentication/login
- https://uxpatterns.dev/patterns/authentication/social-login
- https://uxpatterns.dev/patterns/authentication/two-factor

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/authentication/password-reset
