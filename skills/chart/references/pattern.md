# Charts & Graphs

> Learn how to implement accessible charts and graphs. Discover best practices for data visualization, chart types, and responsive designs.

**URL:** https://uxpatterns.dev/patterns/data-display/chart
**Source:** apps/web/content/patterns/data-display/chart.mdx

---

## Overview

A **Charts & Graphs** pattern helps teams create a reliable way to translate quantitative data into a visual shape that makes change, comparison, or distribution easier to see. It is most useful when teams need analytics and reporting.

Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Use Cases

### When to use:

- Analytics and reporting
- Status and trend monitoring
- Decision support dashboards

### When not to use:

- Use a simpler view when users only need one or two values and not the full layout.
- Avoid this pattern when the task is creation or editing rather than interpretation.
- Do not force the same view onto mobile if another representation would be clearer.

### Common scenarios and examples

- Analytics and reporting where users need a clear, repeatable interface model.
- Status and trend monitoring where users need a clear, repeatable interface model.
- Decision support dashboards where users need a clear, repeatable interface model.

## Benefits

- Clarifies how charts & graphs should behave before implementation details begin to sprawl.
- Creates a reusable interaction model for teams who need to translate quantitative data into a visual shape that makes change, comparison, or distribution easier to see.
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
Root[Charts & Graphs] --> A[Chart frame]
Root --> B[Data marks]
Root --> C[Axes or scale labels]
Root --> D[Legend or key]
Root --> E[Tooltip or details view]
```

### Component Structure

1. **Chart frame**

- Defines the bounds of the visualization and its title.

2. **Data marks**

- Draw the lines, bars, areas, or points that represent the values.

3. **Axes or scale labels**

- Explain how to read the values and intervals.

4. **Legend or key**

- Clarifies color, series, or state meaning.

5. **Tooltip or details view**

- Surfaces exact values and additional context.

#### Summary of Components

| Component | Required? | Purpose |
| --- | --- | --- |
| Chart frame | ✅ Yes | Defines the bounds of the visualization and its title. |
| Data marks | ✅ Yes | Draw the lines, bars, areas, or points that represent the values. |
| Axes or scale labels | ✅ Yes | Explain how to read the values and intervals. |
| Legend or key | ❌ No | Clarifies color, series, or state meaning. |
| Tooltip or details view | ❌ No | Surfaces exact values and additional context. |

## Variations

### Trend chart

Emphasizes change over time.

**When to use:** Use for time-series metrics and performance history.

### Comparison chart

Makes differences between categories easy to see.

**When to use:** Use for benchmarks, rankings, or group comparison.

### Distribution chart

Shows spread, outliers, or composition.

**When to use:** Use when relationship and proportion matter more than exact sequence.

## Examples

### Basic Implementation

```html
<div class="demo-shell card generic-card"><h2>Charts & Graphs</h2><p class="muted">Basic demo placeholder for visualize data with graphs and charts.</p></div>
```

### What this example demonstrates

- A clear baseline implementation of charts & graphs that can be reviewed without framework-specific noise.
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

- Verify that charts & graphs can be completed using keyboard alone.
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

- [ ] Verify that charts & graphs can be completed using keyboard alone.
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

- [ ] Verify the default, loading, error, and success states for charts & graphs.
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
