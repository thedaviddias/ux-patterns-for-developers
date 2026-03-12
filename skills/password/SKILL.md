---
name: Password
description: "Use when implementing secure password entry with feedback."
metadata:
  id: password
  category: forms
  pattern: Password
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/password
  sourcePath: apps/web/content/patterns/forms/password.mdx
---

# Password

Secure password entry with feedback

## What it solves

A **Password Input** is a specialized text field designed to securely collect user passwords. It masks characters to prevent onlookers from reading the input and may include additional security features such as password visibility toggles, strength indicators, and validation requirements.
Password fields are commonly used in **authentication forms, account creation, and security-related input fields** where sensitive data entry is required.

## When to use

- **Login and authentication forms** – Securing user access to accounts.
- **Account creation and password updates** – Ensuring users create strong, secure passwords.
- **Two-factor authentication (2FA) or PIN entry** – Protecting access to critical information.
- **Security-sensitive fields** – Protecting data such as encryption keys or private access codes.

## When to avoid

- **For non-sensitive text input** – Use a standard [text field](/patterns/forms/text-field) instead.
- **For one-time codes (OTP) or PINs** – Use the [Code Confirmation](/patterns/forms/code-confirmation) pattern instead.
- **For password confirmation fields** – Use an inline validation approach to avoid user frustration.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

**Do's ✅**
- Ensure the password toggle is **keyboard accessible**.
- Use **aria-describedby** to associate password requirements with the input field.
- Maintain **high contrast and clear focus states**.
- Allow users to **verify their input** without compromising security.
**Don'ts ❌**
- Don't rely on placeholder text for password guidance—it disappears when users type.
- Avoid requiring **excessive special characters** that make passwords difficult to remember.
- Don't assume all users can see visual strength indicators—provide **text-based guidance**.

## Related patterns

- https://uxpatterns.dev/patterns/forms/code-confirmation
- https://uxpatterns.dev/patterns/forms/text-field

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/password
