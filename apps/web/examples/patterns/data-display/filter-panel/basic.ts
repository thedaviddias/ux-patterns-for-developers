import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell filters-demo">\n  <aside class="card filter-panel">\n    <h3>Filters</h3>\n    <label><input type="checkbox" checked /> Mobile ready</label>\n    <label><input type="checkbox" /> Accessibility notes</label>\n    <label><input type="checkbox" checked /> Includes code</label>\n  </aside>\n  <section class="card filter-results">\n    <div class="result-row"><strong>Pagination</strong><span class="badge">Navigation</span></div>\n    <div class="result-row"><strong>Image Upload</strong><span class="badge">Media</span></div>\n    <div class="result-row"><strong>Form Validation</strong><span class="badge">Forms</span></div>\n  </section>\n</div>',
	css: ".filters-demo { display: grid; gap: 16px; grid-template-columns: 240px 1fr; }\n.filter-panel, .filter-results { padding: 18px; }\n.filter-panel { display: grid; gap: 10px; }\n.result-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e2e8f0; }\n.result-row:last-child { border-bottom: 0; }\n.badge { padding: 6px 10px; border-radius: 999px; background: #e2e8f0; font-size: 12px; }\n@media (max-width: 640px) { .filters-demo { grid-template-columns: 1fr; } }",
	js: "",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
