import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card like-card">\n  <button type="button" id="like-button" aria-pressed="false">♡ <span id="like-count">128</span></button>\n  <p class="muted">Tap to like this pattern.</p>\n</div>',
	css: ".like-card { padding: 24px; display: grid; gap: 12px; }\nbutton { width: fit-content; border: 1px solid #cbd5e1; border-radius: 999px; padding: 10px 16px; background: white; font-size: 18px; }\nbutton.active { background: #fee2e2; border-color: #fda4af; color: #be123c; }\np { margin: 0; }",
	js: "const button = document.getElementById('like-button');\nconst count = document.getElementById('like-count');\nbutton.addEventListener('click', () => {\n  const active = button.getAttribute('aria-pressed') === 'true';\n  button.setAttribute('aria-pressed', String(!active));\n  button.classList.toggle('active', !active);\n  button.firstChild.textContent = !active ? '♥ ' : '♡ ';\n  count.textContent = String(Number(count.textContent) + (!active ? 1 : -1));\n});",
	height: "320px",
	presentation: "hidden-code",
	variant: "canonical",
};
