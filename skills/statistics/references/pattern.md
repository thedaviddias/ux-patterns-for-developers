# Statistics Display

> Learn how to implement statistics displays. Discover best practices for metric cards, KPI dashboards, and data visualization.

**URL:** https://uxpatterns.dev/patterns/data-display/statistics
**Source:** apps/web/content/patterns/data-display/statistics.mdx

---

## Overview

A **Statistics Display** pattern helps teams create a reliable way to surface a small set of key metrics with enough context that users can judge direction, magnitude, and urgency quickly. It is most useful when teams need headline KPI strips.

Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Use Cases

### When to use:

- Headline KPI strips
- Status cards in dashboards
- Summary metrics on landing pages

### When not to use:

- Use a simpler view when users only need one or two values and not the full layout.
- Avoid this pattern when the task is creation or editing rather than interpretation.
- Do not force the same view onto mobile if another representation would be clearer.

### Common scenarios and examples

- Headline KPI strips where users need a clear, repeatable interface model.
- Status cards in dashboards where users need a clear, repeatable interface model.
- Summary metrics on landing pages where users need a clear, repeatable interface model.

## Benefits

- Clarifies how statistics display should behave before implementation details begin to sprawl.
- Creates a reusable interaction model for teams who need to surface a small set of key metrics with enough context that users can judge direction, magnitude, and urgency quickly.
- Makes accessibility, edge cases, and recovery paths part of the design instead of post-launch cleanup.
- Gives product, design, and engineering a shared language for evaluating trade-offs.

## Drawbacks

- It can become visually dense or noisy when too much state is shown at once.
- Responsive behavior usually needs a deliberate mobile fallback, not just smaller text.
- Loading, empty, and error states are just as important as the happy path.
- Performance work becomes visible quickly when the dataset or layout grows.

## Anatomy

```mermaid
flowchart TB
Root[Statistics Display] --> A[Metric label]
Root --> B[Primary value]
Root --> C[Change indicator]
Root --> D[Supporting context]
Root --> E[Drill-down path]
```

### Component Structure

1. **Metric label**

- Names what the number represents.

2. **Primary value**

- Displays the most important numeric signal.

3. **Change indicator**

- Shows movement versus a prior state or goal.

4. **Supporting context**

- Clarifies timeframe, scope, or target.

5. **Drill-down path**

- Links to the detail behind the summary.

#### Summary of Components

| Component | Required? | Purpose |
| --- | --- | --- |
| Metric label | ✅ Yes | Names what the number represents. |
| Primary value | ✅ Yes | Displays the most important numeric signal. |
| Change indicator | ❌ No | Shows movement versus a prior state or goal. |
| Supporting context | ❌ No | Clarifies timeframe, scope, or target. |
| Drill-down path | ❌ No | Links to the detail behind the summary. |

## Variations

### Single KPI card

Focuses attention on one high-priority number.

**When to use:** Use when a single metric drives the decision.

### Metric strip

Shows several related KPIs together.

**When to use:** Use for overview pages and dashboards.

### Narrated statistic

Pairs the number with more interpretive text.

**When to use:** Use when the metric needs context to be meaningful.

## Examples

### Live Preview

### Basic Implementation

```html
<div class="demo-shell grid">
  <article class="card tile">
    <div class="thumb">📈</div>
    <h3>92%</h3>
    <p class="muted">Completion rate for the new onboarding flow.</p>
  </article>
  <article class="card tile">
    <div class="thumb">⏱</div>
    <h3>1.4m</h3>
    <p class="muted">Average time to publish a new pattern page.</p>
  </article>
  <article class="card tile">
    <div class="thumb">🧩</div>
    <h3>37</h3>
    <p class="muted">Patterns with interactive demos available today.</p>
  </article>
</div>
```

### What this example demonstrates

- A clear baseline implementation of statistics display that can be reviewed without framework-specific noise.
- Visible state, spacing, and content hierarchy that mirror the implementation guidance above.
- A small enough surface to copy into a design review or prototype before scaling the pattern up.

### Implementation Notes

- Start with [semantic HTML](/glossary/semantic-html) and only add JavaScript where the interaction truly requires it.
- Keep styling tokens and spacing consistent with adjacent controls or layouts.
- If the live implementation introduces async behavior, mirror those states in the code example rather than documenting them only in prose.
## Best Practices

### Content

**Do's ✅**

- Start with the questions users need answered before choosing the layout.
- Use labels, legends, and headings that explain why the data matters.
- Keep supporting metadata close to the item, card, chart, or row it describes.

**Don'ts ❌**

- Do not assume everyone already understands the metric, status, or sorting rule.
- Do not rely on truncation to hide critical context.
- Do not bury key actions where they only appear on hover.

### Accessibility

**Do's ✅**

- Verify that statistics display can be completed using keyboard alone.
- Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- Preserve a visible focus state that is still readable at high zoom.
- Use semantic elements first, then add ARIA only where semantics alone are not enough.
- Announce state changes such as errors, loading, or completion in the right place and with the right politeness.

**Don'ts ❌**

- Do not remove focus styles without a visible replacement.
- Do not depend on placeholder or helper text that disappears before the user can act on it.
- Do not assume pointer, touch, and assistive technologies will all interact with the pattern the same way.

### Visual Design

**Do's ✅**

- Use hierarchy to separate primary values from supporting context.
- Reserve space for loading and empty states to avoid layout jumps.
- Design density levels intentionally for desktop and mobile.

**Don'ts ❌**

- Do not use decorative chrome that competes with the data itself.
- Do not make all rows, cards, or panels look equally important when priorities differ.
- Do not overload a single view with every possible control.

### Layout & Positioning

**Do's ✅**

- Preserve scannability as the [viewport](/glossary/viewport) shrinks.
- Keep filters, summaries, and data visibly connected.
- Choose stable ordering and grouping rules so users can build muscle memory.
**Don'ts ❌**

- Do not let controls jump around between breakpoints.
- Do not hide essential data behind horizontal scrolling without a fallback.
- Do not treat empty or zero states as an afterthought.

## Common Mistakes & Anti-Patterns 🚫

### **Choosing the layout before the task**

**The Problem:**
Teams often pick a visually familiar pattern before confirming whether users need comparison, exploration, or scanning.

**How to Fix It?**
Start from the user task, then map the layout to comparison, chronology, hierarchy, or overview needs.

---

### **Ignoring non-happy states**

**The Problem:**
A polished default view still feels broken when loading, empty, and error states are inconsistent.

**How to Fix It?**
Design the data lifecycle up front, including empty, partial, stale, and failed results.

---

### **Shipping a desktop-only density model**

**The Problem:**
Large tables, dense dashboards, and heavy cards collapse quickly on small screens.

**How to Fix It?**
Define a mobile strategy such as stacked cards, progressive disclosure, or alternate summaries before implementation.

## Data Flow

- Start by defining the source of truth for the dataset, then map how filters, sorting, and view state transform that dataset before render.
- Keep loading, empty, and partial states in the same data flow model as the populated state so the view does not need separate ad hoc logic.
- When the pattern supports drilling into detail, keep the transition between overview and detail explicit so users understand what changed.

## Performance

- Measure the cost of rendering the default view before adding richer adornments such as nested actions, charts, or inline filters.
- Use [pagination](/glossary/pagination), windowing, or progressive disclosure when the layout would otherwise render too many items at once.
- Stabilize heights and placeholder geometry so loading and data refresh states do not cause large layout shifts.
## Usability Considerations

- Test whether people can answer the intended question in under a few seconds; if not, the layout may be too dense or too vague.
- Make sort, filter, and grouping rules visible whenever they change the order or subset of data.
- Give users a clear path back to a simpler or more detailed view when one layout cannot answer every question.

## Accessibility

### Keyboard Interaction

- [ ] Verify that statistics display can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.

### Screen Reader Support

- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.

### Visual Accessibility

- [ ] Do not rely on color alone to convey severity, completion, or selection state.
- [ ] Test the pattern at 200% zoom and with reduced motion enabled.
- [ ] Ensure [touch targets](/glossary/touch-targets) remain comfortable on mobile and coarse pointers.
## Testing Guidelines

### Functional Testing

- [ ] Verify the default, loading, error, and success states for statistics display.
- [ ] Test the primary action and the obvious recovery action in the same run.
- [ ] Confirm that state survives refresh, navigation, or retry in the way users would expect.

### Accessibility Testing

- [ ] Run keyboard-only checks and at least one [screen reader](/glossary/screen-reader) pass on the final implementation.
- [ ] Validate headings, labels, and announcement behavior with real content rather than lorem ipsum.
- [ ] Check color contrast and focus visibility in both default and stressed states.
### Edge Cases

- [ ] Test empty, long, duplicated, and unexpectedly formatted content.
- [ ] Check behavior on narrow screens, zoomed layouts, and slower networks.
- [ ] Verify that optimistic or asynchronous states reconcile correctly after a failure.

## Frequently Asked Questions

## Related Patterns

## Resources

### References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - Accessibility baseline for keyboard support, focus management, and readable state changes.
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - Reference patterns for keyboard behavior, semantics, and assistive technology support.

### Guides

- [web.dev: Rendering on the Web](https://web.dev/articles/rendering-on-the-web) - Rendering tradeoffs for data-rich pages, dashboards, and result-heavy views.
- [web.dev: Rendering on the Web](https://web.dev/articles/rendering-on-the-web) - Rendering tradeoffs for data-rich pages, dashboards, and result-heavy views.

### Articles

- [Stephanie Walter: Designing complex data tables](https://stephaniewalter.design/blog/essential-resources-design-complex-data-tables/) - Design considerations for dense tables, column behavior, and analytical workflows.
- [web.dev: Rendering on the Web](https://web.dev/articles/rendering-on-the-web) - Rendering tradeoffs for data-rich pages, dashboards, and result-heavy views.

### NPM Packages

- [`recharts`](https://www.npmjs.com/package/recharts) - Chart primitives for dashboards, trend views, and KPI summaries.
- [`victory`](https://www.npmjs.com/package/victory) - Charting library with accessible SVG-based visualization primitives.
- [`@visx/visx`](https://www.npmjs.com/package/%40visx%2Fvisx) - Composable visualization building blocks for custom data displays.
