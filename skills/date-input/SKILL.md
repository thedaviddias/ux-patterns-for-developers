---
name: Date Input
description: "Use when implementing enter dates in a structured text format."
metadata:
  id: date-input
  category: forms
  pattern: Date Input
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/date-input
  sourcePath: apps/web/content/patterns/forms/date-input.mdx
---

# Date Input

Enter dates in a structured text format

## What it solves

A **Date Input** is a form field specifically designed for entering date values. It encompasses two primary implementation approaches: the native `<input type="date">` control (which renders the browser's built-in date picker), and structured text inputs using masked or segmented fields (e.g., MM/DD/YYYY format with auto-advance between day, month, and year segments).
Date Input is distinct from a **Date Picker** in that it focuses on direct keyboard entry of a date value rather than calendar-based visual selection. It is the preferred approach for entering known dates (birth dates, expiry dates) where a calendar view adds unnecessary complexity.

## When to use

- **Known, precise dates** – Birth dates, passport expiry dates, credit card expiry.
- **Historical dates** – Events or records well in the past where calendar navigation would be tedious.
- **Age or duration entry** – When users know the exact date without needing visual calendar context.
- **High-frequency data entry** – Forms where users enter many dates quickly benefit from direct text entry.
- **Date of birth** – Users always know this value; no calendar navigation needed.

## When to avoid

- **Scheduling and appointments** – Use a [Date Picker](/patterns/forms/date-picker) to show availability and context.
- **Relative date selection** – "Next Monday", "In 3 weeks" — use natural language or a date picker.
- **Date ranges** – Use a [Date Range](/patterns/forms/date-range) component instead.
- **When users need to see surrounding dates** – Calendar view is more helpful.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction Pattern
| **Key**              | **Action**                                                           |
| -------------------- | -------------------------------------------------------------------- |
| `Tab`                | Moves focus to the date input or next segment                        |
| `Shift + Tab`        | Moves focus to the previous input or segment                         |
| `0–9`                | Enters numeric digits in native input or current segment             |
| `Arrow Up / Down`    | Increments / decrements date value in native date input              |
| `Arrow Left / Right` | Moves between date parts in native input; navigates segments manually|
| `Backspace`          | Clears current segment value; moves to previous segment if empty     |
| `Delete`             | Clears current segment without moving focus                          |

## Performance guardrails

- **Initial render**: < 50ms for date input
- **Segment auto-advance**: < 16ms (single frame)
- **Date validation**: < 5ms for assembled date
- **Error display**: < 150ms after blur
- **Memory usage**: < 3KB per date input instance

## Common mistakes

### Undefined Date Format

**The Problem:**
Providing an input without indicating expected format causes user errors, especially in international contexts.

```html
<!-- Bad: No format hint -->
<label for="dob">Date of birth</label>
<input type="text" id="dob" placeholder="Enter date" />
```

**How to Fix It?** Always specify format in label or helper text.

```html
<!-- Good -->
<label for="dob">Date of birth (MM/DD/YYYY)</label>
<input type="text" id="dob" inputmode="numeric" placeholder="MM/DD/YYYY" aria-describedby="dob-help" />
<p id="dob-help">Example: 01/15/1990</p>
```

### Validating Segments Independently Without Cross-Validation

**The Problem:**
Checking only that day ≤ 31, month ≤ 12, and year is 4 digits misses invalid dates like February 30 or April 31.

**How to Fix It?** Always validate the assembled date as a whole.

```javascript
function validateDate(month, day, year) {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
  );
}
```

### Not Handling the Native Date Input Value Format

**The Problem:**
`<input type="date">` always stores values as `YYYY-MM-DD` regardless of display locale, but developers often try to parse the displayed format instead.

**How to Fix It?** Always read from `input.value` (ISO format) or `input.valueAsDate`.

```javascript
// Good: read ISO value, format for display separately
const dateInput = document.getElementById('my-date');
const isoValue = dateInput.value; // "2026-03-12"
const dateObject = dateInput.valueAsDate; // Date object
```

## Related patterns

- https://uxpatterns.dev/patterns/forms/date-picker
- https://uxpatterns.dev/patterns/forms/date-range
- https://uxpatterns.dev/patterns/forms/text-field

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/date-input
