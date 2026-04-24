---
name: selection-input
description: "Learn how to implement user-friendly selection inputs in your web applications. Use when you need to choose from predefined options. Triggers: dropdown, select."
user-invocable: true
triggers:
  - selection
  - input
  - dropdown
  - select
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

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **selection input** is a form control that allows users to choose one option from a predefined list of options.
The selected option is typically displayed in a single-line text field, with the list of options hidden until the user interacts with the control.

## Quick-start example

```html
<label for="fruits">Choose a fruit:</label>
<select id="fruits" name="fruits">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
  <option value="strawberry">Strawberry</option>
</select>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- When users need to select a single option from a list of predefined choices
- When the list of options is relatively short (less than 10-15 items)
- When screen space is limited, and displaying all options at once is not feasible
- When the selected option doesn't need to be visible at all times

**Avoid when:**

- When users need to select multiple options (use checkboxes or a [multi-select](/patterns/forms/multi-select-input) instead)
- When the list of options is very long (consider using an [autocomplete](/patterns/forms/autocomplete) or a typeahead)
- When users need to input free-form text (use a regular text input instead)
- When the options are complex or require additional information or visual aids

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

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
