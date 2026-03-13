import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="date-range preview-card" aria-describedby="date-range-summary">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Date range</span>
      <h2 class="preview-title">Plan your stay</h2>
    </div>
    <span id="date-range-chip" class="preview-badge">No range</span>
  </div>

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
    <div class="date-range__calendar">
      <p class="preview-help">Select a start date, then an end date.</p>
      <div class="date-range__options">
        <button type="button" class="date-range__day" data-date="05/12/2026">May 12</button>
        <button type="button" class="date-range__day" data-date="05/14/2026">May 14</button>
        <button type="button" class="date-range__day" data-date="05/18/2026">May 18</button>
        <button type="button" class="date-range__day" data-date="05/21/2026">May 21</button>
        <button type="button" class="date-range__day" data-date="05/24/2026">May 24</button>
        <button type="button" class="date-range__day" data-date="05/27/2026">May 27</button>
      </div>
    </div>
  </div>

  <output
    id="date-range-summary"
    class="date-range__summary sr-only"
    aria-live="polite"
  >
    No dates selected.
  </output>
</div>`,
	css: `.date-range {
  max-width: 540px;
  display: grid;
  gap: 16px;
  padding: 20px;
}

.date-range__inputs {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: end;
}

.date-range__field {
  display: grid;
  gap: 8px;
}

.date-range__separator {
  padding-bottom: 12px;
  color: var(--preview-muted);
  font-weight: 700;
}

.date-range__popup {
  border: 1px solid var(--preview-border);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--preview-shadow);
  padding: 16px;
}

.date-range__calendar {
  display: grid;
  gap: 14px;
}

.date-range__options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.date-range__day {
  min-height: 44px;
  border: 1px solid var(--preview-border);
  border-radius: 14px;
  background: rgba(248, 250, 252, 0.8);
  font-weight: 700;
}

.date-range__day.is-start,
.date-range__day.is-end,
.date-range__day.is-between {
  border-color: var(--preview-border-strong);
  background: var(--preview-primary-soft);
  color: var(--preview-primary-strong);
}
`,
	js: `const rangePopup = document.querySelector(".date-range__popup");
const rangeInputs = document.querySelectorAll(".date-range__input");
const rangeDays = Array.from(document.querySelectorAll(".date-range__day"));
const rangeSummary = document.getElementById("date-range-summary");
const rangeChip = document.getElementById("date-range-chip");
const checkinInput = document.getElementById("checkin-date");
const checkoutInput = document.getElementById("checkout-date");
let rangeStep = "start";

rangeInputs.forEach((input) => {
  input.addEventListener("click", () => {
    rangePopup.hidden = false;
  });
});

rangeDays.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedDate = button.getAttribute("data-date") || "";

    if (rangeStep === "start") {
      checkinInput.value = selectedDate;
      checkoutInput.value = "";
      rangeStep = "end";
      rangeDays.forEach((day) => day.classList.remove("is-start", "is-end", "is-between"));
      button.classList.add("is-start");
      rangeSummary.textContent = "Start date selected. Choose an end date.";
      rangeChip.textContent = selectedDate + " →";
      return;
    }

    checkoutInput.value = selectedDate;
    button.classList.add("is-end");
    rangePopup.hidden = true;
    rangeSummary.textContent = "Stay from " + checkinInput.value + " to " + checkoutInput.value + ".";
    rangeChip.textContent = checkinInput.value + " → " + checkoutInput.value;
    rangeStep = "start";
  });
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
