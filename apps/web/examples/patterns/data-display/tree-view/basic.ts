import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card tree-card">\n  <ul class="tree">\n    <li><button type="button" class="tree-toggle" aria-expanded="true">Design system</button>\n      <ul>\n        <li>Tokens</li>\n        <li>Components</li>\n      </ul>\n    </li>\n    <li><button type="button" class="tree-toggle" aria-expanded="false">Documentation</button>\n      <ul hidden>\n        <li>Patterns</li>\n        <li>Guides</li>\n      </ul>\n    </li>\n  </ul>\n</div>',
	css: ".tree-card { padding: 20px; }\n.tree, .tree ul { list-style: none; margin: 0; padding-left: 18px; display: grid; gap: 10px; }\n.tree-toggle { border: 0; background: none; font-weight: 700; padding: 0; text-align: left; cursor: pointer; }",
	js: "document.querySelectorAll('.tree-toggle').forEach((button) => {\n  button.addEventListener('click', () => {\n    const expanded = button.getAttribute('aria-expanded') === 'true';\n    button.setAttribute('aria-expanded', String(!expanded));\n    button.nextElementSibling.hidden = expanded;\n  });\n});",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
