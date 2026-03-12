import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="date-range" aria-describedby="date-range-summary">
  <div class="date-range__inputs">
    <div class="date-range__field">
      <label for="checkin-date">Check-in</label>
      <input
        type="text"
        id="checkin-date"
        class="date-range__input"
        placeholder="MM/DD/YYYY"
        readonly
        aria-haspopup="dialog"
        aria-expanded="false"
      />
    </div>
    <span class="date-range__separator" aria-hidden="true">→</span>
    <div class="date-range__field">
      <label for="checkout-date">Check-out</label>
      <input
        type="text"
        id="checkout-date"
        class="date-range__input"
        placeholder="MM/DD/YYYY"
        readonly
        aria-haspopup="dialog"
        aria-expanded="false"
      />
    </div>
  </div>

  <div
    class="date-range__popup"
    role="dialog"
    aria-modal="true"
    aria-label="Select check-in and check-out dates"
    hidden
  >
    <!-- Dual calendar panels -->
  </div>

  <output
    id="date-range-summary"
    class="date-range__summary sr-only"
    aria-live="polite"
  >
    No dates selected.
  </output>
</div>`,
	presentation: "hidden-code",
	variant: "canonical",
};
