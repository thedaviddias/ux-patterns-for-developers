import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card gallery-card">\n  <div class="viewer" id="gallery-viewer">Living room view</div>\n  <div class="thumbs">\n    <button type="button" data-view="Living room view">1</button>\n    <button type="button" data-view="Kitchen detail">2</button>\n    <button type="button" data-view="Bedroom layout">3</button>\n  </div>\n</div>',
	css: ".gallery-card { padding: 20px; display: grid; gap: 12px; }\n.viewer { min-height: 220px; border-radius: 18px; background: linear-gradient(135deg, #dbeafe, #e2e8f0); display: grid; place-items: center; font-weight: 700; color: #0f172a; }\n.thumbs { display: flex; gap: 8px; }\n.thumbs button { width: 44px; height: 44px; border-radius: 12px; border: 1px solid #cbd5e1; background: white; }",
	js: "const viewer = document.getElementById('gallery-viewer');\ndocument.querySelectorAll('[data-view]').forEach((button) => { button.addEventListener('click', () => { viewer.textContent = button.dataset.view; }); });",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
