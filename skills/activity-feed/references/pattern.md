# Activity Feed

> Learn how to implement activity feeds. Discover best practices for real-time updates, infinite scrolling, and engagement tracking.

**URL:** https://uxpatterns.dev/patterns/social/activity-feed
**Source:** apps/web/content/patterns/social/activity-feed.mdx

---

## Overview

A **Activity Feed** pattern helps teams create a reliable way to surface recent actions in a chronological stream so users can monitor what changed without visiting each item separately. It is most useful when teams need project and team updates.

Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Use Cases

### When to use:

- Project and team updates
- Community or social streams
- Audit and changelog-style feeds

### When not to use:

- Avoid social or engagement mechanics when they do not create real user value.
- Do not add public counts or visibility states without understanding the trust implications.
- Do not ship the surface without moderation, abuse, or reversal planning.

### Common scenarios and examples

- Project and team updates where users need a clear, repeatable interface model.
- Community or social streams where users need a clear, repeatable interface model.
- Audit and changelog-style feeds where users need a clear, repeatable interface model.

## Benefits

- Clarifies how activity feed should behave before implementation details begin to sprawl.
- Creates a reusable interaction model for teams who need to surface recent actions in a chronological stream so users can monitor what changed without visiting each item separately.
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
Root[Activity Feed] --> A[Feed container]
Root --> B[Activity item]
Root --> C[Metadata and actions]
Root --> D[Filter or sort controls]
Root --> E[Paging state]
```

### Component Structure

1. **Feed container**

- Defines ordering, batching, and update insertion rules.

2. **Activity item**

- Packages the actor, object, action, and time.

3. **Metadata and actions**

- Provide context such as replies, reactions, or destinations.

4. **Filter or sort controls**

- Let users focus on the updates that matter most.

5. **[Paging](/glossary/pagination) state**
- Controls how users move through older activity.

#### Summary of Components

| Component | Required? | Purpose |
| --- | --- | --- |
| Feed container | ✅ Yes | Defines ordering, batching, and update insertion rules. |
| Activity item | ✅ Yes | Packages the actor, object, action, and time. |
| Metadata and actions | ❌ No | Provide context such as replies, reactions, or destinations. |
| Filter or sort controls | ❌ No | Let users focus on the updates that matter most. |
| Paging state | ❌ No | Controls how users move through older activity. |

## Variations

### Global feed

Shows activity from many sources together.

**When to use:** Use when freshness and discovery matter.

### Scoped feed

Shows updates for one project, object, or team.

**When to use:** Use when users need operational history in context.

### Hybrid feed

Combines system updates with human actions.

**When to use:** Use when the product mixes automation and collaboration.

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

- Verify that activity feed can be completed using keyboard alone.
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

- Track impressions, primary actions, reversals, and error states for activity feed separately so the team can see where the pattern succeeds or fails.
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
<div class="demo-shell">
  <div class="card list-card">
    <ul class="list">
      <li>
        <div>
          <strong>Alex commented on “Signup review”</strong>
          <p class="muted">Raised an accessibility concern about the final step labels.</p>
        </div>
        <span class="badge">5m ago</span>
      </li>
      <li>
        <div>
          <strong>Design library updated</strong>
          <p class="muted">The button tokens were refreshed for the new brand palette.</p>
        </div>
        <span class="badge">22m ago</span>
      </li>
      <li>
        <div>
          <strong>New pattern published</strong>
          <p class="muted">Image Upload is now available with a basic playground demo.</p>
        </div>
        <span class="badge">1h ago</span>
      </li>
    </ul>
  </div>
</div>
```

### What this example demonstrates

- A clear baseline implementation of activity feed that can be reviewed without framework-specific noise.
- Visible state, spacing, and content hierarchy that mirror the implementation guidance above.
- A small enough surface to copy into a design review or prototype before scaling the pattern up.

### Implementation Notes

- Start with [semantic HTML](/glossary/semantic-html) and only add JavaScript where the interaction truly requires it.
- Keep styling tokens and spacing consistent with adjacent controls or layouts.
- If the live implementation introduces async behavior, mirror those states in the code example rather than documenting them only in prose.
## Accessibility

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
- [ ] Test the pattern at 200% zoom and with reduced motion enabled.
- [ ] Ensure [touch targets](/glossary/touch-targets) remain comfortable on mobile and coarse pointers.
## Testing Guidelines

### Functional Testing

- [ ] Verify the default, loading, error, and success states for activity feed.
- [ ] Test the primary action and the obvious recovery action in the same run.
- [ ] Confirm that state survives refresh, navigation, or retry in the way users would expect.

### Accessibility Testing

- [ ] Run keyboard-only checks and at least one [screen reader](/glossary/screen-reader) pass on the final implementation.
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
- [MDN ARIA live regions](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Guides/Live_regions) - How to announce streaming text, status updates, and non-modal feedback to screen readers.

### Guides

- [web.dev: Virtualize large lists](https://web.dev/articles/virtualize-long-lists-react-window) - Rendering and scrolling guidance for large result sets, feeds, and data-heavy interfaces.

### Articles

- [Nielsen Norman Group: Infinite scrolling tips](https://www.nngroup.com/articles/infinite-scrolling-tips/) - Tradeoffs in feed-style browsing, orientation, and footer access.

### NPM Packages

- [`react-virtuoso`](https://www.npmjs.com/package/react-virtuoso) - Virtualized list and table components for large feeds and long result sets.
- [`@tanstack/react-query`](https://www.npmjs.com/package/%40tanstack%2Freact-query) - Server-state management for async data, optimistic UI, and background refresh.
- [`date-fns`](https://www.npmjs.com/package/date-fns) - Date parsing, formatting, and range math for calendars and schedule interfaces.
