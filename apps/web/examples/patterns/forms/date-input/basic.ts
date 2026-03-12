import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="date-input">
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
</div>`,
	presentation: "hidden-code",
	variant: "canonical",
};
