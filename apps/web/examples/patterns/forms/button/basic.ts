import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<button type="button" aria-label="Settings">
     <svg aria-hidden="true">...</svg>
   </button>`,
	presentation: "hidden-code",
	variant: "canonical",
};
