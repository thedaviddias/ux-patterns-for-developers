---
name: Product Card
description: "Use when implementing product display cards for e-commerce."
metadata:
  id: product-card
  category: e-commerce
  pattern: Product Card
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/e-commerce/product-card
  sourcePath: apps/web/content/patterns/e-commerce/product-card.mdx
---

# Product Card

Product display cards for e-commerce

## What it solves

A **Product Card** pattern helps teams create a reliable way to summarize a product clearly enough that users can decide whether to inspect it, compare it, or add it immediately. It is most useful when teams need category and search result listings.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## When to use

- Category and search result listings
- Recommendation shelves
- Quick-buy merchandising

## When to avoid

- Use a simpler purchase path when the item, buyer, and payment state are already known.
- Avoid forcing the full pattern when users only need a quick confirmation step.
- Do not optimize for conversion at the expense of price and policy clarity.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that product card can be completed using keyboard alone.
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

- https://uxpatterns.dev/patterns/data-display/card-grid
- https://uxpatterns.dev/patterns/data-display/comparison-table
- https://uxpatterns.dev/patterns/e-commerce/shopping-cart

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/e-commerce/product-card
