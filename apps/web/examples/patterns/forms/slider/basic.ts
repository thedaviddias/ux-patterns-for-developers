import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card slider-card">\n  <label for="slider-input">Budget preference</label>\n  <input id="slider-input" type="range" min="0" max="100" value="40" />\n  <p id="slider-value" class="muted">Current value: 40</p>\n</div>',
	css: ".slider-card { padding: 24px; display: grid; gap: 14px; }\nlabel { font-weight: 600; }\ninput { width: 100%; }\np { margin: 0; }",
	js: "const slider = document.getElementById('slider-input');\nconst output = document.getElementById('slider-value');\nslider.addEventListener('input', () => { output.textContent = 'Current value: ' + slider.value; });",
	height: "320px",
	presentation: "hidden-code",
	variant: "canonical",
};
