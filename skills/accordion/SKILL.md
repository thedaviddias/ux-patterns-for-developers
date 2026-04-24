---
name: accordion
description: "Create effective accordion components for your web applications. Use when you need to expand and collapse content sections. Triggers: collapsible panels."
user-invocable: true
triggers:
  - accordion
  - collapsible panels
metadata:
  id: accordion
  category: content-management
  pattern: Accordion
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/content-management/accordion
  sourcePath: apps/web/content/patterns/content-management/accordion.mdx
---

# Accordion

Expand and collapse content sections

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

An **accordion** consists of vertically stacked headers that expand or collapse to reveal or hide related content. Accordions conserve screen space by displaying content in a structured, interactive way.
Accordions work well for **FAQs, settings panels, and structured content** where users access multiple sections without scrolling through everything.

## When to use and when to avoid

**Use when:**

Use accordions to present **structured content benefiting from progressive disclosure**.
**Common use cases include:**
- **FAQs (Frequently Asked Questions)** – Users find answers quickly
- **Settings and Preferences** – Options organize into collapsible categories
- **Product Details or Features** – Users expand sections they're interested in
- **Documentation or Guides** – Step-by-step content stays organized
- **Navigation and Filtering** – Sidebars use them for hierarchical content

**Avoid when:**

- **All content needs simultaneous visibility** (comparison tables)
- **Content is too short**—collapsing small text reduces usability
- **Frequent section switching needed**—tabs work better
- **Multiple sections need simultaneous viewing** (Terms and Conditions)—try popovers, modals, or side panels
- **Deep nesting of multiple levels**—structured outlines or table of contents work better

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

### Keyboard Interaction Pattern
The following table outlines the standard keyboard interactions for accordion components. These interactions ensure that users can navigate and operate accordions effectively using only a keyboard.
| Key                   | Action                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Enter or Space        | • Expand a collapsed panel; collapse all others<br/>• Collapse an expanded panel                        |
| Tab                   | Move focus to the next focusable item in the tab sequence. Focus will progress into an accordion panel. |
| Shift + Tab           | Move focus to the previous focusable item in the tab sequence                                           |
| Down Arrow (Optional) | Move focus to the next accordion header                                                                 |
| Up Arrow (Optional)   | Move focus to the previous accordion header                                                             |
| Home (Optional)       | Move focus to the first accordion header                                                                |

## Related patterns

- https://uxpatterns.dev/patterns/content-management/expandable-text
- https://uxpatterns.dev/patterns/content-management/modal
- https://uxpatterns.dev/patterns/navigation/tabs

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/content-management/accordion
