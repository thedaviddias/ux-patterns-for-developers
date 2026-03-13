import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="preview-card button-demo">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Buttons</span>
      <h2 class="preview-title">Action hierarchy</h2>
    </div>
    <span id="button-status" class="preview-badge">Idle</span>
  </div>

  <div class="preview-actions">
    <button type="button" class="preview-button preview-button--primary" data-state-label="Saved">Save changes</button>
    <button type="button" class="preview-button" data-state-label="Secondary">Preview</button>
    <button type="button" class="preview-button preview-button--ghost" data-state-label="Ghost">Learn more</button>
    <button type="button" class="preview-button preview-button--danger" data-state-label="Danger">Delete</button>
  </div>
</div>`,
	css: `.button-demo {
  display: grid;
  gap: 18px;
  padding: 20px;
}
`,
	js: `const buttonStatus = document.getElementById("button-status");

document.querySelectorAll(".button-demo button").forEach((button) => {
  button.addEventListener("click", () => {
    const nextState = button.getAttribute("data-state-label") || "Updated";
    buttonStatus.textContent = nextState;
  });
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
