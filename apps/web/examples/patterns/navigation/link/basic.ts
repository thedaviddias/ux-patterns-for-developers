import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<!-- Inline text link -->
<p>Read the <a href="/docs/getting-started">getting started guide</a> to begin.</p>

<!-- External link with indicator -->
<a href="https://w3.org/WAI/" target="_blank" rel="noopener noreferrer">
  WAI Guidelines
  <span aria-hidden="true">↗</span>
  <span class="sr-only">(opens in new tab)</span>
</a>

<!-- Anchor / jump link -->
<a href="#pricing">Jump to pricing</a>

<!-- Download link -->
<a href="/files/report.pdf" download>
  Download annual report (PDF, 2.4 MB)
</a>

<!-- Skip navigation link -->
<a href="#main-content" class="skip-link">Skip to main content</a>`,
	presentation: "hidden-code",
	variant: "canonical",
};
