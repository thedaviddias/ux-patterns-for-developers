---
name: Sidebar
description: "Use when you need to organize and structure site navigation."
metadata:
  id: sidebar
  category: navigation
  pattern: Sidebar
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/navigation/sidebar
  sourcePath: apps/web/content/patterns/navigation/sidebar.mdx
---

# Sidebar

Organize and structure site navigation

## What it solves

**Sidebar** is a persistent vertical navigation panel positioned along the left or right edge of the screen, providing access to the main sections and features of an application. Sidebars are the dominant navigation pattern in dashboards, admin panels, documentation sites, and complex web applications.
Unlike horizontal navigation menus, sidebars accommodate deep hierarchies through nested, collapsible sections while keeping all navigation visible and accessible without obscuring page content.

## When to use

Use **Sidebar** to **provide persistent, structured access to many navigation items organized in a hierarchy**.
**Common scenarios include:**
- Admin dashboards with multiple feature areas and settings
- Documentation sites with chapter and section navigation
- Email clients, project management tools, and SaaS applications
- File management interfaces with folder trees
- Analytics platforms with report categories

## When to avoid

- Marketing or brochure websites where a horizontal nav is more conventional
- Sites with fewer than 5-6 navigation items (a simple top bar is sufficient)
- Mobile-only applications where a bottom tab bar is the platform convention
- Full-screen content experiences (reading apps, media players) where the sidebar competes with content

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

**Do's ✅**
- Use `<nav>` or `<aside>` with `aria-label` for the sidebar landmark
- Mark the current page with `aria-current="page"` on the active link
- Use `aria-expanded` on collapsible section toggles
- Support keyboard navigation: Tab between items, Enter to activate, Escape to collapse
- Ensure the sidebar is scrollable independently when content overflows
**Don'ts ❌**
- Don't make the sidebar only operable via mouse or touch
- Don't use non-semantic elements (`<div>`) for links or toggles
- Don't remove focus indicators from sidebar navigation items

## Performance guardrails

### Target Metrics
- **Initial render:** < 100ms for full sidebar with sections
- **Collapse animation:** 200ms at 60fps
- **Section toggle:** < 50ms response time
- **Scroll performance:** 60fps independent scrolling
- **Bundle size:** < 5KB for sidebar component with styles
### Optimization Strategies
**CSS Grid Layout (Avoid JS for Positioning)**
```css
.app-layout {
  display: grid;
  grid-template-columns: 16rem 1fr;
  height: 100dvh;
}
.sidebar { overflow-y: auto; }
.main-content { overflow-y: auto; }
```

## Common mistakes

### No Collapse Option on Medium Screens
**The Problem:**
The sidebar takes up 200-300px of horizontal space that could be used for content on medium-width screens like tablets.

**How to Fix It:**
Provide a collapse toggle that switches to a mini (icon-only) mode. Use tooltips on hover to show full labels in mini mode.

### Deeply Nested Items Without Expand State Persistence
**The Problem:**
Users expand nested sections, navigate to a child page, and when the page reloads, all sections collapse again, losing their place.

**How to Fix It:**
Persist expand/collapse state in localStorage or derive it from the current route — auto-expand the section containing the active page.

### No Active State Highlight
**The Problem:**
Users can't tell which page they're on because no sidebar item is visually distinguished.

**How to Fix It:**
Highlight the active item with a background color, text color change, or left border indicator. Add `aria-current="page"` for screen readers.

## Related patterns

- https://uxpatterns.dev/patterns/navigation/hambuger-menu
- https://uxpatterns.dev/patterns/navigation/navigation-menu
- https://uxpatterns.dev/patterns/navigation/tabs

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/navigation/sidebar
