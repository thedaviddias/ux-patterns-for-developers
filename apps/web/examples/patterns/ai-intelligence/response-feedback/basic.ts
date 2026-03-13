import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="demo-shell response-feedback-demo">
  <section class="preview-shell">
    <div class="preview-toolbar">
      <div class="preview-stack">
        <span class="preview-eyebrow">Response quality</span>
        <h2 class="preview-title">Capture feedback before regenerating</h2>
      </div>
      <span id="feedback-status" class="preview-badge">Awaiting review</span>
    </div>

    <article class="preview-response feedback-answer">
      <div class="preview-toolbar">
        <span class="preview-chip preview-chip--active">Draft answer</span>
        <span class="preview-chip">Model: GPT-4.1</span>
      </div>
      <p>
        The onboarding funnel loses users at the “connect a workspace” step. The shortest path to improvement is clearer setup guidance, fewer required fields, and a saved-draft state for interrupted sessions.
      </p>
      <div class="preview-note">
        Teams usually need a quick signal first, then a structured reason when the answer misses the mark.
      </div>
    </article>

    <div class="feedback-layout">
      <div class="preview-panel">
        <strong>Was this useful?</strong>
        <div class="feedback-actions">
          <button type="button" class="feedback-button" data-feedback="Helpful">👍 Helpful</button>
          <button type="button" class="feedback-button" data-feedback="Needs work">👎 Needs work</button>
          <button type="button" class="preview-button preview-button--ghost" id="feedback-regenerate">
            Regenerate answer
          </button>
        </div>
      </div>

      <div class="preview-panel preview-panel--muted">
        <strong>Why?</strong>
        <div class="feedback-tags">
          <button type="button" class="preview-chip">Too generic</button>
          <button type="button" class="preview-chip">Missed source detail</button>
          <button type="button" class="preview-chip">Wrong level of depth</button>
        </div>
        <p class="preview-help">Keep the original answer visible so users can compare before they retry.</p>
      </div>
    </div>
  </section>
</div>`,
	css: `.response-feedback-demo {
  width: min(100%, 1040px);
}

.feedback-layout {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.88fr);
}

.feedback-actions,
.feedback-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.feedback-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 14px;
  border: 1px solid var(--preview-border);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  font-weight: 600;
}

.feedback-button.is-active {
  border-color: rgba(37, 99, 235, 0.24);
  background: rgba(37, 99, 235, 0.1);
  color: var(--preview-primary-strong);
}

@media (max-width: 800px) {
  .feedback-layout {
    grid-template-columns: 1fr;
  }
}`,
	js: `const feedbackStatus = document.getElementById("feedback-status");
const feedbackButtons = [...document.querySelectorAll(".feedback-button")];
const feedbackRegenerate = document.getElementById("feedback-regenerate");

feedbackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    feedbackButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    feedbackStatus.textContent = button.dataset.feedback + " recorded";
  });
});

feedbackRegenerate.addEventListener("click", () => {
  feedbackStatus.textContent = "Feedback saved and retry queued";
});
`,
	height: "620px",
	title: "Response feedback review",
	presentation: "hidden-code",
	variant: "canonical",
};
