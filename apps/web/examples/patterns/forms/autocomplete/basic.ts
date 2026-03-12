import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<!-- Basic Autocomplete Markup -->
<div>
  <label for="autocompleteInput">Search for an option</label>
  <input
    type="text"
    id="autocompleteInput"
    name="autocompleteInput"
    aria-autocomplete="list"
    aria-controls="suggestions-list"
    autocomplete="off"
    placeholder="Type to search..."
  />
  <button type="button" aria-label="Clear input">✕</button>
  <ul id="suggestions-list" role="listbox">
    <!-- Dynamically generated suggestions go here -->
  </ul>
</div>`,
	presentation: "hidden-code",
	variant: "canonical",
};
