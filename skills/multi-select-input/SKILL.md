---
name: multi-select-input
description: "Implement multi-select components for multiple item selection in your web applications. Use when you need to choose multiple items from a list."
user-invocable: true
triggers:
  - multi
  - select
  - input
  - multi-select
metadata:
  id: multi-select-input
  category: forms
  pattern: Multi-select Input
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/multi-select-input
  sourcePath: apps/web/content/patterns/forms/multi-select-input.mdx
---

# Multi-select Input

Choose multiple items from a list

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Multi-select Input** is a form component that allows users to select multiple items from a predefined set of options. It differs from an autocomplete (which suggests options for freeform entry) by working with a **bounded, known list of options** — users can only select what exists in the list.
The most common visual implementation is a **tag/chip-based selector**: selected items appear as removable tags inside the input field, and remaining options are shown in a dropdown. Additional patterns include checkbox lists, dual listboxes, and native `<select multiple>`.

## When to use and when to avoid

**Use when:**

- **Category and tag assignment** – Assigning tags, labels, or categories to content.
- **Permissions and role management** – Selecting multiple roles for a user.
- **Filter panels** – Letting users apply multiple filters simultaneously.
- **Recipient selection** – Choosing multiple email recipients from a contact list.
- **Feature selection** – Configuring which features/modules to enable.

**Avoid when:**

- **Freeform text with suggestions** – Use [Autocomplete](/patterns/forms/autocomplete) instead.
- **Single selection from a small list** – Use a [Select/Dropdown](/patterns/forms/selection-input) or [Radio](/patterns/forms/radio) group.
- **Binary choices** – Use [Checkboxes](/patterns/forms/checkbox).
- **Very large option sets (> 1000 items)** – Use a virtualized list or search-first approach.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction Pattern
| **Key**              | **Action**                                                              |
| -------------------- | ----------------------------------------------------------------------- |
| `Tab`                | Moves focus to the multi-select input; `Shift+Tab` moves backward       |
| `Down Arrow`         | Opens the dropdown; moves focus down through options                    |
| `Up Arrow`           | Moves focus up through options                                          |
| `Enter`              | Selects / deselects the focused option                                  |
| `Space`              | Selects / deselects the focused option (same as Enter in listbox)       |
| `Escape`             | Closes the dropdown without changing selection                          |
| `Backspace`          | When search input is empty, removes the last selected tag               |

## Performance guardrails

- **Dropdown open time**: < 100ms
- **Option filtering (search)**: < 50ms for lists up to 1000 items
- **Tag addition rendering**: < 16ms (one frame)
- **Select All operation**: < 50ms for 100 items
- **Memory per instance**: < 15KB for component; virtualize options list for > 500 items

## Common mistakes

### Using `<select multiple>`

**The Problem:**
Native `<select multiple>` requires Ctrl+Click (or Cmd+Click) to select multiple items, which is an unintuitive interaction that most users are unaware of.

```html
<!-- Bad: Requires Ctrl+click — users don't know this -->
<select multiple name="skills[]">
  <option>React</option>
  <option>TypeScript</option>
</select>
```

**How to Fix It?** Use a custom multi-select component with checkboxes or a tag-based UI.

### Closing the Dropdown After Each Selection

**The Problem:**
If the dropdown closes every time the user selects an option, they must reopen it for each additional selection — significantly slowing down multi-item workflows.

**How to Fix It?** Keep the dropdown open after selection; close only on `Escape` or external click.

```javascript
option.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent close-on-outside-click from triggering
  toggleOptionSelection(option);
  updateTags();
  searchInput.focus(); // Keep focus in the input
  // DO NOT close the dropdown here
});
```

### Not Handling Backspace for Tag Removal

**The Problem:**
Users expect `Backspace` in an empty search input to remove the last selected tag. Omitting this makes the component feel incomplete and forces mouse usage.

**How to Fix It?** Listen for `keydown` on the search input.

```javascript
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace' && searchInput.value === '') {
    const lastTag = getLastSelectedItem();
    if (lastTag) {
      removeSelection(lastTag);
    }
  }
});
```

## Related patterns

- https://uxpatterns.dev/patterns/forms/autocomplete
- https://uxpatterns.dev/patterns/forms/checkbox
- https://uxpatterns.dev/patterns/forms/radio
- https://uxpatterns.dev/patterns/forms/selection-input

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/multi-select-input
