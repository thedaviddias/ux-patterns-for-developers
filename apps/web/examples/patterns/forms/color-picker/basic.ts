import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="color-picker">
  <label for="brand-color">Brand Color</label>
  <input
    type="color"
    id="brand-color"
    name="brand-color"
    value="#3b82f6"
    aria-describedby="brand-color-help"
  />
  <p id="brand-color-help" class="color-picker__help">
    Selected: <span id="brand-color-value">#3b82f6</span>
  </p>
</div>

<script>
  const input = document.getElementById('brand-color');
  const valueDisplay = document.getElementById('brand-color-value');
  input.addEventListener('input', () => {
    valueDisplay.textContent = input.value;
  });
</script>`,
	presentation: "hidden-code",
	variant: "canonical",
};
