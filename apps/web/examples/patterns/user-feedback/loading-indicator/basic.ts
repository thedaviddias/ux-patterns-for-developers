import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell">\n  <div class="card loading-card">\n    <button type="button" id="loading-trigger">Save changes</button>\n    <p id="loading-status" class="muted">Nothing is running yet.</p>\n  </div>\n</div>',
	css: ".loading-card { padding: 24px; display: grid; gap: 12px; }\nbutton { border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; position: relative; }\nbutton.busy::after { content: ''; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 999px; position: absolute; right: 14px; top: calc(50% - 8px); animation: spin 0.6s linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }\np { margin: 0; }",
	js: "const button = document.getElementById('loading-trigger');\nconst status = document.getElementById('loading-status');\nbutton.addEventListener('click', () => {\n  button.disabled = true; button.classList.add('busy'); button.textContent = 'Saving'; status.textContent = 'Saving changes…';\n  setTimeout(() => { button.disabled = false; button.classList.remove('busy'); button.textContent = 'Save changes'; status.textContent = 'Changes saved.'; }, 1200);\n});",
	height: "320px",
	presentation: "hidden-code",
	variant: "canonical",
};
