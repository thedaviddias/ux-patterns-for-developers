import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="preview-card date-input">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Date input</span>
      <h2 class="preview-title">Date of birth</h2>
    </div>
    <span id="dob-value" class="preview-badge">Not set</span>
  </div>

  <label for="dob">Date of birth</label>
  <input
    type="date"
    id="dob"
    name="dob"
    min="1900-01-01"
    max="2025-12-31"
    aria-describedby="dob-hint"
  />
  <p id="dob-hint" class="date-input__help">Format: MM/DD/YYYY</p>
  <p class="preview-help">The native picker keeps keyboard and mobile support intact.</p>
</div>`,
	css: `.date-input {
  max-width: 420px;
  display: grid;
  gap: 16px;
  padding: 20px;
}
`,
	js: `const dobInput = document.getElementById("dob");
const dobValue = document.getElementById("dob-value");
const dobHint = document.getElementById("dob-hint");

dobInput.addEventListener("change", () => {
  if (!dobInput.value) {
    dobValue.textContent = "Not set";
    dobHint.textContent = "Format: MM/DD/YYYY";
    return;
  }

  const formattedDate = new Date(dobInput.value + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  dobValue.textContent = formattedDate;
  dobHint.textContent = "Selected date: " + formattedDate;
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
