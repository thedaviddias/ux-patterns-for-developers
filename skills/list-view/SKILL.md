---
name: list-view
description: "Learn how to implement list views for data display. Use when you need to display data in vertical lists."
user-invocable: true
triggers:
  - list
  - view
metadata:
  id: list-view
  category: data-display
  pattern: List View
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/data-display/list-view
  sourcePath: apps/web/content/patterns/data-display/list-view.mdx
---

# List View

Display data in vertical lists

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **List View** pattern helps teams create a reliable way to present items in a linear format that favors readability, comparison of a few attributes, and efficient scanning. It is most useful when teams need activity and inbox lists.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## When to use and when to avoid

**Use when:**

- Activity and inbox lists
- Admin records with a few fields
- Mobile-first data browsing

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
- [ ] Verify that list view can be completed using keyboard alone.
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
- Use [pagination](/glossary/pagination), windowing, or progressive disclosure when the layout would otherwise render too many items at once.
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

- https://uxpatterns.dev/patterns/data-display/card-grid
- https://uxpatterns.dev/patterns/data-display/table
- https://uxpatterns.dev/patterns/data-display/timeline

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/data-display/list-view
