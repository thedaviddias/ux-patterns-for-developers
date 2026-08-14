---
name: command-palette
description: "Learn how to implement command palettes. Use when you need to quick command execution interface."
user-invocable: true
triggers:
  - command
  - palette
metadata:
  id: command-palette
  category: advanced
  pattern: Command Palette
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/advanced/command-palette
  sourcePath: apps/web/content/patterns/advanced/command-palette.mdx
---

# Command Palette

Quick command execution interface

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Command Palette** pattern helps teams create a reliable way to find and run commands, destinations, and recent items from a single keyboard-first surface. It is most useful when teams need editor and workspace commands.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell card palette">
  <p class="muted">Press <kbd>⌘</kbd> + <kbd>K</kbd> in many apps to open a command palette.</p>
  <input id="palette-input" type="search" placeholder="Search commands" />
  <ul id="palette-list">
    <li>Open settings</li>
    <li>Create workspace</li>
    <li>Invite teammate</li>
    <li>Search patterns</li>
  </ul>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Editor and workspace commands
- Settings and preference shortcuts
- Object or [page navigation](/glossary/pagination) for power users

**Avoid when:**

- Use a simpler visible navigation or single-page flow when the product surface is still small.
- Avoid advanced interaction patterns if the team cannot support their state complexity well.
- Do not introduce hidden power-user behavior before the plain path is already strong.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that command palette can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.
### Screen Reader Support
- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.
### Visual Accessibility
- [ ] Do not rely on color alone to convey severity, completion, or selection state.

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

- https://uxpatterns.dev/patterns/content-management/modal
- https://uxpatterns.dev/patterns/forms/search-field
- https://uxpatterns.dev/patterns/navigation/navigation-menu

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/advanced/command-palette
