import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="preview-card multi-select" id="skills-select">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Multi-select</span>
      <h2 class="preview-title">Skills filter</h2>
    </div>
    <span id="skills-status" class="preview-badge">1 selected</span>
  </div>

  <label id="skills-label" for="skills-input">Skills</label>
  <div
    class="multi-select__input-area"
    role="combobox"
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-labelledby="skills-label"
    aria-owns="skills-listbox"
  >
    <!-- Selected tags rendered here -->
    <span class="multi-select__tag">
      <span class="multi-select__tag-label">React</span>
      <button
        type="button"
        class="multi-select__tag-remove"
        aria-label="Remove React"
      >&times;</button>
    </span>

    <input
      type="text"
      id="skills-input"
      class="multi-select__search"
      placeholder="Add skills..."
      autocomplete="off"
      aria-autocomplete="list"
      aria-controls="skills-listbox"
      aria-activedescendant=""
    />
  </div>

  <ul
    id="skills-listbox"
    class="multi-select__dropdown"
    role="listbox"
    aria-multiselectable="true"
    aria-label="Skills options"
    hidden
  >
    <li
      id="skill-react"
      role="option"
      aria-selected="true"
      class="multi-select__option multi-select__option--selected"
    >
      <span class="multi-select__checkbox" aria-hidden="true">✓</span>
      React
    </li>
    <li
      id="skill-typescript"
      role="option"
      aria-selected="false"
      class="multi-select__option"
    >
      <span class="multi-select__checkbox" aria-hidden="true"></span>
      TypeScript
    </li>
    <li
      id="skill-node"
      role="option"
      aria-selected="false"
      class="multi-select__option"
    >
      <span class="multi-select__checkbox" aria-hidden="true"></span>
      Node.js
    </li>
  </ul>
</div>`,
	css: `.multi-select {
  max-width: 520px;
  display: grid;
  gap: 16px;
  padding: 20px;
}

.multi-select__input-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--preview-border);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
}

.multi-select__tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--preview-primary-soft);
  color: var(--preview-primary-strong);
  font-weight: 700;
}

.multi-select__tag-remove {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 0;
  background: rgba(255, 255, 255, 0.76);
}

.multi-select__search {
  min-width: 160px;
  flex: 1;
  border: 0;
  padding: 8px;
  background: transparent;
}

.multi-select__dropdown {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 8px;
}

.multi-select__option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.76);
  font-weight: 600;
}

.multi-select__option--selected,
.multi-select__option:hover {
  border-color: var(--preview-border-strong);
  background: var(--preview-primary-soft);
  color: var(--preview-primary-strong);
}

.multi-select__checkbox {
  width: 18px;
  height: 18px;
  display: inline-grid;
  place-items: center;
  border-radius: 6px;
  border: 1px solid currentColor;
}
`,
	js: `const skillsInput = document.getElementById("skills-input");
const skillsCombobox = document.querySelector(".multi-select__input-area");
const skillsDropdown = document.getElementById("skills-listbox");
const skillsStatus = document.getElementById("skills-status");

function updateSkillsStatus() {
  const selectedCount = document.querySelectorAll('.multi-select__option[aria-selected="true"]').length;
  skillsStatus.textContent = selectedCount + " selected";
}

skillsInput.addEventListener("focus", () => {
  skillsDropdown.hidden = false;
  skillsCombobox.setAttribute("aria-expanded", "true");
});

skillsInput.addEventListener("input", () => {
  const query = skillsInput.value.toLowerCase();
  document.querySelectorAll(".multi-select__option").forEach((option) => {
    option.hidden = !option.textContent.toLowerCase().includes(query);
  });
});

skillsDropdown.addEventListener("click", (event) => {
  const option = event.target.closest(".multi-select__option");
  if (!option) return;

  const isSelected = option.getAttribute("aria-selected") === "true";
  option.setAttribute("aria-selected", String(!isSelected));
  option.classList.toggle("multi-select__option--selected", !isSelected);
  option.querySelector(".multi-select__checkbox").textContent = !isSelected ? "✓" : "";
  updateSkillsStatus();
});

document.querySelectorAll(".multi-select__tag-remove").forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".multi-select__tag").remove();
    const reactOption = document.getElementById("skill-react");
    reactOption.setAttribute("aria-selected", "false");
    reactOption.classList.remove("multi-select__option--selected");
    reactOption.querySelector(".multi-select__checkbox").textContent = "";
    updateSkillsStatus();
  });
});

updateSkillsStatus();
`,
	presentation: "hidden-code",
	variant: "canonical",
};
