import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="demo-shell token-counter-demo">
  <section class="preview-shell">
    <div class="preview-toolbar">
      <div class="preview-stack">
        <span class="preview-eyebrow">Token budgeting</span>
        <h2 class="preview-title">Watch budget before sending</h2>
      </div>
      <span class="preview-chip">Context protection enabled</span>
    </div>

    <div class="preview-split">
      <div class="preview-composer">
        <label for="token-textarea"><strong>Prompt draft</strong></label>
        <textarea
          id="token-textarea"
          rows="7"
          placeholder="Explain the difference between pagination and infinite scroll for a product team."
        >Explain the difference between pagination and infinite scroll for a product team. Include performance tradeoffs, analytics impact, and when to use each pattern.</textarea>
        <div class="token-footer">
          <span id="token-count" class="preview-badge preview-badge--subtle">0 estimated tokens</span>
          <button type="button" class="preview-button preview-button--primary">Send to model</button>
        </div>
      </div>

      <aside class="preview-panel preview-panel--muted token-sidebar">
        <strong>Session budget</strong>
        <ul class="preview-list">
          <li><span>Estimated prompt</span><strong id="token-estimate">0</strong></li>
          <li><span>Target model</span><strong>GPT-4.1</strong></li>
          <li><span>Projected cost</span><strong id="token-cost">$0.00</strong></li>
          <li><span>Remaining context</span><strong id="token-remaining">128k safe</strong></li>
        </ul>
        <div id="token-warning" class="preview-note">
          Large prompts should preserve enough space for output and tool traces.
        </div>
      </aside>
    </div>
  </section>
</div>`,
	css: `.token-counter-demo {
  width: min(100%, 1080px);
}

.token-counter-demo textarea {
  min-height: 180px;
  resize: vertical;
  line-height: 1.6;
}

.token-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.token-sidebar {
  align-content: start;
}`,
	js: `const tokenTextarea = document.getElementById("token-textarea");
const tokenCount = document.getElementById("token-count");
const tokenEstimate = document.getElementById("token-estimate");
const tokenCost = document.getElementById("token-cost");
const tokenRemaining = document.getElementById("token-remaining");
const tokenWarning = document.getElementById("token-warning");

function updateTokenBudget() {
  const words = tokenTextarea.value.trim().split(/\\s+/).filter(Boolean).length;
  const estimate = Math.max(12, Math.ceil(words * 1.34));
  const cost = (estimate * 0.000012).toFixed(2);
  const remaining = 128000 - estimate;
  tokenCount.textContent = estimate + " estimated tokens";
  tokenEstimate.textContent = estimate + " tokens";
  tokenCost.textContent = "$" + cost;
  tokenRemaining.textContent = remaining > 8000 ? Math.round(remaining / 1000) + "k safe" : "Tight budget";
  tokenWarning.textContent = remaining > 8000
    ? "Large prompts should preserve enough space for output and tool traces."
    : "This draft is close to the context budget. Trim examples or split the request.";
}

tokenTextarea.addEventListener("input", updateTokenBudget);
updateTokenBudget();
`,
	height: "640px",
	title: "Token budget panel",
	presentation: "hidden-code",
	variant: "canonical",
};
