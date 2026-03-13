import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card signature-card">\n  <p><strong>Acknowledge and sign</strong></p>\n  <canvas id="signature-canvas" width="620" height="200"></canvas>\n  <div class="actions">\n    <button type="button" id="signature-clear">Clear</button>\n    <span id="signature-status" class="muted">Draw inside the box.</span>\n  </div>\n</div>',
	css: ".signature-card { padding: 20px; display: grid; gap: 14px; }\ncanvas { width: 100%; border: 2px dashed #94a3b8; border-radius: 14px; background: white; }\n.actions { display: flex; justify-content: space-between; align-items: center; gap: 12px; }\nbutton { border: 1px solid #cbd5e1; background: white; border-radius: 10px; padding: 10px 14px; }\np { margin: 0; }",
	js: "const canvas = document.getElementById('signature-canvas');\nconst ctx = canvas.getContext('2d');\nconst status = document.getElementById('signature-status');\nlet drawing = false;\nctx.lineWidth = 2.5;\nctx.lineCap = 'round';\ncanvas.addEventListener('pointerdown', (event) => { drawing = true; ctx.beginPath(); ctx.moveTo(event.offsetX, event.offsetY); });\ncanvas.addEventListener('pointermove', (event) => { if (!drawing) return; ctx.lineTo(event.offsetX, event.offsetY); ctx.stroke(); status.textContent = 'Signature captured.'; });\nwindow.addEventListener('pointerup', () => { drawing = false; });\ndocument.getElementById('signature-clear').addEventListener('click', () => { ctx.clearRect(0, 0, canvas.width, canvas.height); status.textContent = 'Draw inside the box.'; });",
	height: "430px",
	presentation: "hidden-code",
	variant: "canonical",
};
