# Share Dialog

> Learn how to implement share dialogs. Discover best practices for social media integration, copy links, and sharing analytics.

**URL:** https://uxpatterns.dev/patterns/social/share-dialog
**Source:** apps/web/content/patterns/social/share-dialog.mdx

---

## Overview

A **Share Dialog** pattern helps teams create a reliable way to bundle copy, native share, and explicit destination actions into one predictable handoff surface. It is most useful when teams need copying and sharing links.

Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Use Cases

### When to use:

- Copying and sharing links
- Native mobile share handoff
- Referral or invite flows

### When not to use:

- Avoid social or engagement mechanics when they do not create real user value.
- Do not add public counts or visibility states without understanding the trust implications.
- Do not ship the surface without moderation, abuse, or reversal planning.

### Common scenarios and examples

- Copying and sharing links where users need a clear, repeatable interface model.
- Native mobile share handoff where users need a clear, repeatable interface model.
- Referral or invite flows where users need a clear, repeatable interface model.

## Benefits

- Clarifies how share dialog should behave before implementation details begin to sprawl.
- Creates a reusable interaction model for teams who need to bundle copy, native share, and explicit destination actions into one predictable handoff surface.
- Makes accessibility, edge cases, and recovery paths part of the design instead of post-launch cleanup.
- Gives product, design, and engineering a shared language for evaluating trade-offs.

## Drawbacks

- State needs to stay consistent across sessions, devices, and sometimes anonymous users.
- Metrics can distort the experience if every surface is optimized only for engagement or conversion.
- Abuse, fraud, or misuse pressure must be planned for early.
- Trust drops quickly when counts, totals, or status badges feel inaccurate.

## Anatomy

```mermaid
flowchart TB
Root[Share Dialog] --> A[Share trigger]
Root --> B[Destination actions]
Root --> C[Copy link action]
Root --> D[Share preview]
Root --> E[Completion feedback]
```

### Component Structure

1. **Share trigger**

- Opens the dialog or native share sheet.

2. **Destination actions**

- Offer a small set of relevant share targets.

3. **Copy link action**

- Provides a universal fallback that always works.

4. **Share preview**

- Confirms what will be shared.

5. **Completion feedback**

- Tells users when a link was copied or a handoff started.

#### Summary of Components

| Component | Required? | Purpose |
| --- | --- | --- |
| Share trigger | ✅ Yes | Opens the dialog or native share sheet. |
| Destination actions | ✅ Yes | Offer a small set of relevant share targets. |
| Copy link action | ✅ Yes | Provides a universal fallback that always works. |
| Share preview | ❌ No | Confirms what will be shared. |
| Completion feedback | ❌ No | Tells users when a link was copied or a handoff started. |

## Variations

### Native share first

Uses platform share APIs where available.

**When to use:** Use when the device ecosystem supports it well.

### Dialog-based sharing

Keeps explicit destination options inside the product.

**When to use:** Use when analytics or custom referral parameters matter.

### Copy-link dominant flow

Makes copying the primary action and keeps other destinations secondary.

**When to use:** Use when link sharing is the most common behavior.

## Best Practices

### Content

**Do's ✅**

- Explain the outcome of the action in language users understand immediately.
- Surface the next useful action without burying key details.
- Keep counts, prices, and status indicators synchronized with visible state.

**Don'ts ❌**

- Do not gamify high-stakes actions through unclear labels or manipulative copy.
- Do not hide moderation, pricing, or policy details users need before acting.
- Do not assume optimistic updates will always succeed.

### Accessibility

**Do's ✅**

- Verify that share dialog can be completed using keyboard alone.
- Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- Preserve a visible focus state that is still readable at high zoom.
- Use semantic elements first, then add ARIA only where semantics alone are not enough.
- Announce state changes such as errors, loading, or completion in the right place and with the right politeness.

**Don'ts ❌**

- Do not remove focus styles without a visible replacement.
- Do not depend on placeholder or helper text that disappears before the user can act on it.
- Do not assume pointer, touch, and assistive technologies will all interact with the pattern the same way.

### Visual Design

**Do's ✅**

- Show trust-building signals such as state, identity, or pricing close to the action.
- Reserve strong color and badges for meaningful status changes.
- Design reversible actions differently from permanent ones.

**Don'ts ❌**

- Do not make primary and destructive actions look interchangeable.
- Do not use motion that implies completion before the system has confirmed it.
- Do not let promotional content overpower core task information.

### Layout & Positioning

**Do's ✅**

- Keep identity, object details, and actions close enough to scan together.
- Test the pattern in crowded feeds, lists, and summary views.
- Preserve space for moderation, legal, or transactional details where needed.

**Don'ts ❌**

- Do not hide critical next steps below large promotional modules.
- Do not split state changes across too many disconnected panels.
- Do not assume a desktop purchase or engagement flow will translate directly to mobile.

## Security Considerations

- Protect state-changing actions with real authorization checks rather than relying on hidden controls alone.
- Plan for optimistic updates to fail and make rollback or reconciliation visible.
- Store audit-relevant events such as checkout attempts, moderation actions, or abuse reports in a way the product team can actually inspect later.

## Tracking

- Track impressions, primary actions, reversals, and error states for share dialog separately so the team can see where the pattern succeeds or fails.
- Measure completed outcomes, not just taps or opens, especially when the pattern can be reversed or abandoned later.
- Annotate experiments and rollout changes so spikes in engagement or conversion are interpretable.

## Common Mistakes & Anti-Patterns 🚫

### **Treating trust as secondary UI**

**The Problem:**
Counts, totals, identities, and policies are often the main thing users are checking before acting.

**How to Fix It?**
Design trust signals into the main hierarchy instead of leaving them as tiny secondary text.

---

### **Over-optimizing for the first click**

**The Problem:**
Aggressive prompts can increase taps while harming completion quality or long-term trust.

**How to Fix It?**
Measure the full journey, including reversals, refunds, reports, and hidden dissatisfaction.

---

### **Ignoring abuse and fraud paths**

**The Problem:**
Social and commerce surfaces invite misuse as soon as they create visible value.

**How to Fix It?**
Plan rate limits, authorization checks, moderation, and audit trails as part of the pattern itself.

## Examples

### Live Preview

### Basic Implementation

```html
<div class="demo-shell card share-card">
  <button type="button" id="share-copy">Copy link</button>
  <div id="share-status" class="muted">Copy the current page or open a platform-native share flow.</div>
</div>
```

### What this example demonstrates

- A clear baseline implementation of share dialog that can be reviewed without framework-specific noise.
- Visible state, spacing, and content hierarchy that mirror the implementation guidance above.
- A small enough surface to copy into a design review or prototype before scaling the pattern up.

### Implementation Notes

- Start with semantic HTML and only add JavaScript where the interaction truly requires it.
- Keep styling tokens and spacing consistent with adjacent controls or layouts.
- If the live implementation introduces async behavior, mirror those states in the code example rather than documenting them only in prose.

## Accessibility

### Keyboard Interaction

- [ ] Verify that share dialog can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.

### Screen Reader Support

- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.

### Visual Accessibility

- [ ] Do not rely on color alone to convey severity, completion, or selection state.
- [ ] Test the pattern at 200% zoom and with reduced motion enabled.
- [ ] Ensure touch targets remain comfortable on mobile and coarse pointers.

## Testing Guidelines

### Functional Testing

- [ ] Verify the default, loading, error, and success states for share dialog.
- [ ] Test the primary action and the obvious recovery action in the same run.
- [ ] Confirm that state survives refresh, navigation, or retry in the way users would expect.

### Accessibility Testing

- [ ] Run keyboard-only checks and at least one screen reader pass on the final implementation.
- [ ] Validate headings, labels, and announcement behavior with real content rather than lorem ipsum.
- [ ] Check color contrast and focus visibility in both default and stressed states.

### Edge Cases

- [ ] Test empty, long, duplicated, and unexpectedly formatted content.
- [ ] Check behavior on narrow screens, zoomed layouts, and slower networks.
- [ ] Verify that optimistic or asynchronous states reconcile correctly after a failure.

## Frequently Asked Questions

## Related Patterns

## Resources

### References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - Accessibility baseline for keyboard support, focus management, and readable state changes.
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - Reference patterns for keyboard behavior, semantics, and assistive technology support.

### Guides

- [MDN WAI-ARIA basics](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/WAI-ARIA_basics) - Guidance on when to rely on native HTML and when to introduce ARIA roles and states.

### Articles

- [Nielsen Norman Group: Writing links](https://www.nngroup.com/articles/writing-links/) - How link text influences comprehension, scanning, and navigation confidence.

### NPM Packages

- [`react-share`](https://www.npmjs.com/package/react-share) - Share buttons for social networks, native share fallback, and copy actions.
- [`@radix-ui/react-dialog`](https://www.npmjs.com/package/%40radix-ui%2Freact-dialog) - Dialog primitive for modals, sheet-style overlays, and focus management.
- [`react-use`](https://www.npmjs.com/package/react-use) - Interaction helpers and micro-state hooks useful in optimistic and feedback-heavy UIs.
