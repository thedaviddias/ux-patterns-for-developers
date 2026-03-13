import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell">\n  <section class="card empty-card">\n    <div class="icon">📭</div>\n    <h2>No projects yet</h2>\n    <p class="muted">Create your first project to start collecting feedback and review notes.</p>\n    <button type="button">Create project</button>\n  </section>\n</div>',
	css: ".empty-card { padding: 32px; display: grid; gap: 12px; justify-items: start; }\n.icon { width: 56px; height: 56px; border-radius: 18px; background: #dbeafe; display: grid; place-items: center; font-size: 28px; }\nbutton { border: 0; border-radius: 12px; padding: 10px 14px; background: #0f172a; color: white; }\nh2, p { margin: 0; }",
	js: "",
	height: "360px",
	presentation: "hidden-code",
	variant: "canonical",
};
