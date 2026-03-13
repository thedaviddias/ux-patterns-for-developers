import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="demo-shell model-selector-demo">
  <section class="preview-shell">
    <div class="preview-toolbar">
      <div class="preview-stack">
        <span class="preview-eyebrow">Model routing</span>
        <h2 class="preview-title">Choose the model for this run</h2>
      </div>
      <div class="preview-toolbar__group">
        <span class="preview-chip">Auto fallback on</span>
        <span id="selector-status" class="preview-badge">GPT-4.1 selected</span>
      </div>
    </div>

    <div class="selector-layout">
      <div class="selector-grid">
        <button
          type="button"
          class="model-card is-active"
          data-model="GPT-4.1"
          data-summary="Best for deep analysis, structured outputs, and tool-heavy runs."
          data-latency="Medium"
          data-context="128k"
          data-best="Research, planning, code review"
        >
          <span class="model-card__icon">◎</span>
          <strong>GPT-4.1</strong>
          <p class="preview-muted">High quality reasoning with reliable tool usage.</p>
          <div class="model-card__meta">
            <span class="preview-chip preview-chip--active">Recommended</span>
            <span class="preview-chip">Tool use</span>
          </div>
        </button>

        <button
          type="button"
          class="model-card"
          data-model="GPT-4.1 mini"
          data-summary="Best for lightweight drafting, triage, and low-latency assistant turns."
          data-latency="Fast"
          data-context="64k"
          data-best="Rewrites, tagging, lightweight chat"
        >
          <span class="model-card__icon">◌</span>
          <strong>GPT-4.1 mini</strong>
          <p class="preview-muted">Lower cost and faster streaming for day-to-day workflow steps.</p>
          <div class="model-card__meta">
            <span class="preview-chip">Fastest</span>
            <span class="preview-chip">Low cost</span>
          </div>
        </button>

        <button
          type="button"
          class="model-card"
          data-model="o3"
          data-summary="Best for complex reasoning, evaluation, and difficult multi-step problems."
          data-latency="Higher"
          data-context="200k"
          data-best="Debugging, planning, tradeoff analysis"
        >
          <span class="model-card__icon">◇</span>
          <strong>o3</strong>
          <p class="preview-muted">Slower, but stronger for multi-step reasoning and decision support.</p>
          <div class="model-card__meta">
            <span class="preview-chip preview-chip--warning">Deep reasoning</span>
            <span class="preview-chip">Higher cost</span>
          </div>
        </button>
      </div>

      <aside class="preview-panel preview-panel--muted selector-details">
        <div class="preview-stack">
          <span class="preview-eyebrow">Current route</span>
          <strong id="selector-model-name">GPT-4.1</strong>
          <p id="selector-summary" class="preview-muted">
            Best for deep analysis, structured outputs, and tool-heavy runs.
          </p>
        </div>

        <ul class="preview-list">
          <li><span>Latency</span><strong id="selector-latency">Medium</strong></li>
          <li><span>Context window</span><strong id="selector-context">128k</strong></li>
          <li><span>Best for</span><strong id="selector-best">Research, planning, code review</strong></li>
        </ul>

        <div class="preview-note">
          If the selected model becomes unavailable, the workspace falls back to GPT-4.1 mini and keeps the same tools enabled.
        </div>

        <div class="preview-actions">
          <button type="button" class="preview-button preview-button--primary" id="selector-apply">
            Apply to thread
          </button>
          <button type="button" class="preview-button preview-button--ghost">
            Compare models
          </button>
        </div>
      </aside>
    </div>
  </section>
</div>`,
	css: `.model-selector-demo {
  width: min(100%, 1100px);
}

.selector-layout {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.9fr);
}

.selector-grid {
  display: grid;
  gap: 14px;
}

.model-card {
  display: grid;
  gap: 12px;
  padding: 18px;
  border: 1px solid var(--preview-border);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.82);
  text-align: left;
  box-shadow: var(--preview-shadow-soft);
}

.model-card.is-active {
  border-color: rgba(37, 99, 235, 0.32);
  background: linear-gradient(180deg, rgba(219, 234, 254, 0.64), rgba(255, 255, 255, 0.9));
}

.model-card__icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.06);
  font-size: 1.1rem;
}

.model-card strong {
  font-size: 1rem;
}

.model-card__meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.selector-details strong {
  font-size: 1.15rem;
}

@media (max-width: 860px) {
  .selector-layout {
    grid-template-columns: 1fr;
  }
}`,
	js: `const selectorCards = [...document.querySelectorAll(".model-card")];
const selectorStatus = document.getElementById("selector-status");
const selectorModelName = document.getElementById("selector-model-name");
const selectorSummary = document.getElementById("selector-summary");
const selectorLatency = document.getElementById("selector-latency");
const selectorContext = document.getElementById("selector-context");
const selectorBest = document.getElementById("selector-best");
const selectorApply = document.getElementById("selector-apply");

function selectModel(card) {
  selectorCards.forEach((item) => item.classList.toggle("is-active", item === card));
  selectorStatus.textContent = card.dataset.model + " selected";
  selectorModelName.textContent = card.dataset.model;
  selectorSummary.textContent = card.dataset.summary;
  selectorLatency.textContent = card.dataset.latency;
  selectorContext.textContent = card.dataset.context;
  selectorBest.textContent = card.dataset.best;
  selectorApply.textContent = "Apply " + card.dataset.model;
}

selectorCards.forEach((card) => {
  card.addEventListener("click", () => selectModel(card));
});

selectorApply.addEventListener("click", () => {
  selectorStatus.textContent = selectorModelName.textContent + " applied to this thread";
});
`,
	height: "640px",
	title: "Model selector workspace",
	presentation: "hidden-code",
	variant: "canonical",
};
