---
name: carousel
description: "Use when you need to display multiple items in a rotating view."
metadata:
  id: carousel
  category: content-management
  pattern: Carousel
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/content-management/carousel
  sourcePath: apps/web/content/patterns/content-management/carousel.mdx
---

# Carousel

Display multiple items in a rotating view

## What it solves

A **carousel** displays content or images in a rotating or sliding manner. Users navigate through content with arrows, dots, or swipe gestures on touch devices.
Carousels showcase featured content, promotions, or image galleries in limited space.

## When to use

Use carousels to display **related content or images in limited space** while keeping users engaged.
**Common use cases include:**
- Featured products or services need showcasing (homepage promotions)
- Key messages or storytelling require highlighting (step-by-step guides)
- Portfolio of work or case studies needs display
- Testimonials or customer reviews for presentation
- Multi-step processes or tutorials guide users
- News updates or event announcements get featured

## When to avoid

- Critical content needs immediate user interaction
- Content lacks clear relationship or narrative flow
- Users must compare items side-by-side or view all options at once
- Too many carousel items make navigation cumbersome
- Complex content requires significant reading time

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

When to use a tabbed carousel vs grouped carousel?
**Use a Tabbed Carousel When:**
- ✅ **You have a small number of slides** – Since each slide has a dedicated tab, a large number of slides can clutter the UI.
- ✅ **Users should be able to jump between slides easily** – Tabs allow direct navigation to any slide without needing to cycle through sequentially.
- ✅ **Your slides contain detailed, structured content** – If each slide functions as a self-contained panel (like feature descriptions, product highlights, or news sections), a tabbed interface enhances accessibility.
- ✅ **Users rely on assistive technologies** – Tabs follow a clear WAI-ARIA Tabs Pattern, making them easier to navigate via screen readers and keyboard interactions.
- ✅ **You want a more structured navigation experience** – Since users can visually scan and select a tab, they get a better sense of available content without guessing.
Example Use Cases for Tabbed Carousels:
- Showcasing key product features (e.g., "Performance," "Design," "Battery Life")
- Tabbed tutorials with each step being its own slide

## Performance guardrails

Target performance metrics for carousels:
- **First Contentful Paint**: < 1.5s for first slide
- **Slide transition**: < 300ms animation duration
- **Touch response**: < 100ms for swipe initiation
- **Image loading**: Lazy load slides 2+ to reduce initial payload
- **JavaScript bundle**: < 30KB for carousel functionality
- **Memory usage**: < 10MB additional for image carousel
- **CPU usage**: < 5% during idle, < 15% during transitions

## Common mistakes

### Auto-Play Without Controls
**The Problem:** Users might not have enough time to read or interact with content, and constantly rotating slides can disorient or frustrate them—especially those using assistive technologies.

**How to Fix It?** Always provide **pause/play controls**. Respect `prefers-reduced-motion` by disabling or slowing auto-rotation for users who prefer less animation.

### No Keyboard or Touch Support

**The Problem:** Carousels often exclude users who rely on keyboard navigation or expect swipe gestures on mobile devices.

**How to Fix It?** Ensure you can navigate slides via `Tab` and arrow keys. Add swipe or drag support for mobile. Test thoroughly across various devices and accessibility tools.

### Hiding Important Content in Later Slides

**The Problem:** Many users never click past the first slide, missing crucial information if it’s hidden further down the carousel.

**How to Fix It?** Place the most essential content **in the first slide**. If the content is critical, consider using a static layout or highlight it differently so users don’t need to scroll or click.

## Related patterns

- https://uxpatterns.dev/patterns/content-management/accordion
- https://uxpatterns.dev/patterns/content-management/expandable-text
- https://uxpatterns.dev/patterns/data-display/card-grid
- https://uxpatterns.dev/patterns/navigation/infinite-scroll
- https://uxpatterns.dev/patterns/navigation/load-more
- https://uxpatterns.dev/patterns/navigation/pagination
- https://uxpatterns.dev/patterns/navigation/tabs

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/content-management/carousel
