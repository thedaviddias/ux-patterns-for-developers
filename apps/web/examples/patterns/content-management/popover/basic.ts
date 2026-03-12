import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<!-- Trigger Button -->
<button id="popoverTrigger" aria-haspopup="true" aria-expanded="false">
  Open Popover
</button>

<!-- Popover -->
<div
  id="customPopover"
  class="popover"
  role="dialog"
  aria-labelledby="popoverTitle"
  hidden
>
  <div class="popover-content">
    <button type="button" class="popover-close" aria-label="Close popover">
      &times;
    </button>

    <h3 id="popoverTitle">Popover Title</h3>
    <p>Popover content goes here...</p>

    <div class="popover-actions">
      <button type="button" class="button-primary">Action</button>
    </div>
  </div>
</div>

<script>
  const trigger = document.getElementById("popoverTrigger");
  const popover = document.getElementById("customPopover");

  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", !expanded);
    popover.hidden = expanded;
  });
</script>`,
	presentation: "hidden-code",
	variant: "canonical",
};
