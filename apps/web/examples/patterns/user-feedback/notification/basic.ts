import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell">\n  <div class="card notify-card">\n    <button type="button" id="notify-trigger">Show notification</button>\n    <div id="toast" class="toast" hidden role="status" aria-live="polite"><strong>Project saved.</strong> Your changes are now visible to the team.</div>\n  </div>\n</div>',
	css: ".notify-card { padding: 24px; display: grid; gap: 14px; }\nbutton { width: fit-content; border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; }\n.toast { padding: 14px 16px; border-radius: 14px; background: #d1fae5; color: #065f46; }",
	js: "const button = document.getElementById('notify-trigger');\nconst toast = document.getElementById('toast');\nbutton.addEventListener('click', () => {\n  toast.hidden = false;\n  clearTimeout(window.__toastTimeout);\n  window.__toastTimeout = setTimeout(() => { toast.hidden = true; }, 2200);\n});",
	height: "320px",
	presentation: "hidden-code",
	variant: "canonical",
};
