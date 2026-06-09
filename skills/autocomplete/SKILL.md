---
name: autocomplete
description: "Build user-friendly autocomplete with search suggestions, keyboard navigation, and accessibility features. Use when you need to suggest options as users type. Triggers: autosuggest."
user-invocable: true
triggers:
  - autocomplete
  - autosuggest
metadata:
  id: autocomplete
  category: forms
  pattern: Autocomplete
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/autocomplete
  sourcePath: apps/web/content/patterns/forms/autocomplete.mdx
---

# Autocomplete

Suggest options as users type

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

**Autocomplete** helps users quickly find and select values from predefined options as they type.
Autocomplete combines [text input](/patterns/forms/text-field) flexibility with dropdown-style selection, providing real-time suggestions matching user input. This pattern reduces errors, speeds data entry, and improves form completion.

## When to use and when to avoid

**Use when:**

- Users select from large sets of predefined options (country selection, airport codes)
- Users need faster option selection than scrolling through long dropdowns
- Reducing errors by guiding users to valid input options
- Input has finite, known valid responses
- Combining free text input with suggestion functionality

**Avoid when:**

- Fewer than 10 options exist (use standard dropdown/select instead)
- Users enter completely free-form text without restrictions
- All options need simultaneous visibility for comparison
- Network latency significantly delays suggestion results
- Input field requires exact, verbatim text entry (passwords)

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

- Ensure the input is labeled and announced as a combobox (`role="combobox"`, `aria-expanded`, `aria-controls`).
- Support full keyboard interaction: `ArrowUp/ArrowDown`, `Enter`, `Escape`, and `Tab`.
- Expose active option context with `aria-activedescendant` and stable option IDs.
- Announce loading, empty, and error states to screen readers.
- Keep suggestions readable with strong contrast and visible focus styles.

## Related patterns

- https://uxpatterns.dev/patterns/autocomplete/do-dont-accessibility-1
- https://uxpatterns.dev/patterns/autocomplete/do-dont-content-1
- https://uxpatterns.dev/patterns/autocomplete/do-dont-visual-design-2
- https://uxpatterns.dev/patterns/forms/date-picker
- https://uxpatterns.dev/patterns/forms/multi-select-input
- https://uxpatterns.dev/patterns/forms/text-field

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/autocomplete
