import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card video-card">\n  <div class="video-stage">Product walkthrough</div>\n  <div class="controls">\n    <button type="button" id="video-play">Play</button>\n    <div class="progress-track"><div id="video-fill"></div></div>\n    <button type="button">CC</button>\n  </div>\n</div>',
	css: ".video-card { padding: 20px; display: grid; gap: 12px; }\n.video-stage { min-height: 220px; border-radius: 18px; background: linear-gradient(135deg, #0f172a, #334155); color: white; display: grid; place-items: center; font-size: 22px; font-weight: 700; }\n.controls { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; }\nbutton { border: 0; border-radius: 10px; padding: 10px 12px; background: #0f172a; color: white; }\n.progress-track { height: 10px; border-radius: 999px; overflow: hidden; background: #e2e8f0; }\n#video-fill { width: 25%; height: 100%; background: #0ea5e9; }",
	js: "const play = document.getElementById('video-play');\nconst fill = document.getElementById('video-fill');\nlet progress = 25;\nplay.addEventListener('click', () => { progress = progress >= 100 ? 0 : progress + 25; fill.style.width = progress + '%'; play.textContent = progress > 0 && progress < 100 ? 'Pause' : progress >= 100 ? 'Replay' : 'Play'; });",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
