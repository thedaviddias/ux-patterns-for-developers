# Textarea

> Learn how to implement accessible textarea components for collecting long-form content, comments, and detailed responses. Discover best practices for multi-line text input with proper validation and user experience.

**URL:** https://uxpatterns.dev/patterns/forms/textarea
**Source:** apps/web/content/patterns/forms/textarea.mdx

---

## Overview

A **Textarea** pattern helps teams create a reliable way to collect longer freeform text while keeping length, guidance, and validation manageable. It is most useful when teams need comments and support notes.

Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Use Cases

### When to use:

- Comments and support notes
- Descriptions and bios
- Issue reports and feedback

### When not to use:

- Use a simpler native control when the value is binary, tiny, or fully constrained.
- Avoid custom behavior when a native browser input already solves the main job well.
- Do not add extra formatting or validation if the product does not benefit from it.

### Common scenarios and examples

- Comments and support notes where users need a clear, repeatable interface model.
- Descriptions and bios where users need a clear, repeatable interface model.
- Issue reports and feedback where users need a clear, repeatable interface model.

## Benefits

- Clarifies how textarea should behave before implementation details begin to sprawl.
- Creates a reusable interaction model for teams who need to collect longer freeform text while keeping length, guidance, and validation manageable.
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
Root[Textarea] --> A[Textarea field]
Root --> B[Label]
Root --> C[Helper or prompt text]
Root --> D[Character or length state]
Root --> E[Validation message]
```

### Component Structure

1. **Textarea field**

- Captures multi-line input comfortably.

2. **Label**

- Explains what kind of response is expected.

3. **Helper or prompt text**

- Provides structure or examples for the response.

4. **Character or length state**

- Shows the budget remaining when limits matter.

5. **Validation message**

- Explains when content is too short, too long, or otherwise invalid.

#### Summary of Components

| Component | Required? | Purpose |
| --- | --- | --- |
| Textarea field | ✅ Yes | Captures multi-line input comfortably. |
| Label | ✅ Yes | Explains what kind of response is expected. |
| Helper or prompt text | ❌ No | Provides structure or examples for the response. |
| Character or length state | ❌ No | Shows the budget remaining when limits matter. |
| Validation message | ❌ No | Explains when content is too short, too long, or otherwise invalid. |

## Variations

### Open response textarea

Collects broad freeform content.

**When to use:** Use for comments, descriptions, and notes.

### Guided response textarea

Pairs the field with examples or structure prompts.

**When to use:** Use when higher-quality responses matter.

### Bounded textarea

Uses clear length constraints and counters.

**When to use:** Use when storage, moderation, or display limits apply.

## Examples

### Live Preview

### Basic Implementation

```html
<div class="demo-shell card textarea-card">
  <label for="textarea-input">Project summary</label>
  <textarea id="textarea-input" rows="6" maxlength="180" placeholder="Describe the work, blockers, and next step."></textarea>
  <p id="textarea-status" class="muted">0 / 180 characters</p>
</div>
```

### What this example demonstrates

- A clear baseline implementation of textarea that can be reviewed without framework-specific noise.
- Visible state, spacing, and content hierarchy that mirror the implementation guidance above.
- A small enough surface to copy into a design review or prototype before scaling the pattern up.

### Implementation Notes

- Start with semantic HTML and only add JavaScript where the interaction truly requires it.
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

- Verify that textarea can be completed using keyboard alone.
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

- [ ] Verify that textarea can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.

### Screen Reader Support

- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.

### Visual Accessibility

- [ ] Do not rely on color alone to convey severity, completion, or selection state.
- [ ] Test the pattern at 200% zoom and with reduced motion enabled.
- [ ] Ensure touch targets remain comfortable on mobile and coarse pointers.

## Validation Rules

### What to validate

- Validate the value against the rules users can act on inside textarea.
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

- [ ] Verify the default, loading, error, and success states for textarea.
- [ ] Test the primary action and the obvious recovery action in the same run.
- [ ] Confirm that state survives refresh, navigation, or retry in the way users would expect.

### Accessibility Testing

- [ ] Run keyboard-only checks and at least one screen reader pass on the final implementation.
- [ ] Validate headings, labels, and announcement behavior with real content rather than lorem ipsum.
- [ ] Check color contrast and focus visibility in both default and stressed states.

### Edge Cases

- [ ] Test empty, long, duplicated, and unexpectedly formatted content.
- [ ] Check behavior on narrow screens, zoomed layouts, and slower networks.
- [ ] Verify that optimistic or asynchronous states reconcile correctly after a failure.

## Design Tokens

These [design tokens](/glossary/design-tokens) provide a starting point for implementing textarea in a systemized UI layer.

```json
{
  "$schema": "https://design-tokens.org/schema.json",
  "textarea": {
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
- [MDN textarea element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea) - Semantics, sizing behavior, validation, and native textarea capabilities.

### Guides

- [WAI Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/) - Accessible labels, instructions, validation, and grouping for forms and input controls.

### Articles

- [Smashing Magazine: Designing efficient web forms](https://www.smashingmagazine.com/2017/06/designing-efficient-web-forms/) - Field-level usability guidance for labels, grouping, defaults, and submission flows.

### NPM Packages

- [`react-hook-form`](https://www.npmjs.com/package/react-hook-form) - Low-friction form state and validation wiring for complex input flows.
- [`@github/textarea-autosize`](https://www.npmjs.com/package/%40github%2Ftextarea-autosize) - Textarea autosizing utility used for note, prompt, and long-form inputs.
- [`react-textarea-autosize`](https://www.npmjs.com/package/react-textarea-autosize) - Autosizing textarea component for prompt, note, and feedback inputs.
