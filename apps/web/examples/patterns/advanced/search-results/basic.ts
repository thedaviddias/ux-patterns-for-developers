import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="demo-shell search-results-demo">
  <section class="preview-shell">
    <div class="preview-toolbar">
      <div class="preview-stack">
        <span class="preview-eyebrow">Search results</span>
        <h2 class="preview-title">24 results for “design systems”</h2>
      </div>
      <span class="preview-chip">Sorted by relevance</span>
    </div>

    <div class="results-filters">
      <button type="button" class="preview-chip preview-chip--active">Guides</button>
      <button type="button" class="preview-chip">Patterns</button>
      <button type="button" class="preview-chip">Articles</button>
      <button type="button" class="preview-chip">Examples</button>
    </div>

    <div class="result-list">
      <article class="result-card">
        <span class="preview-eyebrow">Guide</span>
        <h3>Design system foundations</h3>
        <p class="preview-muted">Start with tokens, components, and documentation that teams can actually keep current.</p>
      </article>
      <article class="result-card">
        <span class="preview-eyebrow">Article</span>
        <h3>Pattern libraries that scale</h3>
        <p class="preview-muted">Compare maintenance models for component inventories, examples, and review workflows.</p>
      </article>
      <article class="result-card">
        <span class="preview-eyebrow">Pattern</span>
        <h3>Command palette</h3>
        <p class="preview-muted">A focused command surface for global actions, search, and navigation shortcuts.</p>
      </article>
    </div>
  </section>
</div>`,
	css: `.search-results-demo {
  width: min(100%, 980px);
}

.results-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.result-list {
  display: grid;
  gap: 14px;
}

.result-card {
  display: grid;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--preview-border);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: var(--preview-shadow-soft);
}

.result-card h3 {
  font-size: 1rem;
}`,
	js: "",
	height: "560px",
	title: "Search results workspace",
	presentation: "hidden-code",
	variant: "canonical",
};
