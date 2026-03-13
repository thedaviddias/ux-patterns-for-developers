import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="preview-card link-demo">
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <div class="preview-grid">
    <div class="preview-header">
      <div class="preview-grid">
        <span class="preview-eyebrow">Link patterns</span>
        <h2 class="preview-title">Inline, external, jump, and download links</h2>
      </div>
      <span class="preview-badge">Accessible states</span>
    </div>

    <div class="preview-note">
      Read the <a href="/docs/getting-started" class="link-inline">getting started guide</a>
      to begin.
    </div>

    <ul class="preview-list">
      <li>
        <a href="https://w3.org/WAI/" target="_blank" rel="noopener noreferrer">
          WAI Guidelines <span aria-hidden="true">↗</span>
          <span class="sr-only">(opens in new tab)</span>
        </a>
        <span class="preview-muted">External resource</span>
      </li>
      <li>
        <a href="#pricing">Jump to pricing</a>
        <span class="preview-muted">Anchor link</span>
      </li>
      <li>
        <a href="/files/report.pdf" download>Download annual report (PDF, 2.4 MB)</a>
        <span class="preview-muted">Download</span>
      </li>
    </ul>

    <section id="pricing" class="preview-note">
      Pricing anchors should move focus to the relevant section without opening a
      new page.
    </section>

    <main id="main-content" class="target-content">
      <span class="preview-eyebrow">Main content</span>
      <p class="preview-muted">This is the destination for the skip link.</p>
    </main>
  </div>
</div>`,
	css: `.link-demo {
  position: relative;
  padding: 20px;
}

.skip-link {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--preview-primary-strong);
  color: white;
  transform: translateY(-150%);
  transition: transform 0.18s ease;
}

.skip-link:focus {
  transform: translateY(0);
  text-decoration: none;
}

.target-content {
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.76);
}
`,
	presentation: "hidden-code",
	variant: "canonical",
};
