import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="preview-card autocomplete-demo">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Autocomplete</span>
      <h2 class="preview-title">Search for a framework</h2>
    </div>
    <span id="autocomplete-count" class="preview-badge">0 matches</span>
  </div>

  <div class="preview-field">
    <label for="autocompleteInput">Search for an option</label>
    <div class="autocomplete__input-row">
      <input
        type="text"
        id="autocompleteInput"
        name="autocompleteInput"
        aria-autocomplete="list"
        aria-controls="suggestions-list"
        autocomplete="off"
        placeholder="Type React, Vue, Svelte..."
      />
      <button type="button" class="preview-button preview-button--ghost" id="autocomplete-clear" aria-label="Clear input">
        Clear
      </button>
    </div>
    <p id="autocomplete-status" class="preview-help">Start typing to filter the list.</p>
  </div>

  <ul id="suggestions-list" role="listbox" class="autocomplete__list" hidden></ul>
</div>`,
	css: `.autocomplete-demo {
  max-width: 520px;
  display: grid;
  gap: 16px;
  padding: 20px;
}

.autocomplete__input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.autocomplete__list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 8px;
}

.autocomplete__list li {
  padding: 11px 12px;
  border-radius: 14px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.76);
  font-weight: 600;
}

.autocomplete__list li:hover,
.autocomplete__list li[aria-selected="true"] {
  border-color: var(--preview-border-strong);
  background: var(--preview-primary-soft);
  color: var(--preview-primary-strong);
}
`,
	js: `const autocompleteInput = document.getElementById("autocompleteInput");
const autocompleteList = document.getElementById("suggestions-list");
const autocompleteStatus = document.getElementById("autocomplete-status");
const autocompleteCount = document.getElementById("autocomplete-count");
const autocompleteClear = document.getElementById("autocomplete-clear");
const frameworkOptions = [
  "React",
  "Remix",
  "Svelte",
  "Solid",
  "Vue",
  "Angular",
  "Astro",
  "Next.js"
];

function renderAutocompleteOptions(query) {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = frameworkOptions.filter((option) =>
    option.toLowerCase().includes(normalizedQuery)
  );

  autocompleteList.innerHTML = filteredOptions
    .map(
      (option) =>
        '<li role="option" tabindex="0" aria-selected="false" data-value="' +
        option +
        '">' +
        option +
        "</li>"
    )
    .join("");

  autocompleteCount.textContent = filteredOptions.length + " matches";
  autocompleteList.hidden = filteredOptions.length === 0 || normalizedQuery.length === 0;

  if (!normalizedQuery.length) {
    autocompleteStatus.textContent = "Start typing to filter the list.";
  } else if (!filteredOptions.length) {
    autocompleteStatus.textContent = 'No matches for "' + query + '".';
  } else {
    autocompleteStatus.textContent =
      "Use the filtered options to quickly complete your field.";
  }
}

autocompleteInput.addEventListener("input", () => {
  renderAutocompleteOptions(autocompleteInput.value);
});

autocompleteClear.addEventListener("click", () => {
  autocompleteInput.value = "";
  renderAutocompleteOptions("");
  autocompleteInput.focus();
});

autocompleteList.addEventListener("click", (event) => {
  const option = event.target.closest("[data-value]");
  if (!option) return;

  autocompleteInput.value = option.getAttribute("data-value") || "";
  renderAutocompleteOptions(autocompleteInput.value);
  autocompleteList.hidden = true;
  autocompleteStatus.textContent = 'Selected "' + autocompleteInput.value + '".';
});

renderAutocompleteOptions("");
`,
	presentation: "hidden-code",
	variant: "canonical",
};
