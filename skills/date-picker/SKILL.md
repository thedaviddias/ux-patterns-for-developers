---
name: date-picker
description: "Use when implementing select dates from a calendar interface."
metadata:
  id: date-picker
  category: forms
  pattern: Date Picker
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/date-picker
  sourcePath: apps/web/content/patterns/forms/date-picker.mdx
---

# Date Picker

Select dates from a calendar interface

## What it solves

A **Date Picker** is a form component that combines a text input (showing the selected date) with a **calendar overlay** that allows users to visually browse and select a date. The calendar provides context about surrounding dates, days of the week, and time-relative positioning that a plain text input cannot offer.
Unlike a [Date Input](/patterns/forms/date-input) (which is optimized for direct keyboard entry of known dates), a Date Picker is designed for situations where the user benefits from seeing the calendar — scheduling appointments, choosing a future delivery date, or selecting from a constrained set of available days.

## When to use

- **Appointment scheduling** – Users need to see available slots in context.
- **Delivery and shipping dates** – Shows available delivery days vs. blackout dates.
- **Event creation** – Users select a date relative to today or other events.
- **Hotel and travel booking** – Contextual date selection with pricing or availability.
- **Report or filter date** – Selecting a specific date for data filtering.

## When to avoid

- **Known, historical dates** – Use a [Date Input](/patterns/forms/date-input) for birth dates or past records where calendar navigation is tedious.
- **Date ranges** – Use a [Date Range](/patterns/forms/date-range) component instead.
- **Mobile-only contexts** – The native `<input type="date">` opens the platform's native picker; a custom calendar may be redundant.
- **Very distant dates** – Navigating 80+ years in a calendar is impractical; use a text date input with year input.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction Pattern
| **Key**                | **Action**                                                         |
| ---------------------- | ------------------------------------------------------------------ |
| `Enter` / `Space`      | Opens calendar when on the trigger button; selects focused date    |
| `Escape`               | Closes the calendar and returns focus to the trigger               |
| `Arrow Right`          | Moves focus to the next day                                        |
| `Arrow Left`           | Moves focus to the previous day                                    |
| `Arrow Down`           | Moves focus to the same day next week                              |
| `Arrow Up`             | Moves focus to the same day previous week                          |
| `Home`                 | Moves focus to the first day of the current week                   |

## Performance guardrails

- **Calendar open time**: < 100ms from button click to visible calendar
- **Month navigation**: < 50ms to render new month grid
- **Day selection**: < 16ms from click to input update and popup close
- **Memory usage**: < 20KB per date picker instance
- **[DOM](/glossary/dom) size**: < 50 nodes for a single month calendar grid

## Common mistakes

### Opening the Calendar on Input Focus

**The Problem:**
Opening the calendar automatically when the text input gains focus is disruptive for keyboard users navigating through a form and for users who prefer to type dates directly.

**How to Fix It?** Open the calendar only when the calendar icon button is activated.

```javascript
// Bad
dateInput.addEventListener('focus', openCalendar);

// Good
calendarButton.addEventListener('click', toggleCalendar);
calendarButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleCalendar();
  }
});
```

### No Keyboard Navigation in Calendar Grid

**The Problem:**
A calendar that requires mouse interaction is inaccessible to keyboard and [screen reader](/glossary/screen-reader) users.
**How to Fix It?** Implement the full ARIA grid keyboard navigation pattern.

```javascript
calendarGrid.addEventListener('keydown', (e) => {
  const focused = document.activeElement;
  switch (e.key) {
    case 'ArrowRight': focusDay(getNextDay(focused)); break;
    case 'ArrowLeft':  focusDay(getPrevDay(focused)); break;
    case 'ArrowDown':  focusDay(getNextWeek(focused)); break;
    case 'ArrowUp':    focusDay(getPrevWeek(focused)); break;
    case 'Home':       focusDay(getFirstDayOfWeek(focused)); break;
    case 'End':        focusDay(getLastDayOfWeek(focused)); break;
    case 'PageUp':     navigateToPrevMonth(); break;
    case 'PageDown':   navigateToNextMonth(); break;
    case 'Escape':     closeCalendar(); break;
  }
});
```

### Not Returning Focus After Close

**The Problem:**
When the calendar closes (after date selection or `Escape`), focus disappears or jumps to the top of the page.

**How to Fix It?** Always return focus to the trigger element.

```javascript
function closeCalendar() {
  calendarPopup.hidden = true;
  calendarButton.setAttribute('aria-expanded', 'false');
  calendarButton.focus(); // Always return focus
}
```

## Related patterns

- https://uxpatterns.dev/patterns/forms/date-input
- https://uxpatterns.dev/patterns/forms/date-range
- https://uxpatterns.dev/patterns/forms/text-field

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/date-picker
