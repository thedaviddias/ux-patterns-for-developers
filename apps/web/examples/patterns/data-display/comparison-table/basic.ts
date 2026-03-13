import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card table-card">\n  <table>\n    <thead><tr><th>Feature</th><th>Starter</th><th>Team</th><th>Enterprise</th></tr></thead>\n    <tbody>\n      <tr><td>Shared components</td><td>✓</td><td>✓</td><td>✓</td></tr>\n      <tr><td>Design review workflows</td><td>—</td><td>✓</td><td>✓</td></tr>\n      <tr><td>Audit history</td><td>—</td><td>—</td><td>✓</td></tr>\n    </tbody>\n  </table>\n</div>',
	css: ".table-card { padding: 18px; overflow: auto; }\ntable { width: 100%; border-collapse: collapse; background: white; }\nth, td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; text-align: left; }\nth { background: #f8fafc; }",
	js: "",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
