---
name: calendar
description: "Learn how to implement calendar views. Use when you need to display dates and events in calendar format."
user-invocable: true
triggers:
  - calendar
  - view
metadata:
  id: calendar
  category: data-display
  pattern: Calendar View
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/data-display/calendar
  sourcePath: apps/web/content/patterns/data-display/calendar.mdx
---

# Calendar View

Display dates and events in calendar format

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Calendar View** pattern helps teams create a reliable way to present time-based information in a grid that helps people compare days, weeks, or months at a glance. It is most useful when teams need booking and scheduling.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell card calendar-card">
  <div class="calendar-header"><button type="button">‹</button><strong>March 2026</strong><button type="button">›</button></div>
  <div class="calendar-grid"><span class="day">Mon</span><span class="day">Tue</span><span class="day">Wed</span><span class="day">Thu</span><span class="day">Fri</span><span class="day">Sat</span><span class="day">Sun</span><button type="button" class="date">1</button><button type="button" class="date">2</button><button type="button" class="date">3</button><button type="button" class="date">4</button><button type="button" class="date">5</button><button type="button" class="date event">6</button><button type="button" class="date">7</button><button type="button" class="date">8</button><button type="button" class="date">9</button><button type="button" class="date">10</button><button type="button" class="date">11</button><button type="button" class="date">12</button><button type="button" class="date event">13</button><button type="button" class="date">14</button><button type="button" class="date">15</button><button type="button" class="date">16</button><button type="button" class="date">17</button><button type="button" class="date">18</button><button type="button" class="date">19</button><button type="button" class="date event">20</button><button type="button" class="date">21</button><button type="button" class="date">22</button><button type="button" class="date">23</button><button type="button" class="date">24</button><button type="button" class="date">25</button><button type="button" class="date">26</button><button type="button" class="date">27</button><button type="button" class="date">28</button><button type="button" class="date">29</button><button type="button" class="date">30</button><button type="button" class="date">31</button><button type="button" class="date"></button><button type="button" class="date"></button><button type="button" class="date"></button><button type="button" class="date"></button></div>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Booking and scheduling
- Team availability
- Events and release planning

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
- [ ] Verify that calendar view can be completed using keyboard alone.
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

- https://uxpatterns.dev/patterns/data-display/filter-panel
- https://uxpatterns.dev/patterns/data-display/list-view
- https://uxpatterns.dev/patterns/data-display/timeline

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/data-display/calendar
