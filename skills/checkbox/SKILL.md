---
name: checkbox
description: "Use when implementing enable single or multiple selections."
metadata:
  id: checkbox
  category: forms
  pattern: Checkbox
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/checkbox
  sourcePath: apps/web/content/patterns/forms/checkbox.mdx
---

# Checkbox

Enable single or multiple selections

## What it solves

A **checkbox** is a form control that allows users to select one or more options from a set of choices. Unlike radio buttons, checkboxes enable **multiple selections** and can be used independently or as part of a group.
Checkboxes are essential for forms, settings panels, and any interface where users need to make multiple selections or toggle individual options on and off.

## When to use

Use checkboxes when you need users to make **multiple selections** from a set of options.
**Common scenarios include:**
- **Form preferences** – Newsletter subscriptions, communication preferences, terms acceptance
- **Filter selections** – Product categories, price ranges, features in e-commerce
- **Settings toggles** – Privacy options, notification preferences, feature enablement
- **Multi-select lists** – Adding items to cart, selecting files for upload, choosing recipients
- **Agreement checkboxes** – Terms of service, privacy policy, age verification
- **Feature selection** – Choosing add-ons, selecting services, picking options

## When to avoid

- **For single selections** – Use [radio buttons](/patterns/forms/radio) instead
- **For binary on/off states** – Use [toggle switches](/patterns/forms/toggle) for settings
- **When space is limited** – Consider [dropdowns](/patterns/forms/selection-input) for many options
- **For immediate actions** – Use [buttons](/patterns/forms/button) for instant responses
- **When options are mutually exclusive** – Radio buttons are more appropriate

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### ARIA Attributes
**Required ARIA attributes:**
- `aria-describedby`: Link to additional help text
- `aria-required`: For required checkbox fields
- `aria-invalid`: When validation fails
- `aria-expanded`: For collapsible checkbox groups
### Keyboard Interaction Pattern
The following table outlines the standard keyboard interactions for checkbox components.
| Key           | Action                                                                |
| ------------- | --------------------------------------------------------------------- |

## Performance guardrails

### Performance Metrics
**Target Metrics:**
- **Render Time**: < 16ms for checkbox state changes
- **Bundle Size**: < 2KB for basic checkbox implementation
- **Memory Usage**: Minimal impact for standard checkbox groups
- **Accessibility**: 100% keyboard navigable, [screen reader](/glossary/screen-reader) compatible
**Optimization Strategies:**
- **Event Delegation**: Use single event listener for checkbox groups
- **Lazy Rendering**: Only render visible checkboxes in long lists
- **Debounced Updates**: Prevent excessive re-renders during rapid selection

## Common mistakes

### **Using Checkboxes for Single Selection**
**The Problem:**
Using checkboxes when only one option should be selectable confuses users about the interaction model.

**How to Fix It?**
Use radio buttons for mutually exclusive options, checkboxes only for multiple selections.

### **Poor Label Association**
**The Problem:**
Checkboxes without proper labels are inaccessible and confusing for users.

**How to Fix It?**
Always associate labels using `for` attribute or wrap the input in a label element.

### **Inconsistent Grouping**
**The Problem:**
Related checkboxes scattered without visual grouping makes the form hard to understand.

**How to Fix It?**
Group related options using fieldsets, containers, or visual spacing to show relationships.

## Related patterns

- https://uxpatterns.dev/patterns/forms/button
- https://uxpatterns.dev/patterns/forms/form-validation
- https://uxpatterns.dev/patterns/forms/multi-select-input
- https://uxpatterns.dev/patterns/forms/radio
- https://uxpatterns.dev/patterns/forms/selection-input
- https://uxpatterns.dev/patterns/forms/toggle
- https://uxpatterns.dev/patterns/navigation/pagination

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/checkbox
