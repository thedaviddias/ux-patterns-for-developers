import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card dnd-card">\n  <p><strong>Reorder the launch checklist</strong></p>\n  <ul id="dnd-list">\n    <li draggable="true">Draft release notes</li>\n    <li draggable="true">QA the signup flow</li>\n    <li draggable="true">Prepare launch email</li>\n  </ul>\n</div>',
	css: ".dnd-card { padding: 20px; display: grid; gap: 12px; }\nul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }\nli { padding: 12px 14px; border-radius: 12px; border: 1px solid #cbd5e1; background: white; cursor: grab; }\nli.dragging { opacity: 0.5; }\np { margin: 0; }",
	js: "const list = document.getElementById('dnd-list');\nlet dragged = null;\nlist.querySelectorAll('li').forEach((item) => {\n  item.addEventListener('dragstart', () => { dragged = item; item.classList.add('dragging'); });\n  item.addEventListener('dragend', () => item.classList.remove('dragging'));\n  item.addEventListener('dragover', (event) => event.preventDefault());\n  item.addEventListener('drop', (event) => {\n    event.preventDefault();\n    if (dragged && dragged !== item) list.insertBefore(dragged, item);\n  });\n});",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
