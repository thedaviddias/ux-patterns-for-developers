---
name: prompt-input
description: "Learn how to implement prompt input interfaces. Use when you need to enhanced text inputs for AI prompts."
user-invocable: true
triggers:
  - prompt
  - input
metadata:
  id: prompt-input
  category: ai-intelligence
  pattern: Prompt Input
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/ai-intelligence/prompt-input
  sourcePath: apps/web/content/patterns/ai-intelligence/prompt-input.mdx
---

# Prompt Input

Enhanced text inputs for AI prompts

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

A **Prompt Input** pattern helps teams create a reliable way to collect structured prompts, follow-up instructions, and optional attachments without making the composer feel heavy. It is most useful when teams need chat composer experiences.
Compared with adjacent patterns, this pattern should reduce friction without hiding the state, rules, or recovery paths people need to keep moving.

## Quick-start example

```html
<div class="demo-shell card prompt-card">
  <div class="chips">
    <span class="chip">Summarize</span><span class="chip">Rewrite</span><span class="chip">Check tone</span>
  </div>
  <textarea rows="6" placeholder="Ask the assistant to rewrite this update for a product launch email."></textarea>
  <div class="prompt-footer">
    <span class="muted">Prompt input with lightweight prompt assists</span>
    <button type="button">Send</button>
  </div>
</div>
```

_More variations and full anatomy in `references/pattern.md`._

## When to use and when to avoid

**Use when:**

- Chat composer experiences
- AI workbench prompts
- Structured prompting with attachments or modes

**Avoid when:**

- Avoid adding AI-specific UI when a standard non-AI workflow would be clearer and more reliable.
- Do not expose advanced controls unless users can actually benefit from them.
- Do not hide model uncertainty behind polished visuals alone.

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction
- [ ] Verify that prompt input can be completed using keyboard alone.
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

- https://uxpatterns.dev/patterns/ai-intelligence/ai-suggestions
- https://uxpatterns.dev/patterns/forms/text-field
- https://uxpatterns.dev/patterns/forms/textarea

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/ai-intelligence/prompt-input
