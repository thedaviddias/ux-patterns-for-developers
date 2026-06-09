---
name: popover
description: "Implement user-friendly popover components in your web applications. Use when you need to display focused content or actions."
user-invocable: true
triggers:
  - popover
metadata:
  id: popover
  category: content-management
  pattern: Popover
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/content-management/popover
  sourcePath: apps/web/content/patterns/content-management/popover.mdx
---

# Popover

Display focused content or actions

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

**Popovers** overlay the main content to give users additional information or actions.
Popovers display contextual content while keeping the surrounding page visible.
Unlike modals blocking page interaction, popovers deliver contextual help or shortcuts while the main interface stays visible and interactive.

## When to use and when to avoid

**Use when:**

Use popovers for context-specific information or quick actions that complement the main view without needing full user focus.
**Common scenarios include:**
- Contextual help needs additional details about data fields
- Quick actions or shortcuts like editing options or extra buttons
- Compact toolbars or menus with filters or settings appearing on demand
- Preview or supplementary info shows image or text previews on hover/focus

**Avoid when:**

- Critical information must stay persistently visible
- Large forms or complex interactions work better as modals
- Context needs full-page takeover for clarity

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### ARIA Attributes
**Required ARIA attributes:**
- `aria-haspopup="true"` on the trigger element.
- `aria-expanded` on the trigger element to reflect open/closed state.
- `role="dialog"` (or `role="menu"` if used as a menu) on the popover container.
- Ensure focus management so that keyboard users receive context.
### Keyboard Interaction Pattern
The following table outlines the standard keyboard interactions for popover components.
| Key | Action                                                    |
| --- | --------------------------------------------------------- |

## Related patterns

- https://uxpatterns.dev/patterns/content-management/modal
- https://uxpatterns.dev/patterns/content-management/tooltip
- https://uxpatterns.dev/patterns/forms/selection-input

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/content-management/popover
