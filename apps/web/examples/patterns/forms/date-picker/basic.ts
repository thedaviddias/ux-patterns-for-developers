import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="date-picker preview-card">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Date picker</span>
      <h2 class="preview-title">Appointment date</h2>
    </div>
    <span id="appt-status" class="preview-badge">Choose a slot</span>
  </div>

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
      📅
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
    <div class="date-picker__calendar">
      <div class="date-picker__calendar-header">
        <strong>May 2026</strong>
        <span class="preview-muted">Available dates</span>
      </div>
      <div class="date-picker__calendar-grid">
        <button type="button" class="date-picker__day" data-date="05/12/2026">12</button>
        <button type="button" class="date-picker__day" data-date="05/14/2026">14</button>
        <button type="button" class="date-picker__day" data-date="05/18/2026">18</button>
        <button type="button" class="date-picker__day" data-date="05/21/2026">21</button>
        <button type="button" class="date-picker__day" data-date="05/26/2026">26</button>
        <button type="button" class="date-picker__day" data-date="05/28/2026">28</button>
      </div>
    </div>
  </div>
</div>`,
	css: `.date-picker {
  max-width: 460px;
  display: grid;
  gap: 16px;
  padding: 20px;
}

.date-picker__input-wrapper {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.date-picker__trigger {
  width: 48px;
  border: 1px solid var(--preview-border);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
}

.date-picker__popup {
  border: 1px solid var(--preview-border);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--preview-shadow);
  padding: 16px;
}

.date-picker__calendar {
  display: grid;
  gap: 14px;
}

.date-picker__calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.date-picker__calendar-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.date-picker__day {
  min-height: 44px;
  border: 1px solid var(--preview-border);
  border-radius: 14px;
  background: rgba(248, 250, 252, 0.8);
  font-weight: 700;
}

.date-picker__day:hover,
.date-picker__day.is-selected {
  border-color: var(--preview-border-strong);
  background: var(--preview-primary-soft);
  color: var(--preview-primary-strong);
}
`,
	js: `const appointmentInput = document.getElementById("appt-date");
const appointmentTrigger = document.querySelector(".date-picker__trigger");
const appointmentPopup = document.getElementById("appt-calendar");
const appointmentStatus = document.getElementById("appt-status");
const appointmentHelp = document.getElementById("appt-date-help");

function closeDatePicker() {
  appointmentTrigger.setAttribute("aria-expanded", "false");
  appointmentInput.setAttribute("aria-expanded", "false");
  appointmentPopup.hidden = true;
}

appointmentTrigger.addEventListener("click", () => {
  const isExpanded = appointmentTrigger.getAttribute("aria-expanded") === "true";
  appointmentTrigger.setAttribute("aria-expanded", String(!isExpanded));
  appointmentInput.setAttribute("aria-expanded", String(!isExpanded));
  appointmentPopup.hidden = isExpanded;
});

appointmentPopup.addEventListener("click", (event) => {
  const dayButton = event.target.closest("[data-date]");
  if (!dayButton) return;

  document.querySelectorAll(".date-picker__day").forEach((button) => {
    button.classList.remove("is-selected");
  });

  dayButton.classList.add("is-selected");
  appointmentInput.value = dayButton.getAttribute("data-date") || "";
  appointmentStatus.textContent = appointmentInput.value;
  appointmentHelp.textContent = "Appointment date selected.";
  closeDatePicker();
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
