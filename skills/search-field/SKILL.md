---
name: search-field
description: "Learn how to implement effective search fields in your web applications. Use when you need to search through content efficiently. Triggers: search input."
user-invocable: true
triggers:
  - search
  - field
  - search input
metadata:
  id: search-field
  category: forms
  pattern: Search Field
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/search-field
  sourcePath: apps/web/content/patterns/forms/search-field.mdx
---

# Search Field

Search through content efficiently

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Search Field** pattern helps teams create a reliable way to help users retrieve content or commands quickly with a clear input, sensible defaults, and immediate recovery paths. It is most useful when teams need site-wide content search.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

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

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Site-wide content search
- Scoped table and list filtering
- Quick command or object lookup

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
- [ ] Verify that search field can be completed using keyboard alone.
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

- https://uxpatterns.dev/patterns/advanced/command-palette
- https://uxpatterns.dev/patterns/advanced/search-results
- https://uxpatterns.dev/patterns/forms/autocomplete
- https://uxpatterns.dev/patterns/forms/text-field

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/search-field
