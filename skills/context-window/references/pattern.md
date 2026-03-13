# Context Window

> Learn how to implement context window management. Discover best practices for conversation history, context limits, and memory management.

**URL:** https://uxpatterns.dev/patterns/ai-intelligence/context-window
**Source:** apps/web/content/patterns/ai-intelligence/context-window.mdx

---

## Overview

A **Context Window** pattern helps teams create a reliable way to show how much conversational or working memory remains and what the system will keep, compress, or drop. It is most useful when teams need long-running AI work sessions.

Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Use Cases

### When to use:

- Long-running AI work sessions
- File-heavy chat and copilots
- Systems with prompt or response truncation risk

### When not to use:

- Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable.
- Do not expose advanced controls unless users can actually benefit from them.
- Do not hide model uncertainty behind polished visuals alone.

### Common scenarios and examples

- Long-running AI work sessions where users need a clear, repeatable interface model.
- File-heavy chat and copilots where users need a clear, repeatable interface model.
- Systems with prompt or response truncation risk where users need a clear, repeatable interface model.

## Benefits

- Clarifies how context window should behave before implementation details begin to sprawl.
- Creates a reusable interaction model for teams who need to show how much conversational or working memory remains and what the system will keep, compress, or drop.
- Makes accessibility, edge cases, and recovery paths part of the design instead of post-launch cleanup.
- Gives product, design, and engineering a shared language for evaluating trade-offs.

## Drawbacks

- It depends on variable model latency, output quality, and provider behavior.
- Trust drops quickly when limits, confidence, or recovery paths are hidden.
- State transitions are harder to design because the system can stream, retry, or partially fail.
- Cost and token usage become a real product constraint, not just an implementation detail.

## Anatomy

```mermaid
flowchart TB
Root[Context Window] --> A[Usage indicator]
Root --> B[Threshold state]
Root --> C[Retention rules]
Root --> D[Compression action]
Root --> E[Overflow state]
```

### Component Structure

1. **Usage indicator**

- Shows current context consumption in a way users can interpret.

2. **Threshold state**

- Warns when the prompt or history is approaching a limit.

3. **Retention rules**

- Explains which messages, files, or summaries are kept.

4. **Compression action**

- Lets users trim, summarize, or archive context deliberately.

5. **Overflow state**

- Explains what changed when the limit is exceeded.

#### Summary of Components

| Component | Required? | Purpose |
| --- | --- | --- |
| Usage indicator | ✅ Yes | Shows current context consumption in a way users can interpret. |
| Threshold state | ✅ Yes | Warns when the prompt or history is approaching a limit. |
| Retention rules | ✅ Yes | Explains which messages, files, or summaries are kept. |
| Compression action | ❌ No | Lets users trim, summarize, or archive context deliberately. |
| Overflow state | ❌ No | Explains what changed when the limit is exceeded. |

## Variations

### Passive meter

Shows context use quietly until a threshold is crossed.

**When to use:** Use when most users never need to manage the limit directly.

### Active budget control

Lets users deliberately decide what stays in context.

**When to use:** Use for expert tools and long-running AI work.

### Auto-summarized history

Compresses older context while keeping users informed.

**When to use:** Use when preserving continuity matters more than exact transcript fidelity.

## Best Practices

### Content

**Do's ✅**

- Explain what the AI is doing and what users can still control.
- Use plain-language labels for models, actions, and limits.
- Show enough provenance, status, or history for the AI output to feel reviewable.

**Don'ts ❌**

- Do not present speculative output as guaranteed fact.
- Do not hide model changes, truncation, or tool usage when they change the result.
- Do not collapse all failures into a single generic error message.

### Accessibility

**Do's ✅**

- Verify that context window can be completed using keyboard alone.
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

- Separate system status from generated content visually.
- Keep request, streaming, and completion states recognizable at a glance.
- Use subtle motion to show progress without distracting from reading.

**Don'ts ❌**

- Do not animate every token or status chip if it harms readability.
- Do not make AI controls compete with the response itself.
- Do not overload the first screen with advanced options users rarely need.

### Layout & Positioning

**Do's ✅**

- Keep prompt entry, result review, and follow-up actions logically grouped.
- Preserve enough history for people to understand why the current state exists.
- Make retries and alternate paths easy to find.

**Don'ts ❌**

- Do not let key controls move around as streaming content grows.
- Do not push critical notices below a long AI response.
- Do not assume a single-column desktop layout will translate to mobile unmodified.

## State Management

- Model the request lifecycle explicitly: idle, validating, sending, streaming, complete, interrupted, and failed.
- Preserve the prompt, settings, and visible system state when users retry or branch from the current result.
- If the interface supports multiple turns or tools, decide which state is local to the current turn and which belongs to the broader conversation.

## Error Handling

- Differentiate provider errors, policy blocks, context limits, and user-correctable input issues.
- Preserve enough context after a failure that users can retry without losing work.
- Offer a next best action such as retry, shorten input, switch model, or continue manually.

## API Integration

- Treat model responses as asynchronous and occasionally partial; the UI should remain coherent if chunks arrive late or out of order.
- Debounce or batch requests when the pattern updates live from typing or repeated toggles.
- Keep provider-specific identifiers and jargon out of the primary user-facing copy unless they materially change behavior.

## Performance

- Budget for network latency, token usage, and client-side rendering of long responses together, not as separate concerns.
- Stream or chunk content when it improves time-to-first-value, but stabilize layout so reading does not become jittery.
- Track expensive states such as long prompts, model changes, and retries so you can tune the experience with evidence.

## Common Mistakes & Anti-Patterns 🚫

### **Hiding the system state**

**The Problem:**
Users cannot tell whether the model is waiting, streaming, retrying, or done.

**How to Fix It?**
Expose clear request lifecycle states and keep them visible near the content they affect.

---

### **Treating failures like standard form errors**

**The Problem:**
AI failures include safety blocks, context limits, model availability, and partial output, not just a failed request.

**How to Fix It?**
Differentiate failure modes and give recovery actions that match each one.

---

### **Ignoring token and latency budgets**

**The Problem:**
The experience feels unpredictable when responses get slower, shorter, or more expensive without explanation.

**How to Fix It?**
Design token, latency, and provider constraints into the interface from the beginning.

## Examples

### Basic Implementation

```html
<div class="demo-shell card generic-card"><h2>Context Window</h2><p class="muted">Basic demo placeholder for managing ai conversation context.</p></div>
```

### What this example demonstrates

- A clear baseline implementation of context window that can be reviewed without framework-specific noise.
- Visible state, spacing, and content hierarchy that mirror the implementation guidance above.
- A small enough surface to copy into a design review or prototype before scaling the pattern up.

### Implementation Notes

- Start with semantic HTML and only add JavaScript where the interaction truly requires it.
- Keep styling tokens and spacing consistent with adjacent controls or layouts.
- If the live implementation introduces async behavior, mirror those states in the code example rather than documenting them only in prose.

## Accessibility

### Keyboard Interaction

- [ ] Verify that context window can be completed using keyboard alone.
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

- [ ] Verify the default, loading, error, and success states for context window.
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
- [MDN ARIA live regions](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Guides/Live_regions) - How to announce streaming text, status updates, and non-modal feedback to screen readers.

### Guides

- [People + AI Guidebook](https://pair.withgoogle.com/guidebook-v2/) - A practical framework for building AI-assisted interfaces with transparency and user control.

### Articles

- [Microsoft Human-AI Interaction Guidelines](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/) - Research-backed recommendations for AI feedback, confidence, intervention, and recovery.

### NPM Packages

- [`ai`](https://www.npmjs.com/package/ai) - Vercel AI SDK primitives for chat, streaming UI, tools, and model integrations.
- [`gpt-tokenizer`](https://www.npmjs.com/package/gpt-tokenizer) - Estimate token usage for prompts, responses, and context budgeting.
- [`js-tiktoken`](https://www.npmjs.com/package/js-tiktoken) - Tokenizer implementation for token counting, truncation, and budget previews.
