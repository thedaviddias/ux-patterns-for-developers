---
name: megamenu
description: "Build accessible and responsive megamenus with keyboard navigation and mobile-friendly adaptations. Use when you need to display a large number of links in a single menu."
user-invocable: true
triggers:
  - megamenu
metadata:
  id: megamenu
  category: navigation
  pattern: Megamenu
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/navigation/megamenu
  sourcePath: apps/web/content/patterns/navigation/megamenu.mdx
---

# Megamenu

Display a large number of links in a single menu

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

**Megamenu** is a large, multi-column dropdown panel that expands from a navigation bar to reveal a structured collection of links, categories, and sometimes promotional content. Unlike standard dropdown menus, megamenus use the full or near-full width of the page to organize many navigation options at once.
Megamenus help users scan large navigation structures without repeated clicking, making them a staple on enterprise, e-commerce, and content-heavy websites.

## When to use and when to avoid

**Use when:**

Use **Megamenu** to **expose a large set of categorized navigation options in a single, scannable panel**.
**Common scenarios include:**
- E-commerce sites with dozens of product categories and subcategories
- Enterprise platforms with many features organized by domain
- University or government sites with extensive departmental navigation
- News portals with numerous editorial sections and subsections
- SaaS products with complex feature sets needing organized access

**Avoid when:**

- Sites with fewer than 10-15 total navigation links (a simple dropdown suffices)
- Mobile-only applications where screen width is insufficient
- Single-purpose landing pages with minimal navigation needs
- Sites where simplicity and speed-of-access are paramount over breadth
- When analytics show users prefer search over browsing categories

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

**Do's ✅**
- Use `aria-haspopup="true"` and `aria-expanded` on trigger buttons
- Support keyboard navigation: Enter/Space to open, Escape to close, Arrow keys to move between items
- Include category headings as non-interactive labels (`role="presentation"` or heading elements)
- Ensure all links are reachable via Tab key within the open panel
- Close the panel when focus leaves the megamenu entirely
**Don'ts ❌**
- Don't open the megamenu only on hover without a click/keyboard alternative
- Don't trap focus inside the panel permanently — allow Tab to leave and close the menu
- Don't use custom roles incorrectly (avoid `role="menu"` unless implementing full menu keyboard pattern)

## Performance guardrails

### Target Metrics
- **Panel render:** < 100ms from trigger activation to visible panel
- **Hover intent delay:** 200-300ms to prevent accidental triggers
- **Animation:** 200ms at 60fps for open/close transitions
- **DOM nodes:** Minimize — lazy render panel content only on first open
- **Bundle size:** < 5KB for megamenu component logic
### Optimization Strategies
**Lazy Render Panel Content**
```javascript
const [hasOpened, setHasOpened] = useState(false);
const open = () => { setHasOpened(true); setIsOpen(true); };
// Only render panel DOM after first open
{hasOpened && }
```

## Common mistakes

### No Hover Intent Delay
**The Problem:**
The megamenu opens instantly on mouse enter, causing accidental triggers as users move across the navigation bar.

**How to Fix It:**
Add a 200-300ms hover intent delay before opening. Use a timer that cancels if the mouse leaves the trigger before the delay completes.

### Panel Closes When Moving Mouse to It
**The Problem:**
A gap between the trigger and the panel causes `mouseleave` to fire on the trigger before `mouseenter` fires on the panel, closing the menu.

**How to Fix It:**
Use a shared close delay (300ms) that is cancelled when the mouse enters the panel. Alternatively, create an invisible "bridge" element connecting the trigger to the panel.

### No Keyboard Navigation
**The Problem:**
Users can only access the megamenu with a mouse. Keyboard users cannot open, navigate, or close the panel.

**How to Fix It:**
Support Enter/Space to toggle, Escape to close, and Arrow keys or Tab to navigate between links. Return focus to the trigger on close.

## Related patterns

- https://uxpatterns.dev/patterns/navigation/hambuger-menu
- https://uxpatterns.dev/patterns/navigation/navigation-menu
- https://uxpatterns.dev/patterns/navigation/sidebar

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/navigation/megamenu
