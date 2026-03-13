import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="preview-card selection-input">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Selection input</span>
      <h2 class="preview-title">Favorite fruit</h2>
    </div>
    <span id="fruit-status" class="preview-badge">Apple</span>
  </div>

  <label for="fruits">Choose a fruit:</label>
  <select id="fruits" name="fruits">
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="orange">Orange</option>
    <option value="strawberry">Strawberry</option>
  </select>
  <p class="preview-help">Current selection: <strong id="fruit-label">Apple</strong></p>
</div>`,
	css: `.selection-input {
  max-width: 420px;
  display: grid;
  gap: 16px;
  padding: 20px;
}
`,
	js: `const fruitSelect = document.getElementById("fruits");
const fruitStatus = document.getElementById("fruit-status");
const fruitLabel = document.getElementById("fruit-label");

fruitSelect.addEventListener("change", () => {
  const label = fruitSelect.options[fruitSelect.selectedIndex].textContent;
  fruitStatus.textContent = label;
  fruitLabel.textContent = label;
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
