---
name: navigation-menu
description: "Use when you need to organize and structure site navigation."
metadata:
  id: navigation-menu
  category: navigation
  pattern: Navigation Menu
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/navigation/navigation-menu
  sourcePath: apps/web/content/patterns/navigation/navigation-menu.mdx
---

# Navigation Menu

Organize and structure site navigation

## What it solves

**Navigation Menu** is the primary horizontal or vertical bar of links that helps users move between the main sections of a website or application. It is the backbone of site architecture, giving users a persistent map of what the site offers and where they currently are.
A well-built navigation menu balances visibility, hierarchy, and responsiveness — always adapting to [viewport](/glossary/viewport) size while remaining accessible to keyboard and [screen reader](/glossary/screen-reader) users.

## When to use

Use **Navigation Menu** to **provide persistent, structured access to the main sections of a website or app**.
**Common scenarios include:**
- Every multi-page website needs a primary navigation structure
- Web applications with distinct feature sections or views
- Marketing sites with product, pricing, about, and contact pages
- Documentation sites with category-level navigation
- Intranets and portals with department-level sections

## When to avoid

- Single-page sites with no distinct sections (use anchor links or scroll instead)
- Deeply nested hierarchies where a sidebar or megamenu is more appropriate
- Mobile-only apps where a bottom tab bar follows platform conventions
- Wizard or checkout flows where linear step navigation replaces free navigation

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

**Do's ✅**
- Use the `<nav>` element with `aria-label` for screen reader landmark navigation
- Mark the current page with `aria-current="page"` on the active link
- Use `<button>` with `aria-expanded` and `aria-haspopup` for dropdown triggers
- Support keyboard navigation: Tab between items, Enter to activate, Escape to close dropdowns
- Ensure visible focus indicators on all interactive elements
**Don'ts ❌**
- Don't use `<div>` with click handlers instead of semantic `<nav>`, `<ul>`, `<a>`, or `<button>`
- Don't open dropdowns only on hover without a click/keyboard alternative
- Don't nest multiple `<nav>` elements without distinct `aria-label` values

## Performance guardrails

### Target Metrics
- **Initial render:** < 50ms for navigation component
- **Dropdown open:** < 100ms from trigger to visible dropdown
- **Sticky behavior:** No jank during scroll (use `position: sticky` not JavaScript-based)
- **Bundle size:** < 3KB for navigation component with styles
- **Layout shift:** CLS of 0 — navigation should never shift after initial render
### Optimization Strategies
**[Semantic HTML](/glossary/semantic-html) (No JS Needed for Basic Nav)**```html
<nav aria-label="Main navigation">
  <ul>

## Common mistakes

### Too Many Top-Level Items
**The Problem:**
Cramming 10+ items into the primary navigation bar causes wrapping, overflow, or truncated labels.

**How to Fix It:**
Limit to 5-7 top-level items. Group excess items under broader categories or move them to a secondary navigation bar.

### No Active State Indication
**The Problem:**
Users can't tell which page they're on because no navigation item is visually highlighted.

**How to Fix It:**
Style the current page's navigation link distinctly (color, weight, underline) and add `aria-current="page"` for screen readers.

### Dropdown Opens on Hover Only
**The Problem:**
Keyboard users and touch-device users cannot access dropdown submenus that only respond to mouse hover.

**How to Fix It:**
Use click/tap to toggle dropdowns. Support Enter/Space to open and Escape to close for keyboard users.

## Related patterns

- https://uxpatterns.dev/patterns/navigation/breadcrumb
- https://uxpatterns.dev/patterns/navigation/hambuger-menu
- https://uxpatterns.dev/patterns/navigation/sidebar
- https://uxpatterns.dev/patterns/navigation/tabs

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/navigation/navigation-menu
