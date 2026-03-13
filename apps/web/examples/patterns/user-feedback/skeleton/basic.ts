import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell grid">\n  <article class="card skeleton-card">\n    <div class="skeleton box image"></div>\n    <div class="skeleton box title"></div>\n    <div class="skeleton box line"></div>\n    <div class="skeleton box line short"></div>\n  </article>\n  <article class="card skeleton-card">\n    <div class="skeleton box image"></div>\n    <div class="skeleton box title"></div>\n    <div class="skeleton box line"></div>\n    <div class="skeleton box line short"></div>\n  </article>\n</div>',
	css: ".grid { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); }\n.skeleton-card { padding: 18px; display: grid; gap: 10px; }\n.skeleton.box { background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; border-radius: 12px; }\n.image { height: 120px; }\n.title { height: 20px; width: 70%; }\n.line { height: 14px; }\n.short { width: 55%; }\n@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }",
	js: "",
	height: "360px",
	presentation: "hidden-code",
	variant: "canonical",
};
