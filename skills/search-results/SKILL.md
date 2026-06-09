---
name: search-results
description: "Learn how to implement search results pages. Use when you need to display and filter search results."
user-invocable: true
triggers:
  - search
  - results
metadata:
  id: search-results
  category: advanced
  pattern: Search Results
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/advanced/search-results
  sourcePath: apps/web/content/patterns/advanced/search-results.mdx
---

# Search Results

Display and filter search results

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Search Results** pattern helps teams create a reliable way to turn a query into a ranked, filterable list that helps users recover from broad or imperfect searches. It is most useful when teams need docs and knowledge-base retrieval.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell card results">
  <div class="results-header">
    <strong>24 results for “design systems”</strong>
    <span class="muted">Sorted by relevance</span>
  </div>
  <div class="chips">
    <button type="button">Guides</button>
    <button type="button">Patterns</button>
    <button type="button">Articles</button>
  </div>
  <div class="result-list">
    <article><h3>Design system foundations</h3><p class="muted">Start with tokens, components, and documentation that teams can actually keep current.</p></article>
    <article><h3>Pattern libraries that scale</h3><p class="muted">Compare maintenance models for component inventories, examples, and review workflows.</p></article>
  </div>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Docs and knowledge-base retrieval
- Catalog and directory search
- Internal admin and operational search

**Avoid when:**

- Use a simpler visible navigation or single-page flow when the product surface is still small.
- Avoid advanced interaction patterns if the team cannot support their state complexity well.
- Do not introduce hidden power-user behavior before the plain path is already strong.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that search results can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.
### Screen Reader Support
- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.
### Visual Accessibility
- [ ] Do not rely on color alone to convey severity, completion, or selection state.

## Common mistakes

### **Designing only the happy path**

**The Problem:**
The pattern feels polished until loading, empty, and failure states appear.

**How to Fix It?**
Specify the full lifecycle alongside the default state so implementation does not improvise later.

### **Letting interaction and content drift apart**

**The Problem:**
Users work harder when controls, status, and supporting information feel disconnected.

**How to Fix It?**
Keep the information architecture of the pattern close to the interaction model.

### **Treating accessibility as a final pass**

**The Problem:**
Keyboard, announcement, and reading-order issues become expensive once the interaction is already fixed.

**How to Fix It?**
Bake semantics, focus behavior, and announcements into the first implementation.

## Related patterns

- https://uxpatterns.dev/patterns/data-display/filter-panel
- https://uxpatterns.dev/patterns/forms/search-field
- https://uxpatterns.dev/patterns/navigation/pagination

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/advanced/search-results
