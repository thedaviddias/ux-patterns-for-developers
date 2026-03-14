import { describe, expect, it } from "vitest";
import {
	applyPatternPageSourceTransforms,
	injectQuickDecisionAfterSpecimen,
} from "./pattern-page-source";

describe("injectQuickDecisionAfterSpecimen", () => {
	it("inserts quick decision after the Overview section when preview exists", () => {
		const source = `---
title: "Autocomplete"
---

<PatternPreview
  alt="Example"
/>

## Overview

Body

## Use Cases

More body`;

		const result = injectQuickDecisionAfterSpecimen(source, {
			bestFor: ["A"],
			complexity: "medium",
		});

		expect(result).toContain("<PatternPreview");
		expect(result.indexOf("<QuickDecisionBand")).toBeGreaterThan(
			result.indexOf("Body"),
		);
		expect(result.indexOf("<QuickDecisionBand")).toBeGreaterThan(
			result.indexOf("## Overview"),
		);
		expect(result.indexOf("<QuickDecisionBand")).toBeLessThan(
			result.indexOf("## Use Cases"),
		);
	});

	it("inserts quick decision after the Overview section when no preview exists", () => {
		const source = `---
title: "Autocomplete"
---

## Overview

Body

## Use Cases

More body`;

		const result = injectQuickDecisionAfterSpecimen(source, {
			bestFor: ["A"],
			complexity: "medium",
		});

		expect(result.indexOf("<QuickDecisionBand")).toBeGreaterThan(
			result.indexOf("## Overview"),
		);
		expect(result.indexOf("<QuickDecisionBand")).toBeLessThan(
			result.indexOf("## Use Cases"),
		);
	});

	it("falls back to placing quick decision after the preview when Overview is missing", () => {
		const source = `---
title: "Autocomplete"
---

<PatternPreview />

## Use Cases

Body`;

		const result = injectQuickDecisionAfterSpecimen(source, {
			bestFor: ["A"],
			complexity: "medium",
		});

		expect(result.indexOf("<QuickDecisionBand")).toBeGreaterThan(
			result.indexOf("<PatternPreview"),
		);
		expect(result.indexOf("<QuickDecisionBand")).toBeLessThan(
			result.indexOf("## Use Cases"),
		);
	});
});

describe("applyPatternPageSourceTransforms", () => {
	it("places quick decision after Overview and before the overview disclosure", () => {
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

		expect(result.indexOf("<QuickDecisionBand")).toBeGreaterThan(
			result.indexOf("## Overview"),
		);
		expect(result.indexOf("<QuickDecisionBand")).toBeLessThan(
			result.indexOf("<UseWithAIDisclosure"),
		);
	});
});
