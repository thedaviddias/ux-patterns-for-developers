import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="demo-shell command-palette-demo">
  <section class="preview-shell palette-wrapper">
    <div class="preview-toolbar">
      <p class="preview-help">Press <kbd>⌘</kbd> + <kbd>K</kbd> in many apps to jump straight to actions.</p>
      <span class="preview-chip">6 commands</span>
    </div>

    <div class="palette-modal">
      <input id="palette-input" type="search" placeholder="Search actions, pages, and people" />
      <div class="palette-groups" id="palette-list">
        <div class="palette-group">
          <span class="preview-eyebrow">Workspace</span>
          <button type="button" class="palette-item">Create workspace<span>⌘N</span></button>
          <button type="button" class="palette-item">Open settings<span>⌘,</span></button>
        </div>
        <div class="palette-group">
          <span class="preview-eyebrow">Navigation</span>
          <button type="button" class="palette-item">Search patterns<span>/</span></button>
          <button type="button" class="palette-item">Invite teammate<span>⌘I</span></button>
        </div>
      </div>
    </div>
  </section>
</div>`,
	css: `.command-palette-demo {
  width: min(100%, 920px);
}

.palette-wrapper {
  max-width: 720px;
  margin: 0 auto;
}

.palette-modal {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.18);
}

.palette-groups {
  display: grid;
  gap: 16px;
}

.palette-group {
  display: grid;
  gap: 8px;
}

.palette-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--preview-border);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.86);
  font-weight: 600;
}

.palette-item span {
  color: var(--preview-muted);
  font-size: 0.82rem;
}`,
	js: `const paletteInput = document.getElementById("palette-input");
const paletteItems = [...document.querySelectorAll(".palette-item")];

paletteInput.addEventListener("input", () => {
  const query = paletteInput.value.toLowerCase();
  paletteItems.forEach((item) => {
    item.hidden = !item.textContent.toLowerCase().includes(query);
  });
});
`,
	height: "560px",
	title: "Command palette overlay",
	presentation: "hidden-code",
	variant: "canonical",
};
