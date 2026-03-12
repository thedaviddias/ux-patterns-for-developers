import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExpandableTextExample: PatternExampleDefinition = {
	html: `<div>
  <p id="expandable-text">
    This is the visible content...
    <span id="hidden-text" hidden>
      This is the additional content that is initially hidden.
    </span>
  </p>
  <button id="expand-button" aria-expanded="false" aria-controls="hidden-text">
    Read More <span aria-hidden="true">▾</span>
  </button>
</div>`,
	js: `const button = document.getElementById("expand-button");
  const text = document.getElementById("hidden-text");
  const icon = button.querySelector("span");

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", !isExpanded);
    text.hidden = isExpanded;

    button.textContent = isExpanded ? "Read More" : "Read Less";
    button.appendChild(icon);
    icon.textContent = isExpanded ? "▾" : "▴";
  });`,
};
