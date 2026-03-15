---
name: color-picker
description: "Use when implementing select colors with visual feedback."
metadata:
  id: color-picker
  category: forms
  pattern: Color Picker
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/color-picker
  sourcePath: apps/web/content/patterns/forms/color-picker.mdx
---

# Color Picker

Select colors with visual feedback

## What it solves

A **Color Picker** is a form input component that allows users to select a color value through visual interaction. It may be implemented as a native browser control (`<input type="color">`), a custom swatch palette, a hex/RGB/HSL text input, a gradient spectrum canvas, or an eyedropper tool — or any combination of these.
Color pickers are used wherever users need to choose or define colors: theme customization, design tools, annotation systems, data visualization category assignment, and product personalization.

## When to use

- **Theme and brand customization** – Let users choose accent colors for their dashboard or profile.
- **Design and creative tools** – Drawing apps, slide editors, diagramming tools.
- **Data visualization** – Assigning colors to categories in charts.
- **Product configuration** – Choosing product color variants before purchase.
- **Annotation and markup** – Highlight or pen color selection in document editors.

## When to avoid

- **When colors are fixed options** – Use a swatch selector or radio buttons with color swatches instead.
- **When the exact color value doesn't matter to the user** – A simpler categorical selector ("Red", "Blue", "Green") reduces cognitive load.
- **In mobile-primary, simple forms** – Native `<input type="color">` may be sufficient; avoid heavy custom UIs on small screens.
- **When accessibility is paramount** – Custom color pickers require significant a11y investment; evaluate whether simpler alternatives meet the need.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction Pattern
| **Key**              | **Action**                                                          |
| -------------------- | ------------------------------------------------------------------- |
| `Enter` / `Space`    | Opens or closes the color picker panel when on the trigger          |
| `Tab`                | Moves focus through picker controls in order                        |
| `Shift + Tab`        | Moves focus in reverse through picker controls                      |
| `Arrow Keys`         | Navigates through swatch grid (roving tabindex)                     |
| `Arrow Keys`         | Adjusts hue/saturation slider values by 1 step                     |
| `Home` / `End`       | Jumps to first/last swatch in a palette row                         |
| `Escape`             | Closes the picker panel and returns focus to the trigger            |

## Performance guardrails

- **Panel open time**: < 100ms from click to visible
- **Swatch render**: < 16ms for palette of up to 64 swatches
- **Hex parsing**: < 1ms per keystroke
- **Canvas redraw**: < 16ms per frame during drag on spectrum
- **Memory usage**: < 10KB for swatch palette; < 50KB for full canvas picker

## Common mistakes

### Relying Solely on Canvas for Color Selection

**The Problem:**
A canvas-only hue/saturation picker is completely inaccessible to keyboard and [screen reader](/glossary/screen-reader) users.
**How to Fix It?** Always pair canvas controls with equivalent `range` inputs or text inputs.

```html
<!-- Good: keyboard-accessible hue control alongside canvas -->
<input
  type="range"
  min="0"
  max="360"
  value="217"
  aria-label="Hue"
  class="color-picker__hue-slider"
/>
```

### Not Displaying the Selected Color Value

**The Problem:**
Showing only a colored swatch without a hex/name label forces users to remember what they chose and breaks copy-paste workflows.

**How to Fix It?** Always display the current value as text.

```html
<!-- Good -->
<button class="color-picker__trigger" style="background: #3b82f6" aria-label="Current color: #3b82f6">
</button>
<output class="color-picker__value" aria-live="polite">#3b82f6</output>
```

### Not Handling Partial Hex Input

**The Problem:**
Validating hex input on every keystroke while the user is typing causes premature error messages (e.g., error shown for `#3b8` which is just incomplete).

**How to Fix It?** Validate only on blur or when the input matches the expected length.

```javascript
hexInput.addEventListener('blur', () => {
  const isValid = /^#[0-9A-Fa-f]{6}$/.test(hexInput.value);
  hexInput.setAttribute('aria-invalid', String(!isValid));
});
```

## Related patterns

- https://uxpatterns.dev/patterns/forms/selection-input
- https://uxpatterns.dev/patterns/forms/text-field

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/color-picker
