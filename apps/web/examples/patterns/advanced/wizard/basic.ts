import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="demo-shell wizard-demo">
  <section class="preview-shell">
    <div class="preview-toolbar">
      <div class="preview-stack">
        <span class="preview-eyebrow">Setup wizard</span>
        <h2 class="preview-title">Create a new workspace</h2>
      </div>
      <span id="wizard-status" class="preview-badge">Step 1 of 3</span>
    </div>

    <ol class="steps">
      <li class="active">Details</li>
      <li>Members</li>
      <li>Review</li>
    </ol>

    <div class="preview-panel wizard-panel" id="wizard-panel">
      <h3>Workspace details</h3>
      <p class="preview-muted">Name the workspace and choose a short description.</p>
    </div>

    <div class="wizard-actions">
      <button type="button" class="preview-button preview-button--ghost" id="wizard-back" disabled>Back</button>
      <button type="button" class="preview-button preview-button--primary" id="wizard-next">Next</button>
    </div>
  </section>
</div>`,
	css: `.wizard-demo {
  width: min(100%, 900px);
}

.steps {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.steps li {
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.78);
  text-align: center;
  font-weight: 600;
  color: var(--preview-muted-strong);
}

.steps li.active {
  border-color: rgba(37, 99, 235, 0.24);
  background: rgba(37, 99, 235, 0.1);
  color: var(--preview-primary-strong);
}

.wizard-panel {
  min-height: 150px;
}

.wizard-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 640px) {
  .steps {
    grid-template-columns: 1fr;
  }
}`,
	js: `const wizardSteps = [...document.querySelectorAll(".steps li")];
const wizardPanel = document.getElementById("wizard-panel");
const wizardBack = document.getElementById("wizard-back");
const wizardNext = document.getElementById("wizard-next");
const wizardStatus = document.getElementById("wizard-status");
const wizardViews = [
  ["Workspace details", "Name the workspace and choose a short description."],
  ["Invite members", "Choose who should join first and what role they need."],
  ["Review", "Confirm the setup before creating the workspace."],
];
let wizardCurrent = 0;

function renderWizard() {
  wizardSteps.forEach((step, index) => step.classList.toggle("active", index === wizardCurrent));
  wizardPanel.innerHTML = "<h3>" + wizardViews[wizardCurrent][0] + "</h3><p class=\\"preview-muted\\">" + wizardViews[wizardCurrent][1] + "</p>";
  wizardBack.disabled = wizardCurrent === 0;
  wizardNext.textContent = wizardCurrent === wizardViews.length - 1 ? "Finish" : "Next";
  wizardStatus.textContent = "Step " + (wizardCurrent + 1) + " of " + wizardViews.length;
}

wizardBack.addEventListener("click", () => {
  wizardCurrent = Math.max(0, wizardCurrent - 1);
  renderWizard();
});

wizardNext.addEventListener("click", () => {
  wizardCurrent = Math.min(wizardViews.length - 1, wizardCurrent + 1);
  renderWizard();
});

renderWizard();
`,
	height: "580px",
	title: "Setup wizard flow",
	presentation: "hidden-code",
	variant: "canonical",
};
