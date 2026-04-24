---
name: checkout
description: "Learn how to implement checkout flows. Use when you need to multi-step checkout process."
user-invocable: true
triggers:
  - checkout
  - flow
metadata:
  id: checkout
  category: e-commerce
  pattern: Checkout Flow
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/e-commerce/checkout
  sourcePath: apps/web/content/patterns/e-commerce/checkout.mdx
---

# Checkout Flow

Multi-step checkout process

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Checkout Flow** pattern helps teams create a reliable way to guide shoppers from cart review to confirmed payment with as little friction as possible while preserving trust. It is most useful when teams need physical goods purchase.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell checkout-demo">
  <section class="card checkout-flow">
    <ol class="steps"><li class="active">Shipping</li><li>Payment</li><li>Review</li></ol>
    <div class="section-block"><strong>Shipping address</strong><p class="muted">123 Pattern Street, Toronto</p></div>
    <button type="button">Continue to payment</button>
  </section>
  <aside class="card summary">
    <strong>Order summary</strong>
    <p class="muted">2 items · Free shipping · Total $128</p>
  </aside>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Physical goods purchase
- Digital checkout and subscriptions
- Guest and returning buyer flows

**Avoid when:**

- Use a simpler purchase path when the item, buyer, and payment state are already known.
- Avoid forcing the full pattern when users only need a quick confirmation step.
- Do not optimize for conversion at the expense of price and policy clarity.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that checkout flow can be completed using keyboard alone.
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

- https://uxpatterns.dev/patterns/advanced/wizard
- https://uxpatterns.dev/patterns/e-commerce/shopping-cart
- https://uxpatterns.dev/patterns/forms/form-validation

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/e-commerce/checkout
