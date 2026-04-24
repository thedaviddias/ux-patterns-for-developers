---
name: image-gallery
description: "Learn how to implement image galleries. Use when you need to display and browse image collections."
user-invocable: true
triggers:
  - image
  - gallery
metadata:
  id: image-gallery
  category: media
  pattern: Image Gallery
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/media/image-gallery
  sourcePath: apps/web/content/patterns/media/image-gallery.mdx
---

# Image Gallery

Display and browse image collections

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Image Gallery** pattern helps teams create a reliable way to help users browse several related images without losing orientation, context, or performance. It is most useful when teams need portfolio and gallery pages.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell card gallery-card">
  <div class="viewer" id="gallery-viewer">Living room view</div>
  <div class="thumbs">
    <button type="button" data-view="Living room view">1</button>
    <button type="button" data-view="Kitchen detail">2</button>
    <button type="button" data-view="Bedroom layout">3</button>
  </div>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Portfolio and gallery pages
- Product image collections
- Documentation screenshots and walkthroughs

**Avoid when:**

- Use a simpler image, link, or file input if full media handling is not actually needed.
- Avoid rich custom controls when browser-native behavior is enough for the task.
- Do not assume network-heavy media is appropriate for every audience or context.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that image gallery can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.
### Screen Reader Support
- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.
### Visual Accessibility
- [ ] Do not rely on color alone to convey severity, completion, or selection state.

## Common mistakes

### **Treating media as decoration only**

**The Problem:**
Important uploads and playback flows break when the design assumes the media is just visual garnish.

**How to Fix It?**
Design state, metadata, and controls as first-class parts of the pattern, not as overlays added later.

### **Skipping fallback behavior**

**The Problem:**
Different devices support different codecs, capture flows, and bandwidth envelopes.

**How to Fix It?**
Plan graceful fallbacks for unsupported APIs, low data conditions, and failed loads.

### **Forgetting accessibility artifacts**

**The Problem:**
Media patterns become exclusionary quickly when captions, transcripts, alt text, or visible status are missing.

**How to Fix It?**
Treat alternate access paths as part of the core experience, not as post-launch polish.

## Related patterns

- https://uxpatterns.dev/patterns/content-management/carousel
- https://uxpatterns.dev/patterns/content-management/modal
- https://uxpatterns.dev/patterns/media/image-upload

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/media/image-gallery
