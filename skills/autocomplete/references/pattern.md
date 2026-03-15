# Autocomplete

> Build user-friendly autocomplete with search suggestions, keyboard navigation, and accessibility features.

**URL:** https://uxpatterns.dev/patterns/forms/autocomplete
**Source:** apps/web/content/patterns/forms/autocomplete.mdx

---

## Overview

**Autocomplete** helps users quickly find and select values from predefined options as they type.

Autocomplete combines [text input](/patterns/forms/text-field) flexibility with dropdown-style selection, providing real-time suggestions matching user input. This pattern reduces errors, speeds data entry, and improves form completion.

## Use Cases
### When to use:

- Users select from large sets of predefined options (country selection, airport codes)
- Users need faster option selection than scrolling through long dropdowns
- Reducing errors by guiding users to valid input options
- Input has finite, known valid responses
- Combining free text input with suggestion functionality

### When not to use:

- Fewer than 10 options exist (use standard dropdown/select instead)
- Users enter completely free-form text without restrictions
- All options need simultaneous visibility for comparison
- Network latency significantly delays suggestion results
- Input field requires exact, verbatim text entry (passwords)

### Common scenarios and examples

- **Product search** in e-commerce catalogs
- **City name entry** for travel or weather applications
- **User or contact lookup** in messaging or collaboration tools

## Benefits

- **Faster data entry** through real-time option narrowing
- **Less user frustration** with guided valid options
- **Fewer mistakes** and typos using confirmed suggestions from lists

## Drawbacks

- **Accessibility challenges** – Needs proper ARIA attributes (`aria-expanded`, `aria-controls`, `aria-activedescendant`) for screen readers
- **Keyboard navigation complexity** – Users navigate suggestions with arrow keys and select with Enter
- **Performance issues** – Dynamic suggestion fetching introduces lag without debouncing and caching
- **User overwhelm** – Too many suggestions or unclear results create cognitive overload
- **Implementation effort** – Must handle filtering logic and suggestion visibility management

## Anatomy

### Component Structure

```mermaid
graph TD
    A[Autocomplete] --> B[Container]
    B --> C[Input Field]
    B --> D[Suggestions List]
    B --> E[Clear Button]

    C --> F[Label]
    C --> G[Text Input]
    C --> H[Loading Indicator]

    D --> I[Suggestion Items]
    I --> J[Item 1]
    I --> K[Item 2]
    I --> L[Item n...]

    J --> M[Text Match]
    J --> N[Additional Info]

    E --> O[Clear Icon]
```

1. **Container**

- Wraps entire autocomplete area including input and dropdown
- Handles positioning, sizing, and floating layers for suggestions

2. **Input**

- Text field for user queries
- Gives real-time updates and triggers suggestion fetching

3. **Label**

- Optional label describing input purpose
- Clarifies for screen readers and provides visible context

4. **Clear Button**

- Quick input field clearing
- Usually shows as "X" or "✕" icon

## Best Practices

### Content

![Do and Don't for Content - 1](/patterns/autocomplete/do-dont-content-1.webp)

**Do's ✅**

- Provide a descriptive label that indicates the purpose of the Autocomplete field
- Use placeholder text to show example input (e.g., "Start typing a country...")

**Don'ts ❌**

- Don't rely on placeholder text as a replacement for a label
- Don't make your suggestions so vague that it's unclear what the user is selecting

### Accessibility

![Do and Don't for Accessibility - 1](/patterns/autocomplete/do-dont-accessibility-1.webp)

**Do's ✅**

- Use `aria-controls`, `aria-autocomplete`, and other relevant ARIA attributes to help screen readers
- Include a visually hidden label or descriptive text if you rely on an icon-only clear button
- Add a debounce delay to the input field to avoid triggering a fetch request too often

**Don'ts ❌**

- Don't remove focus outlines without providing alternative focus indicators
- Don't assume all users can use a mouse; ensure keyboard navigation works properly

### Visual Design

![Do and Don't for Visual Design - 2](/patterns/autocomplete/do-dont-visual-design-2.webp)

**Do's ✅**

- Keep the suggestion list clearly delineated, with sufficient contrast and spacing
- Highlight hovered or focused suggestion items with a distinct visual state

**Don'ts ❌**

- Don't display an overly large list of suggestions (limit it to a reasonable number), use a scroll bar to allow users to scroll through the list.
- Don't create a cluttered or confusing interface by mixing too many design elements

### Layout & Positioning

**Do's ✅**

- Position the dropdown list immediately below the input field
- Ensure suggestions list appears in front of other page elements when open

**Don'ts ❌**

- Don't hide the list behind overlays or modals
- Don't move the dropdown to a completely different area away from the input

## Code Examples

### Basic Implementation

```html
<!-- Basic Autocomplete Markup -->
<div>
  <label for="autocompleteInput">Search for an option</label>
  <input
    type="text"
    id="autocompleteInput"
    name="autocompleteInput"
    aria-autocomplete="list"
    aria-controls="suggestions-list"
    autocomplete="off"
    placeholder="Type to search..."
  />
  <button type="button" aria-label="Clear input">✕</button>
  <ul id="suggestions-list" role="listbox">
    <!-- Dynamically generated suggestions go here -->
  </ul>
</div>
```

## Design Tokens

These [design tokens](/glossary/design-tokens) follow the [Design Tokens Format](https://design-tokens.github.io/community-group/format/) specification and can be used with various token transformation tools to generate platform-specific variables.

### Autocomplete Tokens in DTF Format

```json
{
  "$schema": "https://design-tokens.org/schema.json",
  "Autocomplete": {
    "container": {
      "borderRadius": {
        "value": "0.25rem",
        "type": "dimension"
      },
      "background": {
        "value": "{color.white}",
        "type": "color"
      }
    },
    "input": {
      "fontSize": {
        "value": "1rem",
        "type": "dimension"
      },
      "padding": {
        "value": "0.5rem",
        "type": "dimension"
      }
    },
    "suggestionsList": {
      "maxHeight": {
        "value": "200px",
        "type": "dimension"
      },
      "background": {
        "value": "{color.gray.50}",
        "type": "color"
      },
      "itemHoverBg": {
        "value": "{color.gray.100}",
        "type": "color"
      }
    }
  }
}
```

## Accessibility

- Ensure the input is labeled and announced as a combobox (`role="combobox"`, `aria-expanded`, `aria-controls`).
- Support full keyboard interaction: `ArrowUp/ArrowDown`, `Enter`, `Escape`, and `Tab`.
- Expose active option context with `aria-activedescendant` and stable option IDs.
- Announce loading, empty, and error states to screen readers.
- Keep suggestions readable with strong contrast and visible focus styles.

## Testing Guidelines

### Functional Testing

**Should ✓**

- [ ] Verify suggestions open/close correctly when typing, focusing, and blurring.
- [ ] Confirm filtering and ranking return relevant options for partial matches.
- [ ] Ensure selecting an option updates the field value and form state.
- [ ] Validate debounce logic avoids redundant API requests during rapid typing.

### Accessibility Testing

**Should ✓**

- [ ] Confirm screen readers announce combobox state and highlighted option.
- [ ] Verify keyboard-only users can navigate, select, and dismiss suggestions.
- [ ] Ensure focus is never trapped in the suggestion list.
- [ ] Check empty/no-result states are communicated clearly.

### Performance Testing

**Should ✓**

- [ ] Measure response time for first suggestions under realistic network latency.
- [ ] Confirm large datasets remain responsive with virtualization or capped results.
- [ ] Validate request cancellation and caching behavior on rapid input changes.
- [ ] Ensure no layout shift occurs when the suggestion panel appears.

## Frequently Asked Questions

## Related Patterns

## Documentation

- [WAI-ARIA: Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Resources

### References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - Accessibility baseline for keyboard support, focus management, and readable state changes.
- [MDN search input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search) - Native search-field behaviors, semantics, and browser-specific affordances.

### Guides

- [WAI Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/) - Accessible labels, instructions, validation, and grouping for forms and input controls.

### Articles

- [Baymard: Autocomplete design](https://baymard.com/blog/autocomplete-design) - Patterns for query suggestions, highlighted matches, and keyboard interaction.

### NPM Packages

- [`react-select`](https://www.npmjs.com/package/react-select) - Flexible combobox and async selection building blocks.
- [`downshift`](https://www.npmjs.com/package/downshift) - Headless combobox, autocomplete, and selection primitives.
- [`@tanstack/react-query`](https://www.npmjs.com/package/%40tanstack%2Freact-query) - Server-state management for async data, optimistic UI, and background refresh.
