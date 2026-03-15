---
name: breadcrumb
description: "Use when implementing help users understand their current location."
metadata:
  id: breadcrumb
  category: navigation
  pattern: Breadcrumb
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/navigation/breadcrumb
  sourcePath: apps/web/content/patterns/navigation/breadcrumb.mdx
---

# Breadcrumb

Help users understand their current location

## What it solves

**Breadcrumbs** display as horizontal link lists separated by symbols, helping users understand their website location at a glance.
Breadcrumbs work as secondary navigation aids showing users their current location and providing easy navigation back through parent pages.
Websites with deep hierarchical structures or complex navigation paths benefit most from breadcrumbs.

## When to use

Use **Breadcrumbs** to **show users their location within a website's structure and help easy navigation**.
**Common scenarios include:**
- Websites have multiple hierarchical levels (categories, sub-categories)
- Large or complex sites where users land on deep pages from search engines
- Systems rely on nested file or document organization (file explorers, project management tools)
- E-commerce stores use layered product categories

## When to avoid

- Single-level websites have flat structure
- Landing pages or homepages don't need them
- Small websites use simple navigation
- Hierarchy already shows through other navigation elements
- Single-page applications use modal-based navigation

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

**Do's ✅**
- Use `<nav>` with `aria-label="Breadcrumb"` for landmark navigation
- Mark current page with `aria-current="page"`
- Use ordered list `<ol>` to convey sequence
- Ensure [keyboard navigation](/glossary/keyboard-navigation) with visible focus indicators
- Provide skip links for lengthy breadcrumb trails
- Announce dynamic breadcrumb updates to screen readers
**Don'ts ❌**
- Don't make the current page title clickable
- Don't rely solely on visual separators (use CSS pseudo-elements)

## Performance guardrails

Target performance metrics for breadcrumb navigation:
- **Initial render**: < 50ms for breadcrumb component
- **Interaction delay**: < 100ms for hover/focus states
- **Layout shift**: CLS score of 0 (no shift after initial render)
- **Bundle size**: < 5KB for breadcrumb component with styles
- **Memory usage**: < 1MB for complex breadcrumb trails
### Optimization Strategies
**[Lazy Loading](/glossary/lazy-loading) for Deep Hierarchies**
```javascript
// Load intermediate levels only when needed
const BreadcrumbTrail = ({ path }) => {
  const [expanded, setExpanded] = useState(false);
  if (path.length > 5 && !expanded) {
    return (
      <>
        {path[0]}
        <button onClick={() => setExpanded(true)}>...</button>
        {path[path.length - 1]}
      </>
    );
  }
  return path.map(item => );
};
```

## Common mistakes

### Making Current Page a Link
**The Problem:**
The last breadcrumb item links to the current page, creating confusing circular navigation.

```html
<!-- Bad -->
<a href="/current">Current Page</a>

<!-- Good -->
<span aria-current="page">Current Page</span>
```

**How to Fix It:**
Use a non-clickable span with `aria-current="page"` for the current page instead of a link.

### Using Breadcrumbs as Primary Navigation
**The Problem:**
Relying on breadcrumbs instead of proper main navigation, leaving users without clear site structure.

**How to Fix It:**
Always provide a main navigation menu. Breadcrumbs should supplement, not replace primary navigation.

### Incorrect Hierarchy Representation
**The Problem:**
Breadcrumb trail doesn't match actual site structure, misleading users about their location.

```html
<!-- Bad: Skipping levels -->
Home > Product Details

<!-- Good: Full path -->
Home > Products > Electronics > Product Details
```

**How to Fix It:**
Show the complete hierarchical path from home to current page without skipping levels.

## Related patterns

- https://uxpatterns.dev/patterns/navigation/back-to-top
- https://uxpatterns.dev/patterns/navigation/pagination
- https://uxpatterns.dev/patterns/navigation/tabs

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/navigation/breadcrumb
