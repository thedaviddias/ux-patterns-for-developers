import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card rte">\n  <div class="toolbar">\n    <button type="button" data-command="bold"><strong>B</strong></button>\n    <button type="button" data-command="italic"><em>I</em></button>\n    <button type="button" data-command="insertUnorderedList">• List</button>\n  </div>\n  <div class="editor" contenteditable="true">Start typing meeting notes here.</div>\n  <p class="muted">Formatting is intentionally lightweight in this demo.</p>\n</div>',
	css: ".rte { padding: 18px; display: grid; gap: 12px; }\n.toolbar { display: flex; gap: 8px; flex-wrap: wrap; }\n.toolbar button { border: 1px solid #cbd5e1; background: white; border-radius: 10px; padding: 8px 12px; }\n.editor { min-height: 180px; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px; background: white; line-height: 1.6; }\np { margin: 0; font-size: 14px; }",
	js: "document.querySelectorAll('[data-command]').forEach((button) => {\n  button.addEventListener('click', () => { document.execCommand(button.dataset.command, false); });\n});",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
