---
name: tabs
description: "Create accessible tab interfaces with keyboard navigation, ARIA attributes, and responsive design patterns. Use when you need to switch between different views."
user-invocable: true
triggers:
  - tabs
metadata:
  id: tabs
  category: navigation
  pattern: Tabs
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/navigation/tabs
  sourcePath: apps/web/content/patterns/navigation/tabs.mdx
---

# Tabs

Switch between different views

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

**Tabs** organize content into multiple panels that share the same space, allowing users to switch between views without leaving the page. Only one tab panel is visible at a time, while the tab list provides persistent indicators of all available sections.
Tabs reduce information overload by letting users focus on one content section at a time while keeping the full set of options visible and reachable with a single click or keyboard press.

## When to use and when to avoid

**Use when:**

Use **Tabs** to **organize related content into parallel sections at the same hierarchy level where users benefit from switching between views**.
**Common scenarios include:**
- Product pages with Description, Specifications, and Reviews sections
- Settings pages with General, Security, Notifications, and Billing tabs
- Dashboard widgets with different data views (Chart, Table, Summary)
- Code editors showing different files or language previews (HTML, CSS, JS)
- User profiles with Activity, Projects, and Settings sections

**Avoid when:**

- Content that users need to see simultaneously for comparison (use side-by-side layout)
- Sequential steps that must be completed in order (use a [wizard](/patterns/advanced/wizard) or stepper)
- Navigation between entirely different pages (use a [navigation menu](/patterns/navigation/navigation-menu))
- When there are only 2 options (consider a toggle or segmented control instead)
- When there are more than 7-8 tabs (consider a sidebar or vertical navigation)

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

**Do's ✅**
- Use `role="tablist"` on the tab container, `role="tab"` on each tab, and `role="tabpanel"` on each panel
- Set `aria-selected="true"` on the active tab and `aria-selected="false"` on inactive tabs
- Connect tabs to panels with `aria-controls` (on tab) and `aria-labelledby` (on panel)
- Manage focus with `tabindex`: active tab gets `0`, inactive tabs get `-1`
- Support Arrow Left/Right to move between tabs, Home/End to jump to first/last
- Add `tabindex="0"` to the active panel so users can Tab into the content
**Don'ts ❌**
- Don't use Tab key to navigate between tabs — Arrow keys are the correct pattern per WAI-ARIA
- Don't use links (`<a>`) for tabs unless they navigate to a different URL

## Performance guardrails

### Target Metrics
- **Tab switch:** < 50ms from click to visible panel
- **Initial render:** < 100ms for the full tab interface
- **Keyboard response:** < 16ms focus change on Arrow key press
- **Panel content:** Lazy load heavy content only when the tab is first activated
- **Bundle size:** < 3KB for tab component logic with styles
### Optimization Strategies
**Keep All Panels in DOM (Hidden)**
```html
<!-- Better than removing from DOM — preserves state -->
<div role="tabpanel" hidden>...</div>
```

## Common mistakes

### Using Tab Key to Navigate Between Tabs
**The Problem:**
Making each tab focusable with `tabindex="0"` forces keyboard users to Tab through every tab before reaching the content.

**How to Fix It:**
Use `tabindex="-1"` on inactive tabs and `tabindex="0"` only on the active tab. Navigate between tabs with Arrow Left/Right keys.

### Missing ARIA Roles
**The Problem:**
Using `<div>` or `<button>` without `role="tab"`, `role="tablist"`, or `role="tabpanel"` makes the tab interface invisible to screen readers.

**How to Fix It:**
Apply the full ARIA tab pattern: `role="tablist"` on the container, `role="tab"` on each trigger, `role="tabpanel"` on each content area, with `aria-controls` and `aria-labelledby` connections.

### Tabs That Navigate to Different URLs
**The Problem:**
Using tabs for page-level navigation causes full page reloads, breaking the instant-switch expectation of tab interfaces.

**How to Fix It:**
Use a [navigation menu](/patterns/navigation/navigation-menu) for page-level navigation. Tabs should switch in-page content without a page load. If URL sync is needed, use hash fragments.

## Related patterns

- https://uxpatterns.dev/patterns/advanced/wizard
- https://uxpatterns.dev/patterns/content-management/accordion
- https://uxpatterns.dev/patterns/navigation/navigation-menu
- https://uxpatterns.dev/patterns/navigation/sidebar

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/navigation/tabs
