---
name: date-range
description: "Use when implementing select a range between two dates."
metadata:
  id: date-range
  category: forms
  pattern: Date Range
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/date-range
  sourcePath: apps/web/content/patterns/forms/date-range.mdx
---

# Date Range

Select a range between two dates

## What it solves

A **Date Range** component allows users to select both a **start date** and an **end date**, defining a continuous period of time. It extends the [Date Picker](/patterns/forms/date-picker) pattern by introducing range visualization — highlighting the days between the two selected dates — and range-specific validation (end date must be after start date, minimum/maximum range length).
Date Range is commonly implemented as either a **dual input pair** (two separate date fields with connected validation) or a **single calendar panel/dual-panel UI** with visual range highlighting as the user selects.
 start, minimum/maximum range enforcement, and accessible announcement of both selected dates."
/>

## When to use

- **Hotel/travel booking** – Check-in and check-out date selection.
- **Event duration** – Start and end dates for an event or campaign.
- **Reporting periods** – Date filters for analytics dashboards ("Last 7 days", custom range).
- **Rental and reservation systems** – Car rental, equipment rental periods.
- **Leave and time-off requests** – Vacation date selection with minimum/maximum days.

## When to avoid

- **Single date selection** – Use a [Date Picker](/patterns/forms/date-picker).
- **Open-ended filters** – "From date only" or "To date only" — use two independent date inputs.
- **Very long date ranges** – Multi-year ranges are better served by month/year selectors.
- **When start and end can be the same day** – Clarify this explicitly in UX copy.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction Pattern
| **Key**                | **Action**                                                               |
| ---------------------- | ------------------------------------------------------------------------ |
| `Tab`                  | Moves between start input, end input, and calendar trigger               |
| `Enter` / `Space`      | Opens the picker when on an input or trigger; confirms hovered date      |
| `Arrow Right`          | Moves focus to the next day in the calendar                              |
| `Arrow Left`           | Moves focus to the previous day                                          |
| `Arrow Down`           | Moves focus to the same day next week                                    |
| `Arrow Up`             | Moves focus to the same day previous week                                |
| `Page Up`              | Navigates to the previous month                                          |

## Performance guardrails

- **Picker open time**: < 150ms for dual-panel calendar
- **Hover preview**: < 16ms per frame during hover
- **Range commit (end date selection)**: < 50ms to update UI
- **Preset range selection**: < 30ms to apply dates
- **Memory usage**: < 30KB for dual-panel date range picker

## Common mistakes

### Resetting End Date When Start Date Changes

**The Problem:**
When users adjust the start date (e.g., from March 12 to March 15), automatically clearing the end date frustrates users who just want to shift the range by a few days.

**How to Fix It?** If the new start date is before the existing end date, keep the end date. Only clear it if the new start date is after the end date.

```javascript
function onStartDateChange(newStart) {
  if (endDate && newStart < endDate) {
    // Keep end date — range is still valid
  } else {
    setEndDate(null); // Only clear if invalid
  }
  setStartDate(newStart);
}
```

### No In-Progress Visual Feedback

**The Problem:**
After the user clicks a start date, the calendar appears unchanged — there's no indication that the system is waiting for an end date selection.

**How to Fix It?** Show instructional text and a hover-preview of the potential range.

```javascript
calendar.addEventListener('mouseover', (e) => {
  if (selectingEndDate && e.target.matches('.calendar__day-btn')) {
    const hoverDate = getDateFromCell(e.target);
    if (hoverDate > startDate) {
      highlightRange(startDate, hoverDate, 'preview');
    }
  }
});
```

### Ignoring Minimum/Maximum Range Constraints

**The Problem:**
Rental and booking systems often have minimum stays. Not enforcing these visually (by disabling cells within the minimum range of the start date) allows users to select invalid ranges.

**How to Fix It?** After start date selection, disable all cells within the minimum range.

```javascript
function getDisabledDatesForEndSelection(startDate, minDays) {
  const disabled = [];
  for (let i = 1; i < minDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    disabled.push(d);
  }
  return disabled;
}
```

## Related patterns

- https://uxpatterns.dev/patterns/forms/date-input
- https://uxpatterns.dev/patterns/forms/date-picker
- https://uxpatterns.dev/patterns/forms/selection-input

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/date-range
