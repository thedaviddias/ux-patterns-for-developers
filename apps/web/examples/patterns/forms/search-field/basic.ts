import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card search-demo">\n  <label for="search-demo-input">Search patterns</label>\n  <div class="search-row">\n    <input id="search-demo-input" type="search" placeholder="Search forms, navigation, media..." />\n    <button type="button" id="search-clear">Clear</button>\n  </div>\n  <ul id="search-list">\n    <li>Autocomplete</li>\n    <li>Pagination</li>\n    <li>Empty States</li>\n    <li>Image Upload</li>\n  </ul>\n</div>',
	css: ".search-demo { padding: 24px; display: grid; gap: 12px; }\nlabel { font-weight: 600; }\n.search-row { display: grid; gap: 10px; grid-template-columns: 1fr auto; }\ninput { border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; }\nbutton { border: 1px solid #cbd5e1; background: white; border-radius: 12px; padding: 12px 14px; }\nul { margin: 0; padding-left: 20px; display: grid; gap: 8px; }",
	js: "const input = document.getElementById('search-demo-input');\nconst clear = document.getElementById('search-clear');\nconst list = document.getElementById('search-list');\nconst items = [...list.querySelectorAll('li')];\ninput.addEventListener('input', () => {\n  const query = input.value.toLowerCase();\n  items.forEach((item) => { item.hidden = !item.textContent.toLowerCase().includes(query); });\n});\nclear.addEventListener('click', () => { input.value = ''; items.forEach((item) => item.hidden = false); input.focus(); });",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
