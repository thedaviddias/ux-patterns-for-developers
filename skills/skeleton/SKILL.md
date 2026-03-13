---
name: Skeleton
description: "Use when implementing show users that content is being loaded."
metadata:
  id: skeleton
  category: user-feedback
  pattern: Skeleton
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/user-feedback/skeleton
  sourcePath: apps/web/content/patterns/user-feedback/skeleton.mdx
---

# Skeleton

Show users that content is being loaded

## What it solves

A **Skeleton** pattern helps teams create a reliable way to preserve the shape of the final interface during loading so the page feels stable and easier to scan. It is most useful when teams need content feeds and card grids.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## When to use

- Content feeds and card grids
- Dashboards with known layout
- Loading states where reducing layout shift matters

## When to avoid

- Use a quieter state when the event is too minor to interrupt the task.
- Avoid transient feedback for events users must be able to revisit later.
- Do not duplicate the same message in several channels without a hierarchy rule.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that skeleton can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.
### Screen Reader Support
- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.
### Visual Accessibility
- [ ] Do not rely on color alone to convey severity, completion, or selection state.

## Common mistakes

### **Over-signaling everything**

**The Problem:**
When every state uses strong color, motion, and sound, people stop paying attention.

**How to Fix It?**
Create a severity ladder and reserve the strongest treatment for the states that truly need interruption.

### **Mismatching timing to the job**

**The Problem:**
Short tasks feel sluggish with heavy loading UI, while long tasks feel abandoned with no progress guidance.

**How to Fix It?**
Pick the lightest possible feedback for the wait length and keep the pattern honest about how much is known.

### **Skipping announcement strategy**

**The Problem:**
Screen reader users miss transient changes when live-region behavior is inconsistent or absent.

**How to Fix It?**
Define how each state is announced and test polite versus assertive updates with real assistive technology.

## Related patterns

- https://uxpatterns.dev/patterns/data-display/card-grid
- https://uxpatterns.dev/patterns/user-feedback/empty-states
- https://uxpatterns.dev/patterns/user-feedback/loading-indicator

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/user-feedback/skeleton
