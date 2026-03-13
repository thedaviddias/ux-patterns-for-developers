import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card timeline-card">\n  <ol>\n    <li><strong>Kickoff approved</strong><p class="muted">Design and engineering aligned on the scope.</p></li>\n    <li><strong>Prototype tested</strong><p class="muted">Five users completed the revised flow successfully.</p></li>\n    <li><strong>Launch scheduled</strong><p class="muted">Rollout is planned for next Thursday.</p></li>\n  </ol>\n</div>',
	css: ".timeline-card { padding: 20px; }\nol { list-style: none; margin: 0; padding: 0 0 0 20px; border-left: 2px solid #cbd5e1; display: grid; gap: 18px; }\nli { position: relative; }\nli::before { content: ''; width: 12px; height: 12px; border-radius: 999px; background: #0f172a; position: absolute; left: -27px; top: 6px; }\np { margin: 6px 0 0; line-height: 1.5; }",
	js: "",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
