---
name: Token Counter
description: "Use when you need to display token usage and limits."
metadata:
  id: token-counter
  category: ai-intelligence
  pattern: Token Counter
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/ai-intelligence/token-counter
  sourcePath: apps/web/content/patterns/ai-intelligence/token-counter.mdx
---

# Token Counter

Display token usage and limits

## What it solves

A **Token Counter** pattern helps teams create a reliable way to make prompt size, response budget, and cost or truncation risk visible before users hit a hard limit. It is most useful when teams need prompt authoring with hard limits.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## When to use

- Prompt authoring with hard limits
- Cost-sensitive AI tools
- Debugging truncation and context overflow

## When to avoid

- Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable.
- Do not expose advanced controls unless users can actually benefit from them.
- Do not hide model uncertainty behind polished visuals alone.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that token counter can be completed using keyboard alone.
- [ ] Keep focus order logical when the pattern opens, updates, or reveals additional UI.
- [ ] Preserve a visible focus state that is still readable at high zoom.
### Screen Reader Support
- [ ] Use semantic elements first, then add ARIA only where semantics alone are not enough.
- [ ] Announce state changes such as errors, loading, or completion in the right place and with the right politeness.
- [ ] Connect labels, hints, and status text with `aria-describedby` or structural headings when useful.
### Visual Accessibility
- [ ] Do not rely on color alone to convey severity, completion, or selection state.

## Performance guardrails

- Budget for network latency, token usage, and client-side rendering of long responses together, not as separate concerns.
- Stream or chunk content when it improves time-to-first-value, but stabilize layout so reading does not become jittery.
- Track expensive states such as long prompts, model changes, and retries so you can tune the experience with evidence.

## Common mistakes

### **Hiding the system state**

**The Problem:**
Users cannot tell whether the model is waiting, streaming, retrying, or done.

**How to Fix It?**
Expose clear request lifecycle states and keep them visible near the content they affect.

### **Treating failures like standard form errors**

**The Problem:**
AI failures include safety blocks, context limits, model availability, and partial output, not just a failed request.

**How to Fix It?**
Differentiate failure modes and give recovery actions that match each one.

### **Ignoring token and latency budgets**

**The Problem:**
The experience feels unpredictable when responses get slower, shorter, or more expensive without explanation.

**How to Fix It?**
Design token, latency, and provider constraints into the interface from the beginning.

## Related patterns

- https://uxpatterns.dev/patterns/ai-intelligence/context-window
- https://uxpatterns.dev/patterns/ai-intelligence/model-selector
- https://uxpatterns.dev/patterns/ai-intelligence/prompt-input

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/ai-intelligence/token-counter
