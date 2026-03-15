---
name: code-confirmation
description: "Use when implementing verify codes with segmented input."
metadata:
  id: code-confirmation
  category: forms
  pattern: Code Confirmation
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/code-confirmation
  sourcePath: apps/web/content/patterns/forms/code-confirmation.mdx
---

# Code Confirmation

Verify codes with segmented input

## What it solves

A **Code Confirmation** (also called an OTP input or verification code input) is a specialized form component that allows users to enter short numeric or alphanumeric codes — typically 4–8 characters — sent via SMS, email, or authenticator app to verify identity.
The defining characteristic is the **segmented layout**: each character occupies its own individual input box, providing a clear visual structure that guides users digit-by-digit and reduces transcription errors.

## When to use

- **Two-factor authentication (2FA)** – SMS or TOTP codes used alongside password login.
- **Email verification** – Confirm account ownership after registration.
- **Password reset flows** – Short codes sent via SMS or email to authorize resets.
- **Transaction confirmation** – PIN or code required before sensitive financial actions.
- **Access codes** – Short invite or gift codes entered to unlock content.

## When to avoid

- **Long passwords or passphrases** – A standard password field is better; segmented inputs are meant for short, structured codes.
- **Free-form text entry** – Use a text field instead.
- **When the code length is unknown or variable** – Use a standard single-line input.
- **Codes longer than 8 digits** – Cognitive load increases significantly; consider a text field with masking.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction Pattern
| **Key**              | **Action**                                                         |
| -------------------- | ------------------------------------------------------------------ |
| `0–9` / `A–Z`        | Enters a digit or character and advances focus to the next input   |
| `Backspace`          | Clears current digit; if empty, moves focus to previous input      |
| `Delete`             | Clears current digit without moving focus                          |
| `Arrow Left`         | Moves focus to the previous digit input                            |
| `Arrow Right`        | Moves focus to the next digit input                                |
| `Tab`                | Moves focus to the next focusable element outside the group        |
| `Shift + Tab`        | Moves focus to the previous focusable element outside the group    |

## Performance guardrails

- **Initial render**: < 50ms for digit group appearance
- **Auto-advance response**: < 16ms (single frame) after digit entry
- **Paste distribution**: < 50ms to fill all digits from clipboard
- **Error state transition**: < 200ms including shake animation
- **Memory usage**: < 2KB per OTP component instance

## Common mistakes

### Using `type="number"` for Digit Inputs

**The Problem:**
`<input type="number">` accepts `e`, `+`, `-` and shows stepper arrows in some browsers. It also returns an empty string for `checkValidity` on certain non-numeric entries.

```html
<!-- Bad -->
<input type="number" min="0" max="9" class="otp-digit" />
```

**How to Fix It?** Use `type="text"` with `inputmode="numeric"` and `pattern="[0-9]"`.

```html
<!-- Good -->
<input type="text" inputmode="numeric" pattern="[0-9]" maxlength="1" class="otp-digit" />
```

### Blocking Paste Events

**The Problem:**
Disabling paste breaks SMS autofill and forces users to type digit-by-digit from a copied code, causing significant frustration.

```javascript
// Bad
input.addEventListener('paste', (e) => e.preventDefault());
```

**How to Fix It?** Handle paste to distribute characters across boxes.

```javascript
// Good: distribute pasted text across all digit inputs
container.addEventListener('paste', (e) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text').replace(/\D/g, '');
  const digits = inputs; // NodeList of digit inputs
  [...text].slice(0, digits.length).forEach((char, i) => {
    digits[i].value = char;
  });
  // Move focus to the last filled digit or the next empty one
  const lastFilled = Math.min(text.length, digits.length) - 1;
  digits[lastFilled]?.focus();
});
```

### No Backspace Navigation

**The Problem:**
Users who mistype a digit expect `Backspace` to clear it and return focus to the previous box. Without this, they're stranded on an empty box.

**How to Fix It?** Listen for `keydown` and navigate backward when the input is already empty.

```javascript
input.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace' && input.value === '') {
    const prev = getPreviousInput(input);
    if (prev) {
      prev.value = '';
      prev.focus();
    }
  }
});
```

## Related patterns

- https://uxpatterns.dev/patterns/forms/text-field

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/code-confirmation
