---
name: infinite-scroll
description: "Create seamless content loading with infinite scroll, focusing on performance, accessibility, and user experience best practices. Use when you need to loads additional content automatically as users scroll down. Triggers: continuous scrolling."
user-invocable: true
triggers:
  - infinite
  - scroll
  - continuous scrolling
metadata:
  id: infinite-scroll
  category: navigation
  pattern: Infinite scroll
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/navigation/infinite-scroll
  sourcePath: apps/web/content/patterns/navigation/infinite-scroll.mdx
---

# Infinite scroll

Loads additional content automatically as users scroll down.

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

**Infinite Scroll** is a UI pattern that dynamically loads more content as users scroll down a page, eliminating the need for [pagination](/glossary/pagination) or manual interaction. It provides a seamless browsing experience by continuously appending new items to the current view.
This pattern is commonly used in **social media feeds, search results, and content-heavy websites** to keep users engaged without interruptions.

## When to use and when to avoid

**Use when:**

Use Infinite Scroll when you need to dynamically load more content as users scroll without requiring manual pagination.
**Common scenarios include:**
- **Social media feeds** – e.g., Twitter, Instagram, Facebook, where users consume an endless stream of content.
- **News and blog sites** – e.g., showing a continuous stream of articles.
- **E-commerce product listings** – e.g., dynamically loading more items as users explore the catalog.
- **Search results** – e.g., reducing friction in discovering relevant items.
- **Media galleries** – e.g., loading more images/videos as users scroll.

**Avoid when:**

- **When users need to find specific content quickly** – Paginated results may be more efficient.
- **For structured navigation** – If users need to compare items or revisit previous results, pagination provides better control.
- **If performance is a concern** – Infinite scroll can lead to high memory usage and slow rendering.
- **For content requiring user actions** – If users frequently need to interact with elements (e.g., filling forms), infinite scrolling can be disruptive.
- **When reaching the footer is important** – Users may struggle to access footer content if new items keep loading.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

**Do's ✅**
- **Ensure content is focusable** – New items should be reachable via [keyboard navigation](/glossary/keyboard-navigation).
- **Announce new content dynamically** using ARIA [live regions](/glossary/live-regions) (`aria-live="polite"`).
- **Provide an alternative to infinite scrolling** – Offer pagination or a "Load More" option.
- **Ensure users can pause or stop loading** – Unexpected content updates can be disorienting.
**Don'ts ❌**
- **Avoid relying solely on scrolling** – Users with assistive technologies may need alternative navigation.
- **Don't change content order unexpectedly** – Screen readers should process content sequentially.

## Related patterns

- https://uxpatterns.dev/patterns/navigation/load-more
- https://uxpatterns.dev/patterns/navigation/pagination

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/navigation/infinite-scroll
