---
name: radio
description: "Use when implementing select a single option from a group."
metadata:
  id: radio
  category: forms
  pattern: Radio Button
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/radio
  sourcePath: apps/web/content/patterns/forms/radio.mdx
---

# Radio Button

Select a single option from a group

## What it solves

Radio buttons are form controls that allow users to select **exactly one option** from a set of mutually exclusive choices. Unlike checkboxes, radio buttons work in groups where selecting one automatically deselects all others in the same group.
Radio buttons are essential for forms where users must make a single choice from multiple options, such as selecting a payment method, choosing a size, or picking a delivery option.
### Key Characteristics
- **Mutually Exclusive**: Only one option can be selected at a time
- **Grouped Behavior**: All radio buttons with the same `name` attribute work together
- **Keyboard Accessible**: Navigate with arrow keys, select with Space
- **[Screen Reader](/glossary/screen-reader) Friendly**: Properly announced with current selection state
- **Visual Feedback**: Clear indication of selected vs unselected states

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### **Keyboard Navigation**
- **Tab Key**: Move focus to the radio button group
- **Arrow Keys**: Navigate between options within the group
- **Space Key**: Select the focused option
- **Tab Again**: Move to the next form element
### **Screen Reader Support**
- **Semantic HTML**: Use proper fieldset and legend structure
- **ARIA Attributes**: Ensure proper labeling and state announcements
- **Group Context**: Screen readers announce the group context and current selection
- **State Changes**: Selection changes are announced immediately

## Performance guardrails

### Performance Metrics
**Target Metrics:**
- **Render Time**: < 16ms for radio button state changes
- **Bundle Size**: < 2KB for basic radio button implementation
- **Memory Usage**: Minimal impact for standard radio button groups
- **Accessibility**: 100% keyboard navigable, screen reader compatible
**Optimization Strategies:**
- **Event Delegation**: Use single event listener for radio button groups
- **Lazy Rendering**: Only render visible radio buttons in long lists
- **Debounced Updates**: Prevent excessive re-renders during rapid selection

## Common mistakes

### **Using Radio Buttons for Multiple Selection**
**The Problem:**
Using radio buttons when users need to select multiple options confuses the interaction model.

**How to Fix It?**
Use checkboxes for multiple selections, radio buttons only for single selection.

### **Missing Fieldset Structure**
**The Problem:**
Radio buttons without proper fieldset grouping are inaccessible and confusing.

**How to Fix It?**
Always wrap radio button groups in fieldsets with descriptive legends.

### **Inconsistent Grouping**
**The Problem:**
Radio buttons with different names scattered throughout a form creates confusion.

**How to Fix It?**
Use the same `name` attribute for all radio buttons in a logical group.

## Related patterns

- https://uxpatterns.dev/patterns/forms/checkbox
- https://uxpatterns.dev/patterns/forms/form-validation
- https://uxpatterns.dev/patterns/forms/selection-input
- https://uxpatterns.dev/patterns/forms/toggle

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/radio
