---
name: filter-panel
description: "Learn how to implement filter panels for data refinement. Use when you need to filter and refine data displays."
user-invocable: true
triggers:
  - filter
  - panel
metadata:
  id: filter-panel
  category: data-display
  pattern: Filter Panel
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/data-display/filter-panel
  sourcePath: apps/web/content/patterns/data-display/filter-panel.mdx
---

# Filter Panel

Filter and refine data displays

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Filter Panel** pattern helps teams create a reliable way to help users narrow a large collection without losing track of the active constraints or available results. It is most useful when teams need search and catalog refinement.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell filters-demo">
  <aside class="card filter-panel">
    <h3>Filters</h3>
    <label><input type="checkbox" checked /> Mobile ready</label>
    <label><input type="checkbox" /> Accessibility notes</label>
    <label><input type="checkbox" checked /> Includes code</label>
  </aside>
  <section class="card filter-results">
    <div class="result-row"><strong>Pagination</strong><span class="badge">Navigation</span></div>
    <div class="result-row"><strong>Image Upload</strong><span class="badge">Media</span></div>
    <div class="result-row"><strong>Form Validation</strong><span class="badge">Forms</span></div>
  </section>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Search and catalog refinement
- Analytics scoping
- Table and list narrowing

**Avoid when:**

- Use a simpler view when users only need one or two values and not the full layout.
- Avoid this pattern when the task is creation or editing rather than interpretation.
- Do not force the same view onto mobile if another representation would be clearer.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that filter panel can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.
### Screen Reader Support
- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.
### Visual Accessibility
- [ ] Do not rely on color alone to convey severity, completion, or selection state.

## Performance guardrails

- Measure the cost of rendering the default view before adding richer adornments such as nested actions, charts, or inline filters.
- Use pagination, windowing, or progressive disclosure when the layout would otherwise render too many items at once.
- Stabilize heights and placeholder geometry so loading and data refresh states do not cause large layout shifts.

## Common mistakes

### **Choosing the layout before the task**

**The Problem:**
Teams often pick a visually familiar pattern before confirming whether users need comparison, exploration, or scanning.

**How to Fix It?**
Start from the user task, then map the layout to comparison, chronology, hierarchy, or overview needs.

### **Ignoring non-happy states**

**The Problem:**
A polished default view still feels broken when loading, empty, and error states are inconsistent.

**How to Fix It?**
Design the data lifecycle up front, including empty, partial, stale, and failed results.

### **Shipping a desktop-only density model**

**The Problem:**
Large tables, dense dashboards, and heavy cards collapse quickly on small screens.

**How to Fix It?**
Define a mobile strategy such as stacked cards, progressive disclosure, or alternate summaries before implementation.

## Related patterns

- https://uxpatterns.dev/patterns/advanced/search-results
- https://uxpatterns.dev/patterns/data-display/list-view
- https://uxpatterns.dev/patterns/navigation/pagination

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/data-display/filter-panel
