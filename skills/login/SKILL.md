---
name: Login Form
description: "Use when implementing user authentication and sign-in forms."
metadata:
  id: login
  category: authentication
  pattern: Login Form
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/authentication/login
  sourcePath: apps/web/content/patterns/authentication/login.mdx
---

# Login Form

User authentication and sign-in forms

## What it solves

**Login Form** is the primary gateway through which users authenticate and gain access to protected content and features. It typically consists of an identifier field (email or username), a password field, and a submit button, often accompanied by "Remember me", "Forgot password", and social login options.
A well-designed login form balances security with usability — minimizing friction for legitimate users while protecting against unauthorized access.

## When to use

Use **Login Form** to **authenticate returning users and grant access to protected resources**.
**Common scenarios include:**
- Web applications requiring user authentication before accessing features
- E-commerce sites where users sign in to view orders, wishlists, and saved addresses
- SaaS platforms gating features behind user accounts
- Community or social platforms requiring identity for participation
- Admin dashboards and internal tools with role-based access

## When to avoid

- Public-facing pages that don't require authentication
- Read-only content that benefits from open access (blogs, documentation)
- One-time interactions where authentication creates unnecessary friction
- Kiosk or shared-device interfaces where session management is impractical

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

**Do's ✅**
- Associate all fields with `<label>` elements using `for`/`id` pairing
- Use `autocomplete="email"` and `autocomplete="current-password"` for browser autofill
- Display errors with `role="alert"` and link them to fields via `aria-describedby`
- Mark invalid fields with `aria-invalid="true"`
- Ensure the password toggle updates its `aria-label` when toggled
- Support form submission via Enter key
**Don'ts ❌**
- Don't use `placeholder` as a replacement for labels
- Don't disable the submit button without explaining why (use validation messages instead)

## Performance guardrails

### Target Metrics
- **Form render:** < 100ms for the complete login form
- **Input response:** < 50ms keystroke-to-display
- **Validation feedback:** < 100ms for inline validation
- **Authentication request:** < 1000ms perceived (show loading immediately)
- **Redirect after success:** < 200ms navigation start
### Optimization Strategies
**Prefetch the Post-Login Destination**
```html
<link rel="prefetch" href="/dashboard" />
```

## Common mistakes

### Revealing Account Existence
**The Problem:**
Error messages like "No account with that email" or "Wrong password" let attackers enumerate valid accounts.

**How to Fix It:**
Use a generic message: "Invalid email or password. Please try again." Apply the same response time for both cases.

### No Rate Limiting Feedback
**The Problem:**
Users can submit the form endlessly with no indication that their account is being locked or rate-limited.

**How to Fix It:**
After 3-5 failed attempts, show a message: "Too many attempts. Please wait 30 seconds before trying again." Implement server-side rate limiting with exponential backoff.

### Clearing Fields on Error
**The Problem:**
The form clears the email field on failed login

**How to Fix It:**
Preserve the email value after a failed attempt. Only clear the password field, as retyping the password is a security best practice.

## Related patterns

- https://uxpatterns.dev/patterns/authentication/password-reset
- https://uxpatterns.dev/patterns/authentication/signup
- https://uxpatterns.dev/patterns/authentication/social-login
- https://uxpatterns.dev/patterns/authentication/two-factor

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/authentication/login
