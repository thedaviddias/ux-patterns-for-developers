---
name: currency-input
description: "Use when implementing enter and format monetary values."
metadata:
  id: currency-input
  category: forms
  pattern: Currency Input
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/currency-input
  sourcePath: apps/web/content/patterns/forms/currency-input.mdx
---

# Currency Input

Enter and format monetary values

## What it solves

A **Currency Input** is a specialized numeric form field for entering monetary values. It combines the raw numeric input behavior of a number field with locale-aware formatting, currency symbol display, and financial validation constraints.
Unlike a generic number input, a currency input formats the value as the user types (e.g., displaying `$1,299.99` instead of `1299.99`), handles decimal precision based on the currency (USD uses 2 decimal places, JPY uses 0), and positions the currency symbol or code according to locale conventions.

## When to use

- **E-commerce checkout** – Cart totals, discount codes, coupon amounts.
- **Banking and finance forms** – Transfer amounts, deposit values, loan applications.
- **Expense reporting** – Reimbursement amounts with currency context.
- **Subscription and pricing configuration** – Plan pricing in admin interfaces.
- **Budget and forecasting tools** – Financial planning inputs.

## When to avoid

- **Displaying prices (read-only)** – Use formatted text, not an input.
- **Quantities without monetary meaning** – Use a number input instead.
- **Very large or very small scientific values** – Use a standard number input with appropriate notation.
- **When the currency is irrelevant** – A plain number input is simpler.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction Pattern
| **Key**              | **Action**                                              |
| -------------------- | ------------------------------------------------------- |
| `Tab`                | Moves focus to the currency input                       |
| `Shift + Tab`        | Moves focus to the previous element                     |
| `0–9`                | Enters numeric digits                                   |
| `.` or `,`           | Enters decimal separator (locale-dependent)             |
| `Backspace`          | Removes the last character                              |
| `Delete`             | Removes the character after the cursor                  |
| `Arrow Left/Right`   | Moves cursor within the input                           |

## Performance guardrails

- **Initial render**: < 80ms for currency input appearance
- **Format-on-blur**: < 16ms for value formatting
- **Currency selector change**: < 50ms to update symbol and placeholder
- **Validation feedback**: < 150ms after blur
- **Memory usage**: < 5KB per currency input instance

## Common mistakes

### Using `type="number"` for Currency

**The Problem:**
`<input type="number">` shows browser spinner arrows, rejects thousands separators (commas), and handles decimals inconsistently across browsers and locales.

```html
<!-- Bad -->
<input type="number" step="0.01" min="0" />
```

**How to Fix It?** Use `type="text"` with `inputmode="decimal"`.

```html
<!-- Good -->
<input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]{0,2}" />
```

### Formatting While User Is Typing

**The Problem:**
Reformatting the value on `input` events moves the cursor unexpectedly, especially when adding thousands separators mid-entry.

**How to Fix It?** Format only on `blur`; show raw decimal input during typing.

```javascript
input.addEventListener('blur', () => {
  const raw = parseFloat(input.value.replace(/[^0-9.-]/g, ''));
  if (!isNaN(raw)) {
    input.value = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(raw);
  }
});

input.addEventListener('focus', () => {
  // Strip formatting for editing
  input.value = input.value.replace(/[^0-9.]/g, '');
});
```

### Submitting Formatted Value to Server

**The Problem:**
Sending `"$1,299.99"` to a backend that expects `1299.99` (or `129999` as integer cents) causes parse errors or incorrect amounts.

**How to Fix It?** Use a hidden input for the raw value, or strip formatting before submission.

```html
<input type="text" id="amount-display" value="$1,299.99" />
<input type="hidden" id="amount-raw" name="amount" value="1299.99" />
```

```javascript
form.addEventListener('submit', () => {
  const raw = parseFloat(displayInput.value.replace(/[^0-9.]/g, ''));
  hiddenInput.value = raw.toFixed(2);
});
```

## Related patterns

- https://uxpatterns.dev/patterns/forms/text-field

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/currency-input
