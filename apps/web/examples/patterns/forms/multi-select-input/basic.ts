import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="multi-select" id="skills-select">
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
    <!-- More options -->
  </ul>
</div>`,
	presentation: "hidden-code",
	variant: "canonical",
};
