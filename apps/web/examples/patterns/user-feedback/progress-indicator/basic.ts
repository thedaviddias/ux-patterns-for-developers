import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell">\n  <div class="card progress-card">\n    <button type="button" id="progress-trigger">Run export</button>\n    <div class="progress-track"><div id="progress-fill"></div></div>\n    <p id="progress-status" class="muted">0% complete</p>\n  </div>\n</div>',
	css: ".progress-card { padding: 24px; display: grid; gap: 14px; }\nbutton { width: fit-content; border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; }\n.progress-track { height: 12px; border-radius: 999px; background: #e2e8f0; overflow: hidden; }\n#progress-fill { width: 0; height: 100%; background: #0f766e; }\np { margin: 0; }",
	js: "const button = document.getElementById('progress-trigger');\nconst fill = document.getElementById('progress-fill');\nconst status = document.getElementById('progress-status');\nbutton.addEventListener('click', () => {\n  let value = 0;\n  const timer = setInterval(() => {\n    value += 10;\n    fill.style.width = value + '%';\n    status.textContent = value + '% complete';\n    if (value >= 100) clearInterval(timer);\n  }, 120);\n});",
	height: "320px",
	presentation: "hidden-code",
	variant: "canonical",
};
