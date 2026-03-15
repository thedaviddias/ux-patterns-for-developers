---
name: table
description: "Use when you need to display structured data in rows and columns."
metadata:
  id: table
  category: data-display
  pattern: Data Table
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/data-display/table
  sourcePath: apps/web/content/patterns/data-display/table.mdx
---

# Data Table

Display structured data in rows and columns

## What it solves

**Data Tables** are structured components that display information in rows and columns, enabling users to scan, compare, analyze, and interact with large datasets efficiently.

## When to use

- To display structured, tabular data with multiple properties
- When users need to compare data across multiple items
- To enable sorting, filtering, and searching of datasets
- For displaying financial data, inventory, user lists, or analytics
- When data relationships are best understood in a grid format
- To support bulk actions on multiple items
- For export-ready data presentation

## When to avoid

- For simple lists with minimal properties (use [List View](/patterns/data-display/list-view) instead)
- When data has complex hierarchical relationships (consider [Tree View](/patterns/data-display/tree-view))
- For content-heavy items (use [Card Grid](/patterns/data-display/card-grid) or detailed views)
- On small mobile screens without responsive alternatives
- When real-time updates are critical (consider live data streams)
- For unstructured or narrative content (use [Expandable Text](/patterns/content-management/expandable-text))

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

When to use client-side vs server-side sorting and filtering?
**Use Client-Side When:**
- ✅ **You have fewer than 1,000 rows** – Client-side operations are instant and provide better UX for small datasets.
- ✅ **Users need rapid, interactive filtering** – Instant feedback without network delays enhances the experience.
- ✅ **The full dataset is already loaded** – If all data is present, server trips add unnecessary latency.
- ✅ **You want offline functionality** – Client-side operations work without network connectivity.
- ✅ **Complex multi-column sorting is required** – Easier to implement sophisticated sort logic locally.
Example Use Cases for Client-Side:
- Admin dashboards with < 500 records
- Settings or configuration tables

## Performance guardrails

Target performance metrics for data tables:
- **Initial render**: < 300ms for first 50 rows
- **Sort operation**: < 100ms for 1000 rows
- **Filter application**: < 200ms with debouncing
- **Scroll performance**: 60 FPS with virtual scrolling
- **Memory usage**: < 50MB for 10,000 rows

## Common mistakes

### Rendering All Rows at Once
**The Problem:**
Loading thousands of DOM nodes simultaneously causes severe performance issues, slow scrolling, and can freeze the browser entirely.

**How to Fix It?** Implement **virtual scrolling** to render only visible rows. Use libraries like [TanStack Virtual](https://tanstack.com/virtual/) or build custom virtualization that maintains smooth 60 FPS scrolling even with 10,000+ rows.

### No Mobile Alternative
**The Problem:**
Forcing users to horizontally scroll through a desktop table on mobile devices creates a frustrating experience and makes data comparison nearly impossible.

**How to Fix It?** Provide **mobile-specific views** like [Card Grid](/patterns/data-display/card-grid) layouts or stacked key-value pairs. Consider using a sticky first column for essential data when horizontal scrolling is necessary.

### Feature Overload
**The Problem:**
Showing all available features (filters, exports, column toggles) at once overwhelms users and clutters the interface, especially for simple data browsing tasks.

**How to Fix It?** Use **progressive disclosure** to hide advanced features initially. Start with essential controls (search, sort) and reveal complex features through settings menus or "Advanced" buttons.

## Related patterns

- https://uxpatterns.dev/patterns/content-management/accordion
- https://uxpatterns.dev/patterns/content-management/expandable-text
- https://uxpatterns.dev/patterns/content-management/modal
- https://uxpatterns.dev/patterns/content-management/tooltip
- https://uxpatterns.dev/patterns/data-display/card-grid
- https://uxpatterns.dev/patterns/data-display/dashboard
- https://uxpatterns.dev/patterns/data-display/filter-panel
- https://uxpatterns.dev/patterns/data-display/list-view
- https://uxpatterns.dev/patterns/data-display/tree-view
- https://uxpatterns.dev/patterns/forms/checkbox
- https://uxpatterns.dev/patterns/forms/search-field
- https://uxpatterns.dev/patterns/navigation/pagination
- https://uxpatterns.dev/patterns/user-feedback/empty-states
- https://uxpatterns.dev/patterns/user-feedback/notification
- https://uxpatterns.dev/patterns/user-feedback/skeleton

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/data-display/table
