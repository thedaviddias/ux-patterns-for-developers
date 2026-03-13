import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell">\n  <section class="card consent-banner">\n    <p><strong>We use cookies</strong> to measure usage and remember preferences. You can accept all cookies or manage optional categories.</p>\n    <div class="actions">\n      <button type="button">Accept all</button>\n      <button type="button">Reject non-essential</button>\n      <button type="button" class="secondary">Customize</button>\n    </div>\n  </section>\n</div>',
	css: ".consent-banner { padding: 20px; display: grid; gap: 14px; }\n.actions { display: flex; gap: 8px; flex-wrap: wrap; }\nbutton { border: 0; border-radius: 12px; padding: 10px 14px; background: #0f172a; color: white; }\n.secondary { background: white; color: #0f172a; border: 1px solid #cbd5e1; }\np { margin: 0; line-height: 1.5; }",
	js: "",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
