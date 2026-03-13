import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card textarea-card">\n  <label for="textarea-input">Project summary</label>\n  <textarea id="textarea-input" rows="6" maxlength="180" placeholder="Describe the work, blockers, and next step."></textarea>\n  <p id="textarea-status" class="muted">0 / 180 characters</p>\n</div>',
	css: ".textarea-card { padding: 24px; display: grid; gap: 12px; }\nlabel { font-weight: 600; }\ntextarea { resize: vertical; border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; line-height: 1.5; }\np { margin: 0; }",
	js: "const input = document.getElementById('textarea-input');\nconst status = document.getElementById('textarea-status');\ninput.addEventListener('input', () => { status.textContent = input.value.length + ' / 180 characters'; });",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
