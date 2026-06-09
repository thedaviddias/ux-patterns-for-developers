---
name: text-field
description: "Implement accessible text input fields with validation, error handling, and user experience best practices. Use when you need to enter and edit text content."
user-invocable: true
triggers:
  - text
  - field
metadata:
  id: text-field
  category: forms
  pattern: Text Field
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/text-field
  sourcePath: apps/web/content/patterns/forms/text-field.mdx
---

# Text Field

Enter and edit text content

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Text Field** is a fundamental form input component that allows users to enter and edit text-based data. It is commonly used in **forms, search fields, authentication fields, and messaging interfaces**.
Text fields can accept single-line or multi-line input and may include additional features like placeholders, character counters, validation messages, and formatting assistance.

## Quick-start example

```html
<div class="text-field">
  <label for="username">Username</label>
  <input type="text" id="username" name="username" required>
  <span class="text-field__error">Please enter a username</span>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

Use a text field when you need users to input freeform text, such as:
- **Login and authentication fields** – Username, password, email.
- **Search fields** – Query inputs in search bars.
- **Forms and surveys** – Collecting names, addresses, or custom responses.
- **Messaging interfaces** – Chat applications and comment sections.
- **Data entry fields** – User-generated content like tags, descriptions, or reviews.

**Avoid when:**

- **For pre-defined options** – Use [dropdowns](/patterns/forms/selection-input), [radio](/patterns/forms/radio), or [checkboxes](/patterns/forms/checkbox) instead.
- **For structured data inputs** – Use specialized inputs like [date pickers](/patterns/forms/date-picker) or [currency fields](/patterns/forms/currency-input).
- **For short selections** – Use [auto-complete](/patterns/forms/autocomplete) inputs instead of requiring full text input.
- **When voice input or selections are better** – Consider alternatives for accessibility.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction Pattern
Text fields should support **standard keyboard navigation and interactions** to ensure accessibility and usability.
| **Key**                   | **Action**                                                        |
| ------------------------- | ----------------------------------------------------------------- |
| `Tab`                     | Moves focus to the next interactive element.                      |
| `Shift + Tab`             | Moves focus to the previous interactive element.                  |
| `Enter` _(inside a form)_ | Submits the form (unless prevented).                              |
| `Arrow Left / Right`      | Moves the text cursor within the input.                           |
| `Arrow Up / Down`         | Moves the cursor within multi-line text fields (`textarea`).      |
| `Esc`                     | If inside a **search field**, clears input _(optional behavior)._ |

## Performance guardrails

Target performance metrics for text field components:
- **Initial render**: < 100ms for text field appearance
- **Focus response**: < 50ms from click to focus state
- **Validation feedback**: < 150ms after input validation
- **Character counter updates**: < 50ms for smooth counting
- **Memory usage**: < 5KB per text field instance

## Common mistakes

### Using Placeholder as Primary Label
**The Problem:**
Relying on placeholder text as the only label makes the field inaccessible when users start typing, and screen readers may not announce it properly.

```html
<!-- Bad: Placeholder as label -->
<input type="text" placeholder="First Name">
```

**How to Fix It?** Always provide a visible label and use placeholder for hints or examples only.

```html
<!-- Good: Label + helpful placeholder -->
<label for="firstName">First Name</label>
<input type="text" id="firstName" placeholder="e.g., John">
```

### Poor Validation Timing
**The Problem:**
Showing error messages too early (on first keystroke) or too late (only on form submission) frustrates users.

**How to Fix It?** Use **progressive validation**:
- Show errors after field loses focus (onBlur) for first-time entry
- Show real-time validation for corrections after initial error
- Validate required fields on blur, format validation on input

```javascript
// Good: Progressive validation
function validateField(input, hasBeenBlurred) {
  if (hasBeenBlurred && input.value.length > 0) {
    // Show real-time validation after first blur
    showValidationFeedback(input);
  }
}
```

### Missing Error Recovery
**The Problem:**
Not providing clear guidance on how to fix validation errors leaves users stuck.

**How to Fix It?** Include specific, actionable error messages with examples.

```html
<!-- Bad: Vague error -->
<output class="error">Invalid input</output>

<!-- Good: Specific guidance -->
<output class="error">
  Password must contain at least 8 characters, including 1 number and 1 special character.
  Example: MyPass123!
</output>
```

## Related patterns

- https://uxpatterns.dev/patterns/forms/autocomplete
- https://uxpatterns.dev/patterns/forms/checkbox
- https://uxpatterns.dev/patterns/forms/currency-input
- https://uxpatterns.dev/patterns/forms/date-picker
- https://uxpatterns.dev/patterns/forms/multi-select-input
- https://uxpatterns.dev/patterns/forms/radio
- https://uxpatterns.dev/patterns/forms/selection-input

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/text-field
