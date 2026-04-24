---
name: toggle
description: "Implement toggle switches for binary state control in your web applications. Use when you need to switch between two states."
user-invocable: true
triggers:
  - toggle
metadata:
  id: toggle
  category: forms
  pattern: Toggle
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/toggle
  sourcePath: apps/web/content/patterns/forms/toggle.mdx
---

# Toggle

Switch between two states

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Toggle** pattern helps teams create a reliable way to switch a binary setting on or off while making the current state obvious before and after interaction. It is most useful when teams need settings and preferences.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell card toggle-card">
  <label class="switch-row">
    <span>Enable weekly digest</span>
    <span class="switch-control">
      <input type="checkbox" class="switch-input" id="toggle-switch" aria-describedby="toggle-status" />
      <span class="switch" aria-hidden="true"></span>
    </span>
  </label>
  <p id="toggle-status" class="muted" aria-live="polite">Digest is off.</p>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Settings and preferences
- Feature enablement
- Notification or privacy controls

**Avoid when:**

- Prefer a native checkbox input for settings and forms when the value is simply on or off.
- Use a button with `aria-pressed` only when the control represents an action state such as play/pause or show/hide.
- Do not add extra formatting or validation if the product does not benefit from it.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that toggle can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.
### Screen Reader Support
- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.
### Visual Accessibility
- [ ] Do not rely on color alone to convey severity, completion, or selection state.

## Common mistakes

### **Using the wrong validation moment**

**The Problem:**
Immediate validation on partial input makes the pattern feel punitive and noisy.

**How to Fix It?**
Wait until the user has enough information in the field, then validate on blur, pause, or submit depending on the risk of the rule.

### **Separating labels, hints, and errors**

**The Problem:**
People cannot tell which message belongs to which control when the copy is visually detached.

**How to Fix It?**
Keep labels, helper text, and validation messages tightly grouped and connected with `aria-describedby` where appropriate.

### **Forgetting touch and autofill behavior**

**The Problem:**
Desktop-only styling hides the fact that mobile keyboards, autofill, and paste flows behave differently.

**How to Fix It?**
Test the control with autofill, paste, zoom, and on-screen keyboards before calling the pattern complete.

## Related patterns

- https://uxpatterns.dev/patterns/forms/button
- https://uxpatterns.dev/patterns/forms/checkbox
- https://uxpatterns.dev/patterns/forms/radio

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/toggle
