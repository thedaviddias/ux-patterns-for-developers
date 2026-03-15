---
name: selection-input
description: "Use when you need to choose from predefined options."
metadata:
  id: selection-input
  category: forms
  pattern: Selection Input
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/selection-input
  sourcePath: apps/web/content/patterns/forms/selection-input.mdx
---

# Selection Input

Choose from predefined options

## What it solves

A **selection input** is a form control that allows users to choose one option from a predefined list of options.
The selected option is typically displayed in a single-line text field, with the list of options hidden until the user interacts with the control.

## When to use

- When users need to select a single option from a list of predefined choices
- When the list of options is relatively short (less than 10-15 items)
- When screen space is limited, and displaying all options at once is not feasible
- When the selected option doesn't need to be visible at all times

## When to avoid

- When users need to select multiple options (use checkboxes or a [multi-select](/patterns/forms/multi-select-input) instead)
- When the list of options is very long (consider using an [autocomplete](/patterns/forms/autocomplete) or a typeahead)
- When users need to input free-form text (use a regular text input instead)
- When the options are complex or require additional information or visual aids

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

- Use a visible label connected to the control via `for`/`id`.
- Prefer native `<select>` for simple cases to inherit built-in accessibility.
- Provide group labels for long lists (`<optgroup>`) and descriptive helper text when needed.
- Keep focus indicators highly visible and maintain sufficient text/background contrast.
- Announce validation and error states using `aria-invalid` and `aria-describedby`.

## Related patterns

- https://uxpatterns.dev/patterns/forms/autocomplete
- https://uxpatterns.dev/patterns/forms/multi-select-input

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/selection-input
