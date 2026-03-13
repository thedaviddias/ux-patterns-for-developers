import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="popover-demo">
  <button id="popoverTrigger" class="preview-button preview-button--primary" aria-haspopup="dialog" aria-expanded="false">
    Open Popover
  </button>

  <div
    id="customPopover"
    class="popover"
    role="dialog"
    aria-labelledby="popoverTitle"
    hidden
  >
    <div class="popover-content preview-card">
      <button type="button" class="popover-close" aria-label="Close popover">
        ×
      </button>

      <h3 id="popoverTitle" class="preview-title">Quick actions</h3>
      <p class="preview-muted">Save this pattern to a collection or share it with your team.</p>

      <div class="preview-actions">
        <button type="button" class="preview-button preview-button--ghost">Save</button>
        <button type="button" class="preview-button">Share link</button>
      </div>
    </div>
  </div>
</div>`,
	css: `.popover-demo {
  position: relative;
  min-height: 230px;
  display: grid;
  place-items: start;
}

.popover {
  position: absolute;
  top: 64px;
  left: 0;
  width: min(100%, 340px);
}

.popover-content {
  position: relative;
  display: grid;
  gap: 14px;
  padding: 20px;
}

.popover-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.86);
}
`,
	js: `const popoverTrigger = document.getElementById("popoverTrigger");
const popover = document.getElementById("customPopover");
const popoverClose = document.querySelector(".popover-close");

function closePopover() {
  popoverTrigger.setAttribute("aria-expanded", "false");
  popover.hidden = true;
}

popoverTrigger.addEventListener("click", () => {
  const expanded = popoverTrigger.getAttribute("aria-expanded") === "true";
  popoverTrigger.setAttribute("aria-expanded", String(!expanded));
  popover.hidden = expanded;
});

popoverClose.addEventListener("click", closePopover);

document.addEventListener("click", (event) => {
  if (popover.hidden) return;
  if (popover.contains(event.target) || popoverTrigger.contains(event.target)) return;
  closePopover();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePopover();
  }
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
