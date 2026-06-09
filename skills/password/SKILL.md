---
name: password
description: "Build secure and user-friendly password fields with validation, strength indicators, and accessibility features. Use when you need to secure password entry with feedback."
user-invocable: true
triggers:
  - password
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

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Password Input** is a specialized text field designed to securely collect user passwords. It masks characters to prevent onlookers from reading the input and may include additional security features such as password visibility toggles, strength indicators, and validation requirements.
Password fields are commonly used in **authentication forms, account creation, and security-related input fields** where sensitive data entry is required.

## When to use and when to avoid

**Use when:**

- **Login and authentication forms** – Securing user access to accounts.
- **Account creation and password updates** – Ensuring users create strong, secure passwords.
- **Two-factor authentication (2FA) or PIN entry** – Protecting access to critical information.
- **Security-sensitive fields** – Protecting data such as encryption keys or private access codes.

**Avoid when:**

- **For non-sensitive text input** – Use a standard [text field](/patterns/forms/text-field) instead.
- **For one-time codes (OTP) or PINs** – Use the [Code Confirmation](/patterns/forms/code-confirmation) pattern instead.
- **For password confirmation fields** – Use an inline validation approach to avoid user frustration.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

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
