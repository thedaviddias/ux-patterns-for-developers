---
name: notification
description: "Implement effective notification systems in your web applications. Use when you need to inform users about important updates. Triggers: toast."
user-invocable: true
triggers:
  - notification
  - toast
metadata:
  id: notification
  category: user-feedback
  pattern: Notification
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/user-feedback/notification
  sourcePath: apps/web/content/patterns/user-feedback/notification.mdx
---

# Notification

Inform users about important updates

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Notification** pattern helps teams create a reliable way to deliver timely system feedback at the right level of urgency without derailing the user’s primary task. It is most useful when teams need success and error toasts.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell">
  <div class="card notify-card">
    <button type="button" id="notify-trigger">Show notification</button>
    <div id="toast" class="toast" hidden role="status" aria-live="polite"><strong>Project saved.</strong> Your changes are now visible to the team.</div>
  </div>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Success and error toasts
- System warnings and banners
- Undo and retry prompts after an action

**Avoid when:**

- Use a quieter state when the event is too minor to interrupt the task.
- Avoid transient feedback for events users must be able to revisit later.
- Do not duplicate the same message in several channels without a hierarchy rule.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that notification can be completed using keyboard alone.
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
[Screen reader](/glossary/screen-reader) users miss transient changes when live-region behavior is inconsistent or absent.
**How to Fix It?**
Define how each state is announced and test polite versus assertive updates with real assistive technology.

## Related patterns

- https://uxpatterns.dev/patterns/content-management/modal
- https://uxpatterns.dev/patterns/forms/form-validation
- https://uxpatterns.dev/patterns/user-feedback/loading-indicator

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/user-feedback/notification
