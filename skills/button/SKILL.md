---
name: button
description: "Create accessible and user-friendly buttons with proper states, design patterns, and implementation guidelines. Use when you need to trigger actions and submit forms."
user-invocable: true
triggers:
  - button
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

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

**Buttons** are interactive elements that trigger actions or events when clicked or interacted with.

## Quick-start example

```html
<!-- Small Button -->
<button type="button" class="button-sm">Small</button>

<!-- Default Size Button -->
<button type="button">Default</button>

<!-- Large Button -->
<button type="button" class="button-lg">Large</button>

<!-- Icon-only Button -->
<button type="button" aria-label="Settings">
  <svg aria-hidden="true">
    <use href="#icon-settings" />
  </svg>
</button>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- To trigger an immediate action or event (e.g., "Save", "Delete", "Send")
- To submit a form
- To open or close interactive elements (modals, dialogs, menus)
- To toggle between states (e.g., play/pause, show/hide)
- To download files or content
- To navigate between steps in a multi-step process

**Avoid when:**

- For navigation between pages (use links instead)
- When the action isn't immediately clear to users
- For text-only content that doesn't trigger an action
- When the interaction would be better served by a different component (e.g., checkbox, toggle switch)
- When multiple conflicting actions are grouped together
- When the action requires additional context that isn't immediately available

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### ARIA Attributes
**Required [ARIA attributes](/glossary/aria-attributes):**
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
