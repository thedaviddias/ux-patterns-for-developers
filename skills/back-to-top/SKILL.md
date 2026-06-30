---
name: back-to-top
description: "Implement a Back to Top button for enhanced navigation on long pages with best practices for placement and accessibility. Use when you need to quickly navigate back to the top of the page."
user-invocable: true
triggers:
  - back
  - top
metadata:
  id: back-to-top
  category: navigation
  pattern: Back to Top
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/navigation/back-to-top
  sourcePath: apps/web/content/patterns/navigation/back-to-top.mdx
---

# Back to Top

Quickly navigate back to the top of the page

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

**Back to Top** gives users a quick way back to the page top after scrolling through lengthy or [infinite content](/patterns/navigation/infinite-scroll).
This floating button or link typically sits at the bottom-right corner, improving navigation and user experience.

## When to use and when to avoid

**Use when:**

Use **Back to Top** to **help users quickly return to long page tops without excessive scrolling**.
**Common scenarios include:**
- Long or content-heavy pages where users scroll far down
- Quick navigation back to headers or navigation menus is essential
- Blogs, documentation pages, or e-commerce category listings need extensive scrolling

**Avoid when:**

- Very short pages with minimal or unnecessary scrolling
- Your layout already has persistent bottom navigation or sticky top menus
- Pages without infinite scrolling where scrolling isn't an issue

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

**Do's ✅**
- Ensure the button is keyboard-focusable and can be activated via Enter or Space
- Provide sufficient color contrast between the button and its background
- Use an appropriate aria-label or descriptive text for screen readers
- Manage focus: after scrolling up, keep the user informed or maintain logical focus
**Don'ts ❌**
- Don't hide it behind complex interactions or animations
- Don't place it in a position that overlaps other important UI elements
- Don't disable focus outlines without providing an alternative focus style

## Performance guardrails

### Performance Metrics
**Target Metrics:**
- **Scroll trigger threshold**: Show after 2x viewport height (or ~1000px)
- **Scroll animation duration**: 300-500ms for smooth feel
- **Button fade-in**: < 200ms transition
- **Interaction delay**: < 50ms response to click
- **Frame rate**: Maintain 60fps during scroll animation
**Scroll Performance:**
- **Throttle scroll events**: Check position every 100-150ms (not on every scroll)
- **Use Intersection Observer**: More performant than scroll listeners

## Common mistakes

### Always Visible on Short Pages
**The Problem:**
Showing the Back to Top button on pages that don't require scrolling or have minimal content creates unnecessary UI clutter.

**How to Fix It:**
Only display the button after the user has scrolled at least 2x the viewport height or a minimum of 1000px.

### Jarring Jump Without Animation
**The Problem:**
Instantly jumping to the top without smooth scrolling can disorient users and make them lose context.

**How to Fix It:**
Implement smooth scrolling with `scroll-behavior: smooth` or JavaScript animation with appropriate duration (300-500ms).

### Poor Button Visibility
**The Problem:**
Using low contrast colors or making the button too small/transparent makes it hard to notice or click.

**How to Fix It:**
Ensure sufficient color contrast (WCAG AA minimum) and use a minimum touch target of 44x44px.

### Blocking Important Content
**The Problem:**
Placing the button where it covers important interactive elements like chat widgets or cookie banners.

**How to Fix It:**
Carefully position the button to avoid overlapping with other floating elements, adjusting position dynamically if needed.

### Missing Keyboard Support
**The Problem:**
Button only works with mouse/touch, excluding keyboard users from using the feature.

**How to Fix It:**
Ensure the button is keyboard accessible, focusable with Tab, and activatable with Enter/Space keys.

### No Visual Feedback on Interaction
**The Problem:**
Button doesn't provide hover, focus, or active states, leaving users uncertain if their interaction registered.

**How to Fix It:**
Implement clear visual states for all interactions including hover, focus, active, and disabled states.

## Related patterns

- https://uxpatterns.dev/patterns/navigation/breadcrumb
- https://uxpatterns.dev/patterns/navigation/infinite-scroll
- https://uxpatterns.dev/patterns/navigation/pagination

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/navigation/back-to-top
