---
name: Pagination
description: "Use when implementing navigate through multiple pages of content."
metadata:
  id: pagination
  category: navigation
  pattern: Pagination
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/navigation/pagination
  sourcePath: apps/web/content/patterns/navigation/pagination.mdx
---

# Pagination

Navigate through multiple pages of content

## What it solves

**[Pagination](/glossary/pagination)** divides large content collections into manageable chunks or pages.
Users navigate through data sets, search results, or product listings without getting overwhelmed by too much information at once.
Pagination works well, but consider alternatives like [infinite scroll](/patterns/navigation/infinite-scroll) or ["Load More"](/patterns/navigation/load-more) buttons for certain content types. Your choice between pagination and infinite scroll depends on content nature, user behavior, and interface goals.

## When to use

Use pagination when content needs structured, progressive loading for smoother user experience and better performance.
Pagination helps users navigate large information sets without getting overwhelmed.
**Common scenarios include:**
- **Content lists** need browsing (search results, blog archives, product listings)
- **Page performance** improves by loading smaller content segments
- **User clarity** increases when large data sets become easier to navigate
- **Sequential content** requires navigation (multi-page tutorials or articles)

## When to avoid

- All content fits better on a single page (short lists or summaries)
- [Infinite scroll](/patterns/navigation/infinite-scroll) or ["load more"](/patterns/navigation/load-more) patterns suit the experience better
- Users need continuous comparison between items on different pages

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### ARIA Attributes
**Required [ARIA Attributes](/glossary/aria-attributes):**
- The container should use role="navigation" with an appropriate aria-label (e.g., "Pagination Navigation").
- Each pagination item should include aria-labels indicating the respective page number.
- Indicate the current page using aria-current="page".
### Keyboard Interaction Pattern
The following table outlines the standard keyboard interactions for pagination components:
| Key         | Action                                                   |
| ----------- | -------------------------------------------------------- |
| Tab         | Navigate among pagination controls and page buttons      |

## Performance guardrails

### Target Metrics
**Response Times:**
- **Page change initiation:** < 100ms after click
- **Content load start:** < 200ms
- **Full page render:** < 1000ms (ideal), < 2000ms (acceptable)
- **Animation duration:** 200-300ms for transitions
**Data Loading:**
- **Prefetch strategy:** Load adjacent pages in background
- **Cache duration:** 5 minutes for recently viewed pages
- **Request size:** < 50KB per page of data

## Common mistakes

### **No Indication of Total Pages**
**The Problem:**
Users can't gauge content size or their progress.

**How to Fix It:**
Show total page count or items ("Page 3 of 12" or "Showing 21-30 of 120 items").

### **Missing Current Page Highlight**
**The Problem:**
Users lose track of their current page, especially after scrolling.

**How to Fix It:**
Distinguish the active page with contrasting colors, borders, or size.

### **Tiny Click Targets**
**The Problem:**
Page numbers and controls are too small for easy clicking, especially on mobile.

**How to Fix It:**
Use minimum 44x44px touch targets with adequate spacing between elements.

## Related patterns

- https://uxpatterns.dev/patterns/navigation/infinite-scroll
- https://uxpatterns.dev/patterns/navigation/load-more
- https://uxpatterns.dev/patterns/navigation/tabs

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/navigation/pagination
