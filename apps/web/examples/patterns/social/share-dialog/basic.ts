import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card share-card">\n  <button type="button" id="share-copy">Copy link</button>\n  <div id="share-status" class="muted">Copy the current page or open a platform-native share flow.</div>\n</div>',
	css: ".share-card { padding: 24px; display: grid; gap: 12px; }\nbutton { width: fit-content; border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; }\n#share-status { min-height: 22px; }",
	js: "const button = document.getElementById('share-copy');\nconst status = document.getElementById('share-status');\nbutton.addEventListener('click', async () => {\n  try { await navigator.clipboard.writeText('https://uxpatterns.dev/patterns/share-dialog'); status.textContent = 'Link copied to clipboard.'; } catch { status.textContent = 'Copy simulated for this demo.'; }\n});",
	height: "320px",
	presentation: "hidden-code",
	variant: "canonical",
};
