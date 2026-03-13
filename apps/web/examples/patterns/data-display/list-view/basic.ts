import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell">\n  <div class="card list-card">\n    <ul class="list">\n      <li>\n        <div>\n          <strong>Accessibility review</strong>\n          <p class="muted">Open issues and fixes from the latest audit.</p>\n        </div>\n        <span class="badge">Today</span>\n      </li>\n      <li>\n        <div>\n          <strong>Design handoff checklist</strong>\n          <p class="muted">Documentation work still waiting on engineering review.</p>\n        </div>\n        <span class="badge">Tomorrow</span>\n      </li>\n      <li>\n        <div>\n          <strong>Pattern release notes</strong>\n          <p class="muted">Summary of what changed in the latest library update.</p>\n        </div>\n        <span class="badge">Friday</span>\n      </li>\n    </ul>\n  </div>\n</div>',
	css: ".list-card { padding: 8px 0; }\n.list { list-style: none; margin: 0; padding: 0; }\nli { display: flex; gap: 16px; justify-content: space-between; align-items: start; padding: 18px 20px; border-bottom: 1px solid #e2e8f0; }\nli:last-child { border-bottom: 0; }\np { margin: 6px 0 0; font-size: 14px; line-height: 1.5; }\n.badge { padding: 6px 10px; border-radius: 999px; background: #e2e8f0; font-size: 12px; font-weight: 600; }",
	js: "",
	height: "480px",
	presentation: "hidden-code",
	variant: "canonical",
};
