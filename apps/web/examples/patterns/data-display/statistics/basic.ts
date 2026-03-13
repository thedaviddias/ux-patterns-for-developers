import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell grid">\n  <article class="card tile">\n    <div class="thumb">📈</div>\n    <h3>92%</h3>\n    <p class="muted">Completion rate for the new onboarding flow.</p>\n  </article>\n  <article class="card tile">\n    <div class="thumb">⏱</div>\n    <h3>1.4m</h3>\n    <p class="muted">Average time to publish a new pattern page.</p>\n  </article>\n  <article class="card tile">\n    <div class="thumb">🧩</div>\n    <h3>37</h3>\n    <p class="muted">Patterns with interactive demos available today.</p>\n  </article>\n</div>',
	css: ".grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }\n.tile { padding: 18px; display: grid; gap: 10px; }\n.thumb { width: 48px; height: 48px; border-radius: 14px; background: #e2e8f0; display: grid; place-items: center; font-size: 22px; }\nh3 { margin: 0; font-size: 18px; }\np { margin: 0; line-height: 1.5; }",
	js: "",
	height: "360px",
	presentation: "hidden-code",
	variant: "canonical",
};
