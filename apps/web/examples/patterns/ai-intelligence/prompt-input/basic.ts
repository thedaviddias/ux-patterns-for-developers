import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="demo-shell prompt-input-demo">
  <section class="preview-shell">
    <div class="preview-toolbar">
      <div class="preview-stack">
        <span class="preview-eyebrow">Prompt composer</span>
        <h2 class="preview-title">Draft the next assistant turn</h2>
      </div>
      <div class="preview-toolbar__group">
        <span class="preview-chip preview-chip--active">Research mode</span>
        <span class="preview-chip">Files attached: 2</span>
      </div>
    </div>

    <div class="preview-response transcript-card">
      <div class="transcript-bubble transcript-bubble--user">
        <span class="preview-eyebrow">You</span>
        <p>Summarize the product feedback themes from the onboarding interviews and propose the top three fixes.</p>
      </div>
      <div class="transcript-bubble">
        <span class="preview-eyebrow">Assistant</span>
        <p>The strongest themes are setup friction, unclear success states, and repeated form work. I can turn this into a concise launch brief or a prioritized changelog.</p>
      </div>
    </div>

    <div class="preview-composer composer-card">
      <div class="preview-toolbar__group">
        <span class="preview-chip">Summarize</span>
        <span class="preview-chip">Rewrite</span>
        <span class="preview-chip">Create task list</span>
      </div>

      <textarea
        id="prompt-input"
        rows="5"
        placeholder="Ask the assistant to transform the current thread into a concise leadership update."
      >Turn the interview notes into a launch-readiness update with risks, quick wins, and owner recommendations.</textarea>

      <div class="composer-footer">
        <div class="preview-toolbar__group">
          <span class="preview-chip">Knowledge base</span>
          <span class="preview-chip">Web search</span>
          <span class="preview-chip">Reasoning: medium</span>
        </div>

        <div class="composer-meta">
          <span id="prompt-token-count" class="preview-badge preview-badge--subtle">31 estimated tokens</span>
          <button type="button" class="preview-button preview-button--primary" id="prompt-send">
            Send prompt
          </button>
        </div>
      </div>
    </div>
  </section>
</div>`,
	css: `.prompt-input-demo {
  width: min(100%, 1080px);
}

.transcript-card {
  gap: 12px;
}

.transcript-bubble {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid var(--preview-border);
}

.transcript-bubble--user {
  background: rgba(219, 234, 254, 0.5);
}

.composer-card textarea {
  min-height: 148px;
  resize: vertical;
  line-height: 1.6;
}

.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.composer-meta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}`,
	js: `const promptInput = document.getElementById("prompt-input");
const promptTokenCount = document.getElementById("prompt-token-count");
const promptSend = document.getElementById("prompt-send");

function updatePromptCount() {
  const words = promptInput.value.trim().split(/\\s+/).filter(Boolean).length;
  const estimate = Math.max(6, Math.ceil(words * 1.32));
  promptTokenCount.textContent = estimate + " estimated tokens";
}

promptInput.addEventListener("input", updatePromptCount);
promptSend.addEventListener("click", () => {
  promptSend.textContent = "Queued for analysis";
});

updatePromptCount();
`,
	height: "660px",
	title: "Prompt input composer",
	presentation: "hidden-code",
	variant: "canonical",
};
