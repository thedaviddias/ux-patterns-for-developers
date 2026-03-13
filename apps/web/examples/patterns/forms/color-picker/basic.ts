import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="preview-card color-picker">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Color picker</span>
      <h2 class="preview-title">Brand accent</h2>
    </div>
    <span id="brand-color-chip" class="preview-badge">#3b82f6</span>
  </div>

  <label for="brand-color">Brand Color</label>
  <div class="color-picker__row">
    <input
      type="color"
      id="brand-color"
      name="brand-color"
      value="#3b82f6"
      aria-describedby="brand-color-help"
    />
    <div id="brand-color-swatch" class="color-picker__swatch" aria-hidden="true"></div>
  </div>
  <p id="brand-color-help" class="color-picker__help">
    Selected: <span id="brand-color-value">#3b82f6</span>
  </p>
</div>

<script>
  const input = document.getElementById('brand-color');
  const valueDisplay = document.getElementById('brand-color-value');
  const colorSwatch = document.getElementById('brand-color-swatch');
  const colorChip = document.getElementById('brand-color-chip');

  function syncBrandColor() {
    valueDisplay.textContent = input.value;
    colorSwatch.style.background = input.value;
    colorChip.textContent = input.value;
  }

  input.addEventListener('input', () => {
    syncBrandColor();
  });

  syncBrandColor();
</script>`,
	css: `.color-picker {
  max-width: 420px;
  display: grid;
  gap: 16px;
  padding: 20px;
}

.color-picker__row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: center;
}

.color-picker input[type="color"] {
  width: 72px;
  min-width: 72px;
  height: 56px;
  padding: 6px;
}

.color-picker__swatch {
  height: 56px;
  border-radius: 16px;
  border: 1px solid var(--preview-border);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45);
}
`,
	presentation: "hidden-code",
	variant: "canonical",
};
