---
name: two-factor
description: "Learn how to implement two-factor authentication. Use when you need to two-factor authentication setup and verification."
user-invocable: true
triggers:
  - two
  - factor
  - two-factor
  - authentication
metadata:
  id: two-factor
  category: authentication
  pattern: Two-Factor Authentication
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/authentication/two-factor
  sourcePath: apps/web/content/patterns/authentication/two-factor.mdx
---

# Two-Factor Authentication

Two-factor authentication setup and verification

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

**Two-Factor Authentication (2FA)** adds a second verification step after the user enters their password, requiring proof of something they have (a phone, security key, or authenticator app) in addition to something they know (their password). This dramatically reduces the risk of unauthorized access from stolen credentials.
The 2FA pattern covers both the **setup flow** (enrolling a second factor) and the **verification flow** (entering a code or using a device during login).

## When to use and when to avoid

**Use when:**

Use **Two-Factor Authentication** to **protect accounts with an additional verification layer beyond username and password**.
**Common scenarios include:**
- Financial applications, banking, and payment platforms
- Email services and communication platforms
- Admin dashboards and privileged user accounts
- Healthcare and legal applications with sensitive data
- Developer platforms with access to infrastructure and code repositories

**Avoid when:**

- Low-risk applications where the cost of 2FA outweighs the security benefit
- Applications targeting users with limited technical proficiency (consider risk-based auth instead)
- When the friction of 2FA would significantly reduce adoption of a consumer product (make it optional)
- Kiosk or shared-device environments where device-based factors are impractical

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

**Do's ✅**
- Use `inputmode="numeric"` on the code input for the numeric keyboard on mobile
- Use `autocomplete="one-time-code"` so browsers and password managers can autofill SMS codes
- Provide `alt` text for the QR code image describing its purpose
- Announce errors with `role="alert"` when an invalid code is entered
- Provide a text-based alternative to the QR code (manual entry of the secret key)
**Don'ts ❌**
- Don't make the QR code the only way to set up TOTP — always offer manual entry
- Don't use time pressure that penalizes users who need more time to enter codes
- Don't rely on color alone for success/error feedback on code entry

## Performance guardrails

### Target Metrics
- **QR code generation:** < 200ms server-side
- **Code verification:** < 300ms server-side
- **SMS delivery:** < 10 seconds
- **Code input response:** < 50ms keystroke-to-display
- **Auto-submit:** < 100ms from 6th digit to submission
### Optimization Strategies
**Client-Side QR Code Generation**
```javascript
const qrDataUrl = await QRCode.toDataURL(totpUri);
```

## Common mistakes

### No Backup Code Recovery
**The Problem:**
Users who lose their authenticator device have no way to access their account.

**How to Fix It:**
Generate 8-10 one-time backup codes during 2FA setup. Clearly prompt users to save them. Provide a backup code entry option on the verification screen.

### SMS as the Only 2FA Method
**The Problem:**
SMS codes are vulnerable to SIM swapping, SS7 interception, and delivery delays.

**How to Fix It:**
Offer TOTP (authenticator app) as the primary method. Use SMS only as a fallback. Consider supporting security keys for high-security accounts.

### Time-Skew Rejection
**The Problem:**
TOTP codes are rejected because the user's device clock is slightly out of sync with the server.

**How to Fix It:**
Accept codes from the current time window plus one window before and after (±30 seconds). This is standard TOTP tolerance.

## Related patterns

- https://uxpatterns.dev/patterns/authentication/account-settings
- https://uxpatterns.dev/patterns/authentication/login
- https://uxpatterns.dev/patterns/authentication/password-reset
- https://uxpatterns.dev/patterns/authentication/social-login

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/authentication/two-factor
