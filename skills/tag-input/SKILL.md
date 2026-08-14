---
name: tag-input
description: "Create tag input components for dynamic keyword entry with validation and accessibility support. Use when you need to enter and format tags."
user-invocable: true
triggers:
  - tag
  - input
metadata:
  id: tag-input
  category: forms
  pattern: Tag Input
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/tag-input
  sourcePath: apps/web/content/patterns/forms/tag-input.mdx
---

# Tag Input

Enter and format tags

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Tag Input** pattern helps teams create a reliable way to let users enter, review, and remove several short values without losing readability or keyboard efficiency. It is most useful when teams need labels and keywords.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell card tag-card">
  <label for="tag-input">Topics</label>
  <div class="tag-list" id="tag-list">
    <span class="tag">Accessibility <button type="button" aria-label="Remove Accessibility">×</button></span>
  </div>
  <input id="tag-input" type="text" placeholder="Type a tag and press Enter" />
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Labels and keywords
- Recipient entry
- Topic and taxonomy assignment

**Avoid when:**

- Use a simpler native control when the value is binary, tiny, or fully constrained.
- Avoid custom behavior when a native browser input already solves the main job well.
- Do not add extra formatting or validation if the product does not benefit from it.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that tag input can be completed using keyboard alone.
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

- https://uxpatterns.dev/patterns/forms/autocomplete
- https://uxpatterns.dev/patterns/forms/multi-select-input
- https://uxpatterns.dev/patterns/forms/text-field

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/tag-input
