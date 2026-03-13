import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell">\n  <div class="card form-card">\n    <label for="demo-input">Mobile number</label>\n    <input id="demo-input" type="tel" placeholder="+1 (555) 123-4567" />\n    <p class="helper">Include the country code when numbers may come from different regions.</p>\n    \n  </div>\n</div>',
	css: ".form-card { padding: 24px; display: grid; gap: 12px; }\nlabel { font-weight: 600; }\ninput, textarea, select { width: 100%; border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; background: #fff; }\n.helper { margin: 0; font-size: 14px; color: #64748b; }\n.status { font-size: 14px; color: #0f766e; }\n.error { color: #b91c1c; }",
	js: "const input = document.getElementById('demo-input');\ninput.addEventListener('blur', () => {\n  const digits = input.value.replace(/\\D/g, '');\n  if (digits.length === 10) input.value = '+1 ' + digits.replace(/(\\d{3})(\\d{3})(\\d{4})/, '($1) $2-$3');\n});",
	height: "420px",
	presentation: "hidden-code",
	variant: "canonical",
};
