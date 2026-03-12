import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<section class="accordion">
  <h2 class="accordion-title">Frequently Asked Questions</h2>

  <div class="accordion-item">
    <h3 id="accordion1-heading">What is an accordion?</h3>
    <button
      class="accordion-trigger"
      aria-expanded="false"
      aria-controls="panel1"
      aria-labelledby="accordion1-heading"
    >
      <span class="accordion-icon" aria-hidden="true">▼</span>
    </button>
    <section
      id="panel1"
      role="region"
      aria-labelledby="accordion1-heading"
      class="accordion-content"
      hidden
    >
      <p>
        An accordion is a UI pattern that expands and collapses content
        sections.
      </p>
    </section>
  </div>

  <div class="accordion-item">
    <h3 id="accordion2-heading">When should I use an accordion?</h3>
    <button
      class="accordion-trigger"
      aria-expanded="false"
      aria-controls="panel2"
      aria-labelledby="accordion2-heading"
    >
      <span class="accordion-icon" aria-hidden="true">▼</span>
    </button>
    <section
      id="panel2"
      role="region"
      aria-labelledby="accordion2-heading"
      class="accordion-content"
      hidden
    >
      <p>
        Use an accordion when you want to organize content into collapsible
        sections.
      </p>
    </section>
  </div>
</section>

<script>
  document.querySelectorAll(".accordion-trigger").forEach((button) => {
    button.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !expanded);
      this.nextElementSibling.hidden = expanded;

      // Toggle icon direction
      const icon = this.querySelector(".accordion-icon");
      icon.textContent = expanded ? "▼" : "▲";
    });
  });
</script>

<style>
  .accordion {
    border: 1px solid #ccc;
    border-radius: 5px;
    max-width: 600px;
  }

  .accordion-item {
    border-bottom: 1px solid #ddd;
  }

  .accordion-trigger {
    width: 100%;
    background: none;
    border: none;
    text-align: left;
    font-size: 1rem;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .accordion-content {
    padding: 1rem;
    display: none;
  }

  .accordion-trigger[aria-expanded="true"] + .accordion-content {
    display: block;
  }

  .accordion-icon {
    transition: transform 0.2s ease-in-out;
  }

  .accordion-trigger[aria-expanded="true"] .accordion-icon {
    transform: rotate(180deg);
  }
</style>`,
	presentation: "hidden-code",
	variant: "canonical",
};
