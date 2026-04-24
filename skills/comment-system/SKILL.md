---
name: comment-system
description: "Learn how to implement comment systems. Use when you need to user comments and discussion threads."
user-invocable: true
triggers:
  - comment
  - system
metadata:
  id: comment-system
  category: social
  pattern: Comment System
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/social/comment-system
  sourcePath: apps/web/content/patterns/social/comment-system.mdx
---

# Comment System

User comments and discussion threads

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Comment System** pattern helps teams create a reliable way to support threaded discussion around content while keeping moderation, authorship, and recovery visible. It is most useful when teams need article and discussion comments.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell card comment-card">
  <label for="comment-box">Add a comment</label>
  <textarea id="comment-box" rows="4" placeholder="Share context or ask a follow-up question."></textarea>
  <button type="button">Post comment</button>
  <article class="thread-item">
    <strong>Jordan</strong>
    <p class="muted">We should show the error summary only after submit, not on every keypress.</p>
  </article>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Article and discussion comments
- Team review threads
- Support and community conversations

**Avoid when:**

- Avoid social or engagement mechanics when they do not create real user value.
- Do not add public counts or visibility states without understanding the trust implications.
- Do not ship the surface without moderation, abuse, or reversal planning.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that comment system can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.
### Screen Reader Support
- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.
### Visual Accessibility
- [ ] Do not rely on color alone to convey severity, completion, or selection state.

## Common mistakes

### **Treating trust as secondary UI**

**The Problem:**
Counts, totals, identities, and policies are often the main thing users are checking before acting.

**How to Fix It?**
Design trust signals into the main hierarchy instead of leaving them as tiny secondary text.

### **Over-optimizing for the first click**

**The Problem:**
Aggressive prompts can increase taps while harming completion quality or long-term trust.

**How to Fix It?**
Measure the full journey, including reversals, refunds, reports, and hidden dissatisfaction.

### **Ignoring abuse and fraud paths**

**The Problem:**
Social and commerce surfaces invite misuse as soon as they create visible value.

**How to Fix It?**
Plan rate limits, authorization checks, moderation, and audit trails as part of the pattern itself.

## Related patterns

- https://uxpatterns.dev/patterns/forms/textarea
- https://uxpatterns.dev/patterns/social/activity-feed
- https://uxpatterns.dev/patterns/user-feedback/notification

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/social/comment-system
