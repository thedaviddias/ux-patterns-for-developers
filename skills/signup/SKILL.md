---
name: signup
description: "Use when implementing user registration and account creation."
metadata:
  id: signup
  category: authentication
  pattern: Sign Up Flow
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/authentication/signup
  sourcePath: apps/web/content/patterns/authentication/signup.mdx
---

# Sign Up Flow

User registration and account creation

## What it solves

**Sign Up Flow** is the registration process through which new users create an account. It collects the minimum required information (typically name, email, and password), validates inputs, and onboards users into the application.
The best sign-up flows minimize friction by asking for only what's essential, providing real-time validation, and offering alternative registration methods like social login to reduce abandonment.

## When to use

Use **Sign Up Flow** to **create new user accounts and collect the minimum information needed to get started**.
**Common scenarios include:**
- Web applications requiring user accounts for personalized features
- E-commerce platforms where accounts enable order tracking and wishlists
- SaaS products gating features behind registered accounts
- Community platforms where identity is needed for participation
- Subscription services requiring billing and profile information

## When to avoid

- Content that should be freely accessible without registration
- One-time transactions where guest checkout suffices
- Internal tools where accounts are provisioned by administrators
- Situations where a login wall would drive users away (consider delayed registration)

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

**Do's ✅**
- Associate all fields with `<label>` elements
- Use `autocomplete="new-password"` on the password field to signal account creation
- Announce validation errors with `role="alert"` and `aria-describedby`
- Provide accessible password strength information via `role="progressbar"` with `aria-label`
- Ensure terms links open in a way that doesn't lose form data
**Don'ts ❌**
- Don't rely on color alone for password strength indication — pair with text labels
- Don't auto-submit the form when the last field is filled
- Don't use CAPTCHAs that are inaccessible to [screen reader](/glossary/screen-reader) users (use invisible reCAPTCHA or hCaptcha)

## Performance guardrails

### Target Metrics
- **Form render:** < 100ms for the complete signup form
- **Validation response:** < 100ms for inline field validation
- **Password strength calculation:** < 16ms per keystroke
- **Registration request:** < 1500ms (show loading immediately)
- **Verification email:** Sent within 30 seconds of registration
### Optimization Strategies
**Debounce Inline Validation**
```javascript
let timeout;
emailInput.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(validateEmail, 300);
});
```

## Common mistakes

### Asking for Too Much Information
**The Problem:**
Requiring phone number, company name, job title, address, and other fields at signup creates a wall of inputs that drives users away.

**How to Fix It:**
Ask for only email and password at signup. Collect additional information through progressive profiling after the user is onboarded.

### No Email Verification
**The Problem:**
Allowing users to sign up with any email without verification leads to fake accounts, spam, and account recovery issues.

**How to Fix It:**
Send a verification email immediately after signup. Allow limited access until the email is confirmed. Use a clear verification prompt.

### Overly Complex Password Requirements
**The Problem:**
Requiring uppercase, lowercase, number, special character, minimum 12 characters, and no dictionary words frustrates users and doesn't proportionally improve security.

**How to Fix It:**
Use a minimum length (8-12 characters) and a strength meter that encourages strong passwords without rigid rules. Consider supporting passkeys as an alternative.

## Related patterns

- https://uxpatterns.dev/patterns/authentication/account-settings
- https://uxpatterns.dev/patterns/authentication/login
- https://uxpatterns.dev/patterns/authentication/social-login

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/authentication/signup
