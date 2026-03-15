---
name: account-settings
description: "Use when implementing user account configuration and preferences."
metadata:
  id: account-settings
  category: authentication
  pattern: Account Settings
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/authentication/account-settings
  sourcePath: apps/web/content/patterns/authentication/account-settings.mdx
---

# Account Settings

User account configuration and preferences

## What it solves

**Account Settings** is the centralized interface where authenticated users manage their account configuration, security preferences, notification settings, and personal data. It serves as the control center for everything related to the user's relationship with the application.
A well-organized settings page groups related options logically, confirms destructive actions, and provides clear feedback when changes are saved — all while keeping sensitive operations behind re-authentication.

## When to use

Use **Account Settings** to **give users control over their account configuration, security, and preferences**.
**Common scenarios include:**
- Changing account email or password
- Managing notification preferences (email, push, in-app)
- Configuring privacy and data sharing settings
- Setting up or managing [two-factor authentication](/patterns/authentication/two-factor)
- Managing connected applications and [social login](/patterns/authentication/social-login) providers
- Deleting or deactivating an account

## When to avoid

- Public-facing profile display (use [User Profile](/patterns/authentication/user-profile) instead)
- Application-level settings that affect all users (use an admin panel)
- First-time onboarding configuration (use an onboarding wizard)
- Content or project settings specific to a workspace (use project settings)

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

**Do's ✅**
- Use proper heading hierarchy (h2 for sections, h3 for items)
- Associate all form fields with labels
- Announce save status with `aria-live="polite"` on the status element
- Ensure the settings navigation is a `<nav>` with `aria-label`
- Use `aria-current` on the active navigation item
**Don'ts ❌**
- Don't rely on color alone for status indicators (enabled/disabled)
- Don't auto-save without confirmation for destructive changes
- Don't use modals for every setting change — inline editing is faster

## Performance guardrails

### Target Metrics
- **Settings page load:** < 200ms for the full page with all sections
- **Save operation:** < 500ms round-trip
- **Toggle response:** < 50ms visual feedback
- **Section navigation:** < 50ms for tab/scroll transitions
### Optimization Strategies
**Lazy Load Settings Sections**
```jsx
const SecuritySettings = lazy(() => import('./SecuritySettings'));
```

## Common mistakes

### Global Save Button for All Settings
**The Problem:**
A single "Save all" button at the bottom of the page means users must scroll to save, and it's unclear which changes will be applied.

**How to Fix It:**
Use per-section save buttons. Each section saves independently with its own feedback message.

### No Re-Authentication for Sensitive Changes
**The Problem:**
Users can change their email, password, or disable 2FA without proving their identity again, allowing attackers with session access to take over the account.

**How to Fix It:**
Require the current password (or 2FA code) before allowing changes to email, password, security settings, or account deletion.

### No Confirmation for Account Deletion
**The Problem:**
A single click on "Delete account" permanently destroys the account without warning.

**How to Fix It:**
Use a multi-step confirmation: first click reveals a warning, second click confirms. Consider requiring the user to type "DELETE" or their email. Offer a grace period for recovery.

## Related patterns

- https://uxpatterns.dev/patterns/authentication/password-reset
- https://uxpatterns.dev/patterns/authentication/social-login
- https://uxpatterns.dev/patterns/authentication/two-factor
- https://uxpatterns.dev/patterns/authentication/user-profile

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/authentication/account-settings
