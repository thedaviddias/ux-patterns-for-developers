---
name: expandable-text
description: "Use when implementing show or hide additional text content on demand."
metadata:
  id: expandable-text
  category: content-management
  pattern: Expandable Text
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/content-management/expandable-text
  sourcePath: apps/web/content/patterns/content-management/expandable-text.mdx
---

# Expandable Text

Show or hide additional text content on demand

## What it solves

**Expandable Text** is a content management pattern that allows users to expand and collapse sections of text. This pattern improves readability by initially hiding non-essential content while keeping it accessible on demand.
Expandable Text is commonly used to manage lengthy descriptions, article summaries, or additional details that are helpful but not immediately necessary. It helps users scan content efficiently while maintaining a clean and minimal interface.

## When to use

Use **Expandable Text** when you need to **manage lengthy content while keeping essential information visible**.
**Common scenarios include:**
- **Summarizing content** – Showing a short preview of a longer article, product description, or FAQ answer.
- **Reducing page clutter** – Keeping the interface clean by hiding secondary details.
- **Improving mobile usability** – Managing screen space efficiently on smaller devices.
- **Progressive disclosure** – Revealing additional information only when needed.
- **Enhancing readability** – Preventing information overload while keeping details accessible.

## When to avoid

- **For critical information** – Users should not need to expand content to access essential details, such as pricing, terms, or important warnings.
- **For frequently accessed content** – If most users expand the content, it may be better to display it by default.
- **When full content is needed upfront** – Avoid hiding information that helps users make informed decisions quickly.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### ARIA Attributes
**Required [ARIA attributes](/glossary/aria-attributes):**
- `aria-expanded="false"` on the button (updated dynamically).
- `aria-controls="id-of-content"` to link the button to the expandable content.
- `hidden` attribute on the expandable content when collapsed.
### Screen Reader Support
- Ensure that the expanded content is properly announced by screen readers.
- Use `aria-live="polite"` if the content update needs to be announced.

## Related patterns

- https://uxpatterns.dev/patterns/content-management/accordion
- https://uxpatterns.dev/patterns/content-management/modal
- https://uxpatterns.dev/patterns/content-management/tooltip

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/content-management/expandable-text
