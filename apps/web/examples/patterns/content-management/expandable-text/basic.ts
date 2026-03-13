import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExpandableTextExample: PatternExampleDefinition = {
	html: `<div class="preview-card expandable-text">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Expandable text</span>
      <h2 class="preview-title">Product update summary</h2>
    </div>
    <span class="preview-badge">Collapsed</span>
  </div>

  <p id="expandable-text" class="expandable-text__copy">
    This release improves onboarding, billing visibility, and notification controls.
    <span id="hidden-text" hidden>
      Teams can now invite members from the setup checklist, configure workspace
      billing without leaving the project view, and fine-tune alerts for comments,
      mentions, and deployment events.
    </span>
  </p>
  <button id="expand-button" class="preview-button preview-button--ghost" aria-expanded="false" aria-controls="hidden-text">
    Read More <span aria-hidden="true">▾</span>
  </button>
</div>`,
	css: `.expandable-text {
  max-width: 540px;
  display: grid;
  gap: 16px;
  padding: 20px;
}

.expandable-text__copy {
  color: var(--preview-muted);
}
`,
	js: `const button = document.getElementById("expand-button");
  const text = document.getElementById("hidden-text");
  const icon = button.querySelector("span");
  const badge = document.querySelector(".expandable-text .preview-badge");

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", !isExpanded);
    text.hidden = isExpanded;
    badge.textContent = isExpanded ? "Collapsed" : "Expanded";

    button.textContent = isExpanded ? "Read More" : "Read Less";
    button.appendChild(icon);
    icon.textContent = isExpanded ? "▾" : "▴";
  });`,
};
