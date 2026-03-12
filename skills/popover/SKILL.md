---
name: Popover
description: "Use when you need to display focused content or actions."
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

## What it solves

**Popovers** overlay the main content to give users additional information or actions.
Popovers display contextual content while keeping the surrounding page visible.
Unlike modals blocking page interaction, popovers deliver contextual help or shortcuts while the main interface stays visible and interactive.

## When to use

Use popovers for context-specific information or quick actions that complement the main view without needing full user focus.
**Common scenarios include:**
- Contextual help needs additional details about data fields
- Quick actions or shortcuts like editing options or extra buttons
- Compact toolbars or menus with filters or settings appearing on demand
- Preview or supplementary info shows image or text previews on hover/focus

## When to avoid

- Critical information must stay persistently visible
- Large forms or complex interactions work better as modals
- Context needs full-page takeover for clarity

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

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
