---
name: Modal
description: "Use when you need to display focused content or actions."
metadata:
  id: modal
  category: content-management
  pattern: Modal
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/content-management/modal
  sourcePath: apps/web/content/patterns/content-management/modal.mdx
---

# Modal

Display focused content or actions

## What it solves

A **modal** appears on top of the main application screen, blocking page interaction until closed.
Modals display important information, request user input, or confirm actions in a focused way.

## When to use

Use modals to **interrupt user flow** for important information or required user input before proceeding.
**Common scenarios include:**
- **Confirmation dialogs** – "Are you sure you want to delete this item?"
- **Critical system messages** – session expiration warnings, important alerts
- **Forms requiring user input** – login, payment, or signup flows
- **Media previews** – images or videos in lightbox overlays
- **Multi-step processes** – checkout steps or onboarding flows
- **Terms and conditions** – requiring user agreement before proceeding

## When to avoid

- Non-essential information doesn't need immediate attention
- Content or interaction fits inline on the page
- Same information needs frequent access
- Large content requires significant scrolling - dedicated pages work better for UX and accessibility
- Users must interact with the main page while modal is open

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction Pattern
The following table outlines the standard keyboard interactions for modal components. These interactions ensure that users can navigate and operate modals effectively using only a keyboard.
| Key         | Action                                                                                               |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| Escape      | Closes the modal                                                                                     |
| Tab         | Moves focus to the next focusable element within the modal. Focus should be trapped within the modal |
| Shift + Tab | Moves focus to the previous focusable element within the modal                                       |
| Enter/Space | Activates the focused button or control                                                              |
> **Note**: When the modal opens, focus should automatically move to the first focusable element within the modal (usually the close button or the first form field). When the modal closes, focus should return to the element that triggered the modal.

## Common mistakes

### Forcing Users Into a Modal (No Close Option)
**The Problem:**
Users feel trapped if they can't exit a modal.

**How to Fix It?**
Always provide a clear **close button (X)** and support the `Esc` key for dismissal.

### Triggering Modals on Page Load
**The Problem:**
Unrequested modals on page load can feel like pop-ups that disrupt user flow.

**How to Fix It?**
Only show modals when the user **intentionally** initiates them.

### Disrupting Background Page Focus
**The Problem:**
Some modals allow interaction with background content while open, causing layered focus.

**How to Fix It?**
Add a **focus trap** inside the modal and prevent background interaction until it's closed.

## Related patterns

- https://uxpatterns.dev/patterns/content-management/accordion
- https://uxpatterns.dev/patterns/content-management/popover
- https://uxpatterns.dev/patterns/content-management/tooltip
- https://uxpatterns.dev/patterns/user-feedback/loading-indicator

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/content-management/modal
