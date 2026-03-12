---
name: Button
description: "Use when you need to trigger actions and submit forms."
metadata:
  id: button
  category: forms
  pattern: Button
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/button
  sourcePath: apps/web/content/patterns/forms/button.mdx
---

# Button

Trigger actions and submit forms

## What it solves

**Buttons** are interactive elements that trigger actions or events when clicked or interacted with.

## When to use

- To trigger an immediate action or event (e.g., "Save", "Delete", "Send")
- To submit a form
- To open or close interactive elements (modals, dialogs, menus)
- To toggle between states (e.g., play/pause, show/hide)
- To download files or content
- To navigate between steps in a multi-step process

## When to avoid

- For navigation between pages (use links instead)
- When the action isn't immediately clear to users
- For text-only content that doesn't trigger an action
- When the interaction would be better served by a different component (e.g., checkbox, toggle switch)
- When multiple conflicting actions are grouped together
- When the action requires additional context that isn't immediately available

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### ARIA Attributes
**Required ARIA attributes:**
- Use `aria-label` for icon-only buttons
- Use `aria-pressed` for toggle buttons
- Use `aria-expanded` for buttons that control expandable content
- Use `aria-disabled="true"` instead of the `disabled` attribute
- Use `aria-describedby` to associate additional descriptive text
### Screen Reader Support
**Implementation example:**
```html
<!-- Icon-only button with proper ARIA -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true">
    <use href="#icon-close" />
  </svg>
</button>
<!-- Toggle button with ARIA pressed state -->
<button type="button" aria-pressed="false">
  <span>Dark mode</span>
</button>
<!-- Expandable content button -->
<button type="button" aria-expanded="false" aria-controls="content-1">
  <span>Show more</span>
</button>
```

## Related patterns

- https://uxpatterns.dev/patterns/forms/toggle
- https://uxpatterns.dev/patterns/navigation/link

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/button
