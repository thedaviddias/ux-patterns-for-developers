import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell grid">\n  <article class="card tile">\n    <div class="thumb">👟</div>\n    <h3>Trail Runner</h3>\n    <p class="muted">$89 · Lightweight upper · Ships tomorrow</p>\n  </article>\n  <article class="card tile">\n    <div class="thumb">🎒</div>\n    <h3>Carry Kit</h3>\n    <p class="muted">$64 · Water resistant · Free returns</p>\n  </article>\n  <article class="card tile">\n    <div class="thumb">⌚</div>\n    <h3>Focus Timer</h3>\n    <p class="muted">$129 · 4.8 rating · In stock</p>\n  </article>\n</div>',
	css: ".grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }\n.tile { padding: 18px; display: grid; gap: 10px; }\n.thumb { width: 48px; height: 48px; border-radius: 14px; background: #e2e8f0; display: grid; place-items: center; font-size: 22px; }\nh3 { margin: 0; font-size: 18px; }\np { margin: 0; line-height: 1.5; }",
	js: "",
	height: "430px",
	presentation: "hidden-code",
	variant: "canonical",
};
