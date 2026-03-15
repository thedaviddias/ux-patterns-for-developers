# Search Field

> Learn how to implement effective search fields in your web applications. Discover best practices for search input design, real-time suggestions, and accessibility.

**URL:** https://uxpatterns.dev/patterns/forms/search-field
**Source:** apps/web/content/patterns/forms/search-field.mdx

---

## Overview

A **Search Field** pattern helps teams create a reliable way to help users retrieve content or commands quickly with a clear input, sensible defaults, and immediate recovery paths. It is most useful when teams need site-wide content search.

Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Use Cases

### When to use:

- Site-wide content search
- Scoped table and list filtering
- Quick command or object lookup

### When not to use:

- Use a simpler native control when the value is binary, tiny, or fully constrained.
- Avoid custom behavior when a native browser input already solves the main job well.
- Do not add extra formatting or validation if the product does not benefit from it.

### Common scenarios and examples

- Site-wide content search where users need a clear, repeatable interface model.
- Scoped table and list filtering where users need a clear, repeatable interface model.
- Quick command or object lookup where users need a clear, repeatable interface model.

## Benefits

- Clarifies how search field should behave before implementation details begin to sprawl.
- Creates a reusable interaction model for teams who need to help users retrieve content or commands quickly with a clear input, sensible defaults, and immediate recovery paths.
- Makes accessibility, edge cases, and recovery paths part of the design instead of post-launch cleanup.
- Gives product, design, and engineering a shared language for evaluating trade-offs.

## Drawbacks

- It introduces more states to design and test than a plain text field.
- Validation timing can feel noisy when the pattern reacts too early.
- Mobile input modes and autofill behavior often need explicit tuning.
- If labels, hints, and errors drift apart, completion rates drop quickly.

## Anatomy

```mermaid
flowchart TB
Root[Search Field] --> A[Search input]
Root --> B[Label or hint]
Root --> C[Submit or clear control]
Root --> D[Optional suggestion area]
Root --> E[Search status]
```

### Component Structure

1. **Search input**

- Captures the query and uses the correct input type and affordances.

2. **Label or hint**

- Explains scope, examples, or shortcut behavior.

3. **Submit or clear control**

- Supports explicit search and easy reset.

4. **Optional suggestion area**

- Shows recent, popular, or autocomplete results.

5. **Search status**

- Explains loading, empty, or filtered result states.

#### Summary of Components

| Component | Required? | Purpose |
| --- | --- | --- |
| Search input | ✅ Yes | Captures the query and uses the correct input type and affordances. |
| Label or hint | ✅ Yes | Explains scope, examples, or shortcut behavior. |
| Submit or clear control | ✅ Yes | Supports explicit search and easy reset. |
| Optional suggestion area | ❌ No | Shows recent, popular, or autocomplete results. |
| Search status | ❌ No | Explains loading, empty, or filtered result states. |

## Variations

### Global site search

Searches across several content types or areas.

**When to use:** Use when navigation alone is not enough.

### Scoped search

Searches only within the current collection or dataset.

**When to use:** Use when the surface already has a clear context.

### Command-style search

Optimizes for keyboard access and exact actions.

**When to use:** Use when the field also doubles as a launcher or navigator.

## Examples

### Live Preview

### Basic Implementation

```html
<div class="demo-shell card search-demo">
  <label for="search-demo-input">Search patterns</label>
  <div class="search-row">
    <input id="search-demo-input" type="search" placeholder="Search forms, navigation, media..." />
    <button type="button" id="search-clear">Clear</button>
  </div>
  <ul id="search-list">
    <li>Autocomplete</li>
    <li>Pagination</li>
    <li>Empty States</li>
    <li>Image Upload</li>
  </ul>
</div>
```

### What this example demonstrates

- A clear baseline implementation of search field that can be reviewed without framework-specific noise.
- Visible state, spacing, and content hierarchy that mirror the implementation guidance above.
- A small enough surface to copy into a design review or prototype before scaling the pattern up.

### Implementation Notes

- Start with [semantic HTML](/glossary/semantic-html) and only add JavaScript where the interaction truly requires it.
- Keep styling tokens and spacing consistent with adjacent controls or layouts.
- If the live implementation introduces async behavior, mirror those states in the code example rather than documenting them only in prose.
## Best Practices

### Content

**Do's ✅**

- Lead with a clear label that tells users exactly what belongs in the field.
- Keep helper text short and move edge-case guidance into secondary copy.
- Use examples only when they remove real ambiguity for the person typing.

**Don'ts ❌**

- Do not rely on placeholder text as the only instruction.
- Do not stack multiple competing messages above and below the control.
- Do not hide required constraints until after submission if they are easy to explain upfront.

### Accessibility

**Do's ✅**

- Verify that search field can be completed using keyboard alone.
- Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- Preserve a visible focus state that is still readable at high zoom.
- Use semantic elements first, then add ARIA only where semantics alone are not enough.
- Announce state changes such as errors, loading, or completion in the right place and with the right politeness.

**Don'ts ❌**

- Do not remove focus styles without a visible replacement.
- Do not depend on placeholder or helper text that disappears before the user can act on it.
- Do not assume pointer, touch, and assistive technologies will all interact with the pattern the same way.

### Visual Design

**Do's ✅**

- Keep spacing consistent between label, control, helper text, and validation.
- Reserve space for error states so the layout does not jump.
- Use state colors as reinforcement, not as the only cue.

**Don'ts ❌**

- Do not use tiny hit targets for touch devices.
- Do not depend on subtle borders that disappear in low-contrast environments.
- Do not overload the field chrome with too many icons or badges.

### Layout & Positioning

**Do's ✅**

- Align the control with the rest of the form so users can scan vertically.
- Support narrow mobile widths before adding side-by-side layouts.
- Keep primary actions close enough that users understand which field set they submit.

**Don'ts ❌**

- Do not move validation messages far from the field that caused them.
- Do not switch label position between breakpoints without a strong reason.
- Do not collapse key guidance into tooltips that are hard to revisit.

## Common Mistakes & Anti-Patterns 🚫

### **Using the wrong validation moment**

**The Problem:**
Immediate validation on partial input makes the pattern feel punitive and noisy.

**How to Fix It?**
Wait until the user has enough information in the field, then validate on blur, pause, or submit depending on the risk of the rule.

---

### **Separating labels, hints, and errors**

**The Problem:**
People cannot tell which message belongs to which control when the copy is visually detached.

**How to Fix It?**
Keep labels, helper text, and validation messages tightly grouped and connected with `aria-describedby` where appropriate.

---

### **Forgetting touch and autofill behavior**

**The Problem:**
Desktop-only styling hides the fact that mobile keyboards, autofill, and paste flows behave differently.

**How to Fix It?**
Test the control with autofill, paste, zoom, and on-screen keyboards before calling the pattern complete.

## Accessibility

### Keyboard Interaction

- [ ] Verify that search field can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.

### Screen Reader Support

- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.

### Visual Accessibility

- [ ] Do not rely on color alone to convey severity, completion, or selection state.
- [ ] Test the pattern at 200% zoom and with reduced motion enabled.
- [ ] Ensure [touch targets](/glossary/touch-targets) remain comfortable on mobile and coarse pointers.
## Validation Rules

### What to validate

- Validate the value against the rules users can act on inside search field.
- Check required, format, and boundary constraints separately so messages stay specific.
- Run server-side validation again for any rule that affects security, billing, or data integrity.

### When to validate

- Prefer quiet validation while the user is still composing, then stronger validation on blur or submit.
- Avoid showing an error before the user has entered enough characters to satisfy the rule fairly.
- Keep successful states subtle so the field does not become visually noisy.

## Error Handling

- Preserve the entered value after an error so people can correct rather than retype.
- Explain the next step in the error copy instead of only naming the rule that failed.
- If a server-side rule fails after submit, return focus to the first affected control and summarize the issue near the action area.

## Testing Guidelines

### Functional Testing

- [ ] Verify the default, loading, error, and success states for search field.
- [ ] Test the primary action and the obvious recovery action in the same run.
- [ ] Confirm that state survives refresh, navigation, or retry in the way users would expect.

### Accessibility Testing

- [ ] Run keyboard-only checks and at least one [screen reader](/glossary/screen-reader) pass on the final implementation.
- [ ] Validate headings, labels, and announcement behavior with real content rather than lorem ipsum.
- [ ] Check color contrast and focus visibility in both default and stressed states.
### Edge Cases

- [ ] Test empty, long, duplicated, and unexpectedly formatted content.
- [ ] Check behavior on narrow screens, zoomed layouts, and slower networks.
- [ ] Verify that optimistic or asynchronous states reconcile correctly after a failure.

## Design Tokens

These [design tokens](/glossary/design-tokens) provide a starting point for implementing search field in a systemized UI layer.

```json
{
  "$schema": "https://design-tokens.org/schema.json",
  "searchField": {
    "container": {
      "gap": {
        "value": "0.75rem",
        "type": "dimension"
      }
    },
    "label": {
      "color": {
        "value": "{color.gray.900}",
        "type": "color"
      },
      "fontWeight": {
        "value": "600",
        "type": "number"
      }
    },
    "control": {
      "borderRadius": {
        "value": "0.75rem",
        "type": "dimension"
      },
      "borderColor": {
        "value": "{color.gray.300}",
        "type": "color"
      },
      "paddingInline": {
        "value": "0.875rem",
        "type": "dimension"
      },
      "paddingBlock": {
        "value": "0.75rem",
        "type": "dimension"
      }
    },
    "helperText": {
      "color": {
        "value": "{color.gray.600}",
        "type": "color"
      },
      "fontSize": {
        "value": "0.875rem",
        "type": "dimension"
      }
    },
    "validation": {
      "successColor": {
        "value": "{color.green.700}",
        "type": "color"
      },
      "errorColor": {
        "value": "{color.red.700}",
        "type": "color"
      },
      "warningColor": {
        "value": "{color.amber.700}",
        "type": "color"
      }
    }
  }
}
```

## Frequently Asked Questions

## Related Patterns

## Resources

### References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - Accessibility baseline for keyboard support, focus management, and readable state changes.
- [MDN search input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search) - Native search-field behaviors, semantics, and browser-specific affordances.

### Guides

- [WAI Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/) - Accessible labels, instructions, validation, and grouping for forms and input controls.

### Articles

- [Baymard: Autocomplete design](https://baymard.com/blog/autocomplete-design) - Patterns for query suggestions, highlighted matches, and keyboard interaction.

### NPM Packages

- [`react-hook-form`](https://www.npmjs.com/package/react-hook-form) - Low-friction form state and validation wiring for complex input flows.
- [`@tanstack/react-query`](https://www.npmjs.com/package/%40tanstack%2Freact-query) - Server-state management for async data, optimistic UI, and background refresh.
- [`react-textarea-autosize`](https://www.npmjs.com/package/react-textarea-autosize) - Autosizing textarea component for prompt, note, and feedback inputs.
