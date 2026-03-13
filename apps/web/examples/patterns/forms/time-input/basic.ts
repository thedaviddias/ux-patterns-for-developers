import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell">\n  <div class="card form-card">\n    <label for="demo-input">Meeting time</label>\n    <input id="demo-input" type="time" placeholder="" />\n    <p class="helper">Choose a time that matches the attendee timezone.</p>\n    \n  </div>\n</div>',
	css: ".form-card { padding: 24px; display: grid; gap: 12px; }\nlabel { font-weight: 600; }\ninput, textarea, select { width: 100%; border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; background: #fff; }\n.helper { margin: 0; font-size: 14px; color: #64748b; }\n.status { font-size: 14px; color: #0f766e; }\n.error { color: #b91c1c; }",
	js: "",
	height: "320px",
	presentation: "hidden-code",
	variant: "canonical",
};
