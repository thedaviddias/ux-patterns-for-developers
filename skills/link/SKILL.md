---
name: link
description: "Use when you need to create accessible and interactive links."
metadata:
  id: link
  category: navigation
  pattern: Link
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/navigation/link
  sourcePath: apps/web/content/patterns/navigation/link.mdx
---

# Link

Create accessible and interactive links

## What it solves

**Links** are the fundamental building blocks of web navigation, connecting pages, resources, and actions through clickable text or elements. They are the most basic and ubiquitous interactive pattern on the web.
Getting links right means choosing between `<a>` and `<button>`, styling clear interactive states, ensuring color contrast, and providing context about where the link leads — especially for external destinations, downloads, and new-tab behavior.

## When to use

Use **Links** to **navigate users to another page, resource, or section within the current page**.
**Common scenarios include:**
- Navigating to a different page within the same site
- Linking to external websites or resources
- Jumping to a section within the current page (anchor links)
- Downloading a file (PDFs, images, documents)
- Linking to email addresses (`mailto:`) or phone numbers (`tel:`)

## When to avoid

- Triggering an in-page action (use a `<button>` instead)
- Submitting a form (use `<button type="submit">`)
- Toggling UI state like opening a modal or expanding an accordion
- When the action doesn't have a meaningful URL destination
- As a wrapper around large interactive areas (use a card pattern with a single anchor)

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

**Do's ✅**
- Use the native `<a>` element with a valid `href` for all navigation links
- Ensure a 4.5:1 contrast ratio between link text and background (WCAG AA)
- Provide a non-color visual cue (underline, icon) to distinguish links from surrounding text
- Add `aria-label` or `aria-describedby` when the visible text is insufficient (e.g., icon-only links)
- Warn users when a link opens in a new tab (`target="_blank"`) with visible text or `aria-label`
- Include a skip navigation link as the first focusable element on every page
**Don'ts ❌**
- Don't use `<span>` or `<div>` with click handlers as a link substitute
- Don't remove the default focus outline without providing a visible alternative

## Performance guardrails

### Target Metrics
- **Interaction response:** < 50ms visual feedback on hover/focus
- **Navigation start:** Browser navigation should begin immediately on click (native behavior)
- **Focus outline render:** Immediate (< 16ms)
- **Bundle size:** 0KB JavaScript for basic links (pure HTML/CSS)
### Optimization Strategies
**Prefetching for Internal Links**
```html
<link rel="prefetch" href="/pricing" />
<!-- Or use framework-specific prefetch on hover -->
```

## Common mistakes

### Using "Click Here" as Link Text
**The Problem:**
Screen readers can list all links on a page. Multiple "click here" links are meaningless out of context.

**How to Fix It:**
Write descriptive link text. Instead of "Click here to view pricing", write "View pricing plans".

### Using a Link When a Button Is Needed
**The Problem:**
A link with `href="#"` or `javascript:void(0)` that triggers a JavaScript action instead of navigating. Breaks expected browser behavior.

**How to Fix It:**
Use `<button>` for in-page actions. Use `<a>` only when there is a real URL destination.

### Missing New-Tab Warning
**The Problem:**
Links with `target="_blank"` open in a new tab without warning, disorienting users — especially screen reader users.

**How to Fix It:**
Add visible text like "(opens in new tab)" or use `aria-label` to include the warning: `aria-label="W3C guidelines (opens in new tab)"`.

## Related patterns

- https://uxpatterns.dev/patterns/forms/button
- https://uxpatterns.dev/patterns/navigation/breadcrumb
- https://uxpatterns.dev/patterns/navigation/navigation-menu

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/navigation/link
