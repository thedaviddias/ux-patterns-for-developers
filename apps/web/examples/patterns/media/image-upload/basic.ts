import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card upload-card">\n  <label for="upload-input">Upload an image</label>\n  <input id="upload-input" type="file" accept="image/*" />\n  <div id="upload-preview" class="preview muted">PNG or JPG up to 5 MB.</div>\n</div>',
	css: ".upload-card { padding: 20px; display: grid; gap: 12px; }\nlabel { font-weight: 600; }\ninput { border: 1px dashed #94a3b8; border-radius: 14px; padding: 16px; background: white; }\n.preview { min-height: 160px; border-radius: 14px; background: #f8fafc; display: grid; place-items: center; text-align: center; padding: 16px; }\n.preview.has-image { background: linear-gradient(135deg, #dbeafe, #f8fafc); color: #0f172a; font-weight: 700; }",
	js: "const input = document.getElementById('upload-input');\nconst preview = document.getElementById('upload-preview');\ninput.addEventListener('change', () => {\n  const file = input.files && input.files[0];\n  if (!file) return;\n  preview.classList.add('has-image');\n  preview.textContent = 'Selected: ' + file.name;\n});",
	height: "360px",
	presentation: "hidden-code",
	variant: "canonical",
};
