import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card rating-card">\n  <p><strong>How helpful was this guide?</strong></p>\n  <div class="stars" role="radiogroup" aria-label="Rating">\n    <button type="button" class="star" data-value="1" aria-label="Rate 1 out of 5">☆</button><button type="button" class="star" data-value="2" aria-label="Rate 2 out of 5">☆</button><button type="button" class="star" data-value="3" aria-label="Rate 3 out of 5">☆</button><button type="button" class="star" data-value="4" aria-label="Rate 4 out of 5">☆</button><button type="button" class="star" data-value="5" aria-label="Rate 5 out of 5">☆</button>\n  </div>\n  <p id="rating-status" class="muted">Choose a rating.</p>\n</div>',
	css: ".rating-card { padding: 24px; display: grid; gap: 14px; }\n.stars { display: flex; gap: 8px; }\n.star { border: 0; background: none; font-size: 34px; cursor: pointer; color: #f59e0b; }\n.star.active { color: #d97706; }\np { margin: 0; }",
	js: "const stars = [...document.querySelectorAll('.star')];\nconst status = document.getElementById('rating-status');\nstars.forEach((star) => star.addEventListener('click', () => {\n  const value = Number(star.dataset.value);\n  stars.forEach((item, index) => { item.classList.toggle('active', index < value); item.textContent = index < value ? '★' : '☆'; });\n  status.textContent = 'Selected rating: ' + value + ' out of 5';\n}));",
	height: "380px",
	presentation: "hidden-code",
	variant: "canonical",
};
