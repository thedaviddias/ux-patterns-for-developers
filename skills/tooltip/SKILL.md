---
name: tooltip
description: "Implement effective tooltip components in your web applications. Use when you need to provide additional context on hover or focus. Triggers: hover hint, info bubble."
user-invocable: true
triggers:
  - tooltip
  - hover hint
  - info bubble
metadata:
  id: tooltip
  category: content-management
  pattern: Tooltip
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/content-management/tooltip
  sourcePath: apps/web/content/patterns/content-management/tooltip.mdx
---

# Tooltip

Provide additional context on hover or focus

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **tooltip** is a small popup that provides additional contextual information when a user hovers over, focuses on, or interacts with an element. It helps clarify elements with **icons, buttons, or text snippets** that may not be self-explanatory.
There are **two types of tooltips**:
- **Simple Tooltips** – Short text descriptions that appear on hover or focus, providing a brief explanation.
- **Rich Tooltips** – Enhanced tooltips that may contain **formatted text, icons, images, or interactive elements**.
Tooltips should be used to enhance understanding without overwhelming the user interface.

## Quick-start example

```html
<!-- Tooltip Trigger -->
<button aria-describedby="tooltip-example" class="tooltip-trigger">?</button>

<!-- Tooltip -->
<div id="tooltip-example" role="tooltip" class="tooltip-content">
  This is additional information about the element.
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

Use a tooltip when you need to provide **additional context or explanations** without taking up extra space in the UI.
**Common use cases include:**
**Simple Tooltips**
- **Clarifying icons or abbreviations** (e.g., a settings cog, currency symbols).
- **Providing additional information** about form fields or table headers.
- **Showing helper text** for complex actions (e.g., "This action is permanent").
- **Explaining disabled elements** when a user cannot interact with them.
- **Providing keyboard shortcuts** when hovering over action buttons.
**Rich Tooltips**
- **Providing in-depth explanations** beyond a brief description.

**Avoid when:**

- **For critical information** users must read, such as error messages.
- **For content that should remain visible**, like persistent hints or descriptions.
- **When users need to interact** with the tooltip itself.
- **If the tooltip is the only means** of conveying information (accessibility issue).
- **For mobile-first interactions** where hover-based behavior isn't intuitive.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction Pattern
The following table outlines the standard keyboard interactions for tooltip components. These interactions ensure that users can access and dismiss tooltips effectively using only a keyboard.
| Key         | Action                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------ |
| Tab         | Moves focus to the element that triggers the tooltip. The tooltip should appear on focus.        |
| Shift + Tab | Moves focus to the previous interactive element. The tooltip should close when focus moves away. |
| Escape      | Dismisses the tooltip manually (if dismissible).                                                 |
| Enter/Space | Activates the tooltip (for tooltips that require explicit activation).                           |
> **Note**: Tooltips should appear when an element **receives focus** (for keyboard users) and **disappear when focus moves away**. If a tooltip is **interactive** (contains links or buttons), it must be dismissible via the `Escape` key.

## Performance guardrails

### Performance Metrics
**Target Metrics:**
- **Show Delay**: 300-500ms to prevent accidental triggers
- **Animation Duration**: < 200ms for smooth perception
- **DOM Impact**: Single tooltip instance reused across triggers
- **Memory Usage**: < 1KB per tooltip instance
- **Event Listeners**: Use event delegation for multiple tooltips
**Optimization Strategies:**
- **Single Instance Pattern**: Reuse one tooltip element for all triggers
- **Event Delegation**: Attach listeners to parent container, not individual elements

## Common mistakes

### Tooltips That Disappear Too Fast
**The Problem:**
Users might not have enough time to read the tooltip before it disappears.

**How to Fix It?**
Ensure tooltips remain visible **for at least 3–5 seconds** or stay open on hover.

### Not Accessible via Keyboard
**The Problem:**
Many tooltips rely only on hover, making them inaccessible to keyboard users.

**How to Fix It?**
Ensure tooltips can be triggered **via focus (`Tab` key)**. For screen readers, pair `aria-describedby` on the trigger element with `role="tooltip"` on the tooltip container.

### Blocking Important Content
**The Problem:**
Tooltips that cover input fields or buttons create confusion and may block clicks or taps.

**How to Fix It?**
Position tooltips **away from interactive elements** and use arrow indicators to point from the trigger to the tooltip.

## Related patterns

- https://uxpatterns.dev/patterns/content-management/modal
- https://uxpatterns.dev/patterns/content-management/popover
- https://uxpatterns.dev/patterns/forms/selection-input

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/content-management/tooltip
