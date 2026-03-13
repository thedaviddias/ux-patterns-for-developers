import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card tag-card">\n  <label for="tag-input">Topics</label>\n  <div class="tag-list" id="tag-list">\n    <span class="tag">Accessibility <button type="button" aria-label="Remove Accessibility">×</button></span>\n  </div>\n  <input id="tag-input" type="text" placeholder="Type a tag and press Enter" />\n</div>',
	css: ".tag-card { padding: 24px; display: grid; gap: 12px; }\nlabel { font-weight: 600; }\n.tag-list { display: flex; flex-wrap: wrap; gap: 8px; }\n.tag { display: inline-flex; gap: 8px; align-items: center; padding: 8px 12px; border-radius: 999px; background: #e2e8f0; }\n.tag button { border: 0; background: none; cursor: pointer; }\ninput { border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; }",
	js: "const input = document.getElementById('tag-input');\nconst list = document.getElementById('tag-list');\nfunction wireRemoval(button) { button.addEventListener('click', () => button.parentElement.remove()); }\nlist.querySelectorAll('button').forEach(wireRemoval);\ninput.addEventListener('keydown', (event) => {\n  if (event.key !== 'Enter' || !input.value.trim()) return;\n  event.preventDefault();\n  const tag = document.createElement('span');\n  tag.className = 'tag';\n  tag.innerHTML = input.value.trim() + ' <button type=\"button\" aria-label=\"Remove tag\">×</button>';\n  list.appendChild(tag);\n  wireRemoval(tag.querySelector('button'));\n  input.value = '';\n});",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
