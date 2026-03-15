---
name: drag-and-drop
description: "Use when implementing allow users to reorder items intuitively."
metadata:
  id: drag-and-drop
  category: content-management
  pattern: Drag and Drop
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/content-management/drag-and-drop
  sourcePath: apps/web/content/patterns/content-management/drag-and-drop.mdx
---

# Drag and Drop

Allow users to reorder items intuitively

## What it solves

A **Drag and Drop** pattern helps teams create a reliable way to let users move or reorder items spatially while preserving clear feedback, keyboard alternatives, and safe recovery. It is most useful when teams need sortable lists and priorities.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## When to use

- Sortable lists and priorities
- Moving cards across stages
- Upload or placement gestures

## When to avoid

- Use explicit buttons or menus when direct manipulation would be harder to learn.
- Avoid gesture-heavy behavior if the surface must work well with keyboard-only use.
- Do not require drag or hover when a clearer alternative exists.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that drag and drop can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.
### Screen Reader Support
- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.
### Visual Accessibility
- [ ] Do not rely on color alone to convey severity, completion, or selection state.

## Performance guardrails

- Avoid re-rendering the entire collection on every pointer move when only the placeholder position needs to change.
- Use stable item heights or preview geometry so the list does not shift unpredictably during a drag.
- Throttle expensive collision or ordering calculations when the surface contains many items.

## Common mistakes

### **Designing only the happy path**

**The Problem:**
The pattern feels polished until loading, empty, and failure states appear.

**How to Fix It?**
Specify the full lifecycle alongside the default state so implementation does not improvise later.

### **Letting interaction and content drift apart**

**The Problem:**
Users work harder when controls, status, and supporting information feel disconnected.

**How to Fix It?**
Keep the information architecture of the pattern close to the interaction model.

### **Treating accessibility as a final pass**

**The Problem:**
Keyboard, announcement, and reading-order issues become expensive once the interaction is already fixed.

**How to Fix It?**
Bake semantics, focus behavior, and announcements into the first implementation.

## Related patterns

- https://uxpatterns.dev/patterns/data-display/kanban-board
- https://uxpatterns.dev/patterns/data-display/list-view
- https://uxpatterns.dev/patterns/media/image-upload

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/content-management/drag-and-drop
