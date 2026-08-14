---
name: activity-feed
description: "Learn how to implement activity feeds. Use when you need to social activity and updates stream."
user-invocable: true
triggers:
  - activity
  - feed
metadata:
  id: activity-feed
  category: social
  pattern: Activity Feed
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/social/activity-feed
  sourcePath: apps/web/content/patterns/social/activity-feed.mdx
---

# Activity Feed

Social activity and updates stream

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Activity Feed** pattern helps teams create a reliable way to surface recent actions in a chronological stream so users can monitor what changed without visiting each item separately. It is most useful when teams need project and team updates.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## When to use and when to avoid

**Use when:**

- Project and team updates
- Community or social streams
- Audit and changelog-style feeds

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
- [ ] Verify that activity feed can be completed using keyboard alone.
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

- https://uxpatterns.dev/patterns/navigation/infinite-scroll
- https://uxpatterns.dev/patterns/social/comment-system
- https://uxpatterns.dev/patterns/user-feedback/notification

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/social/activity-feed
