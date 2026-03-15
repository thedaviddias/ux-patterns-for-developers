---
name: load-more
description: "Use when implementing load additional content on user demand."
metadata:
  id: load-more
  category: navigation
  pattern: Load More
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/navigation/load-more
  sourcePath: apps/web/content/patterns/navigation/load-more.mdx
---

# Load More

Load additional content on user demand

## What it solves

**Load More** lets users request additional content dynamically instead of loading everything upfront. This pattern cuts initial page load times and gives users seamless access to more content when they need it.

## When to use

Use Load More when users should explore content progressively at their own pace without getting overwhelmed. Unlike infinite scrolling, Load More gives users clear control and lets them consciously decide when to view more items.
For better usability, make sure the Load More button gets **removed when all content is loaded** or updates to show that no additional items remain (like **"No More Results"**).
**Common scenarios include:**
- Large lists of content need pagination (news feeds, product listings)
- Page performance improves by loading only a subset of data initially
- Users browse progressively instead of needing all content at once
- You want an alternative to infinite scrolling with more user control

## When to avoid

- The full content list is small enough to load upfront without performance issues
- Users need to compare multiple items at once ([pagination](/patterns/navigation/pagination) works better here)
- Real-time updates or continuous data streaming is required

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### ARIA Attributes
**Required ARIA attributes:**
- Use `aria-controls` to associate the **Load More** button with the content being updated.
- Announce loading states with `aria-live="polite"`.
- If the button is removed after loading all content, update its `aria-label` to indicate that no more content is available.
### Screen Reader Support
**Implementation considerations:**
- Users should be informed when new content is added.
- Ensure proper tab focus order when new items appear.
- Use accessible button elements (`<button>` instead of `<div>` or `<span>`).

## Performance guardrails

**Target Metrics:**
- **Initial button render**: < 50ms after page load
- **Loading state feedback**: < 100ms after click (immediate visual response)
- **Content fetch time**: 200-500ms for typical batch (10-20 items)
- **[DOM](/glossary/dom) update after fetch**: < 100ms for smooth insertion
- **Total time to new content visible**: < 600ms ideal, < 1000ms acceptable
**Memory Considerations:**
- **Items per batch**: 10-20 items optimal (balance between requests and memory)
- **DOM nodes**: Monitor total count, consider virtualization after 100+ items
- **Image [lazy loading](/glossary/lazy-loading)**: Load images only when approaching [viewport](/glossary/viewport)

## Common mistakes

### No Visual Feedback
**The Problem:**
Users think the button broke if nothing happens immediately after clicking.

**How to Fix It?**
Add a **spinner or loading animation** and consider disabling the button until new content fully loads.

### Loading Too Many Items at Once
**The Problem:**
Large content batches slow performance, cause layout shifts, and overwhelm users.

**How to Fix It?**
Load **smaller chunks** (10–20 items per click). Use incremental updates instead of one large data fetch.

### Forcing Excessive Load More Clicks
**The Problem:**
Repeated Load More clicks frustrate users and make pages feel unresponsive.

**How to Fix It?**
Try **auto-loading on scroll** after a few manual loads, or increase batch size when you detect high engagement.

## Related patterns

- https://uxpatterns.dev/patterns/content-management/accordion
- https://uxpatterns.dev/patterns/forms/button
- https://uxpatterns.dev/patterns/navigation/infinite-scroll
- https://uxpatterns.dev/patterns/navigation/pagination

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/navigation/load-more
