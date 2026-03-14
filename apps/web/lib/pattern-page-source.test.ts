import { describe, expect, it } from "vitest";
import {
	applyPatternPageSourceTransforms,
	injectQuickDecisionAfterSpecimen,
} from "./pattern-page-source";

describe("injectQuickDecisionAfterSpecimen", () => {
	it("inserts quick decision immediately after the first PatternPreview", () => {
		const source = `---
title: "Autocomplete"
---

<PatternPreview
  alt="Example"
/>

## Overview

Body`;

		const result = injectQuickDecisionAfterSpecimen(source, {
			bestFor: ["A"],
			complexity: "medium",
		});

		expect(result).toContain("<PatternPreview");
		expect(result.indexOf("<QuickDecisionBand")).toBeGreaterThan(
			result.indexOf("<PatternPreview"),
		);
		expect(result.indexOf("<QuickDecisionBand")).toBeLessThan(
			result.indexOf("## Overview"),
		);
	});

	it("falls back to placing quick decision before Overview when no specimen exists", () => {
		const source = `---
title: "Autocomplete"
---

## Overview

Body`;

		const result = injectQuickDecisionAfterSpecimen(source, {
			bestFor: ["A"],
			complexity: "medium",
		});

		expect(result.indexOf("<QuickDecisionBand")).toBeLessThan(
			result.indexOf("## Overview"),
		);
	});
});

describe("applyPatternPageSourceTransforms", () => {
	it("keeps quick decision above the overview disclosure content", () => {
		const source = `---
title: "Autocomplete"
---

<PatternPreview />

## Overview

Body`;

		const result = applyPatternPageSourceTransforms(source, {
			quickDecision: {
				bestFor: ["A"],
				complexity: "medium",
			},
			useWithAI: {
				patternTitle: "Autocomplete",
				patternSkillSlug: "autocomplete",
				patternSkillInstallCommand: "cmd",
				globalSkillSlug: "ux-patterns",
				globalSkillInstallCommand: "global",
				markdownUrl: "/patterns/forms/autocomplete.mdx",
			},
		});

		expect(result.indexOf("<QuickDecisionBand")).toBeLessThan(
			result.indexOf("<UseWithAIDisclosure"),
		);
		expect(result.indexOf("<QuickDecisionBand")).toBeLessThan(
			result.indexOf("## Overview"),
		);
	});
});
