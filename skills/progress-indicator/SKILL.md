---
name: progress-indicator
description: "Create effective progress indicators for your web applications. Use when you need to show completion status of an operation."
user-invocable: true
triggers:
  - progress
  - indicator
metadata:
  id: progress-indicator
  category: user-feedback
  pattern: Progress Indicator
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/user-feedback/progress-indicator
  sourcePath: apps/web/content/patterns/user-feedback/progress-indicator.mdx
---

# Progress Indicator

Show completion status of an operation

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Progress Indicator** pattern helps teams create a reliable way to show how far a task has advanced and how much work remains when the system can estimate that honestly. It is most useful when teams need file upload and export jobs.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell">
  <div class="card progress-card">
    <button type="button" id="progress-trigger">Run export</button>
    <div class="progress-track"><div id="progress-fill"></div></div>
    <p id="progress-status" class="muted">0% complete</p>
  </div>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- File upload and export jobs
- Multi-step setup or checkout flows
- Background tasks with measurable completion

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
- [ ] Verify that progress indicator can be completed using keyboard alone.
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

- https://uxpatterns.dev/patterns/advanced/wizard
- https://uxpatterns.dev/patterns/user-feedback/loading-indicator
- https://uxpatterns.dev/patterns/user-feedback/skeleton

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/user-feedback/progress-indicator
