---
name: hambuger-menu
description: "Create accessible mobile menus with smooth animations and touch-friendly interactions. Use when you need to display a menu icon for mobile devices."
user-invocable: true
triggers:
  - hambuger
  - menu
  - hamburger
metadata:
  id: hambuger-menu
  category: navigation
  pattern: Hamburger Menu
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/navigation/hambuger-menu
  sourcePath: apps/web/content/patterns/navigation/hambuger-menu.mdx
---

# Hamburger Menu

Display a menu icon for mobile devices

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

**Hamburger Menu** is a three-line icon (☰) that toggles a hidden navigation panel, primarily on mobile and small-screen devices. Tapping or clicking the icon reveals the site's navigation, then hides it again when dismissed.
This pattern conserves screen real estate on smaller viewports while keeping the full navigation accessible behind a single, universally recognized affordance.

## When to use and when to avoid

**Use when:**

Use **Hamburger Menu** to **provide full navigation access on small screens without consuming permanent layout space**.
**Common scenarios include:**
- Mobile or responsive websites where horizontal space is limited
- Sites with extensive navigation that cannot fit in a single row on smaller screens
- Progressive web apps that mimic native mobile app patterns
- Responsive redesigns of desktop navigation menus
- Admin dashboards or complex apps with many navigation items

**Avoid when:**

- Sites with only 3-4 navigation items that fit comfortably in a visible bar
- Desktop-only applications where screen space is abundant
- Kiosk or large-screen interfaces where discoverability is critical
- Pages where the primary user task depends on navigation visibility (e.g., comparison tools)
- When your analytics show users rarely find or use the hidden menu

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

**Do's ✅**
- Use a `<button>` element with `aria-expanded` and `aria-controls`
- Trap focus inside the open panel so Tab cycles through menu items only
- Close the menu on Escape key press and return focus to the toggle button
- Use `aria-label` on the toggle to describe its current action ("Open menu" / "Close menu")
- Announce state changes to screen readers via `aria-expanded`
**Don'ts ❌**
- Don't use a `<div>` or `<span>` as the toggle element
- Don't allow focus to escape behind the open overlay
- Don't remove visible focus indicators from menu links

## Performance guardrails

### Target Metrics
- **Toggle response:** < 50ms visual feedback after tap/click
- **Panel animation:** 250-300ms slide duration at 60fps
- **First interactive:** Menu should be interactive within 100ms of toggle
- **Bundle size:** < 3KB for hamburger component with styles (no heavy dependencies)
- **Paint cost:** Use transform/opacity only for GPU-accelerated animations
### Optimization Strategies
**CSS-Only Toggle (Progressive Enhancement)**
```css
/* Use :has() or checkbox hack for no-JS base */
.nav-panel { transform: translateX(-100%); }
.hamburger-toggle[aria-expanded="true"] ~ .nav-panel {
  transform: translateX(0);
}
```

## Common mistakes

### Using Hamburger on Desktop
**The Problem:**
Hiding navigation behind a hamburger icon on large screens reduces discoverability and forces unnecessary clicks.

**How to Fix It:**
Only use the hamburger pattern below a responsive breakpoint (typically 768px or 1024px). Show full navigation on desktop.

### Missing Focus Management
**The Problem:**
When the menu opens, focus stays on the toggle or moves to the page body, leaving keyboard users stranded.

**How to Fix It:**
Move focus to the first focusable element inside the panel on open. Trap focus within the panel. Return focus to the toggle on close.

### No Escape Key Support
**The Problem:**
Keyboard users have no way to quickly dismiss the menu without tabbing to a close button.

**How to Fix It:**
Listen for the `Escape` key and close the menu, restoring focus to the toggle button.

## Related patterns

- https://uxpatterns.dev/patterns/navigation/navigation-menu
- https://uxpatterns.dev/patterns/navigation/sidebar
- https://uxpatterns.dev/patterns/navigation/tabs

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/navigation/hambuger-menu
