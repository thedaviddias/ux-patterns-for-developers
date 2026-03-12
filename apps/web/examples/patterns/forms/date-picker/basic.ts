import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="date-picker">
  <label for="appt-date">Appointment date</label>
  <div class="date-picker__input-wrapper">
    <input
      type="text"
      id="appt-date"
      class="date-picker__input"
      placeholder="MM/DD/YYYY"
      autocomplete="off"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-describedby="appt-date-help"
      readonly
    />
    <button
      type="button"
      class="date-picker__trigger"
      aria-label="Open calendar"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-controls="appt-calendar"
    >
      <!-- Calendar icon SVG -->
    </button>
  </div>
  <p id="appt-date-help" class="date-picker__help">Select from available dates</p>

  <div
    id="appt-calendar"
    class="date-picker__popup"
    role="dialog"
    aria-modal="true"
    aria-label="Choose appointment date"
    hidden
  >
    <!-- Calendar content -->
  </div>
</div>`,
	presentation: "hidden-code",
	variant: "canonical",
};
