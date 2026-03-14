import assert from "node:assert/strict";
import test from "node:test";
import {
	TARGET_PATTERN_DOC_CONTRACTS,
} from "./pattern-doc-contract.mjs";
import {
	validatePatternStructureSource,
} from "./validate-pattern-structure-lib.mjs";

const SAMPLE_CONTRACT = TARGET_PATTERN_DOC_CONTRACTS.find(
	(contract) => contract.file === "forms/search-field.mdx",
);

test("validatePatternStructureSource accepts a compliant generated page shape", () => {
	const source = `## Overview

## Use Cases

<PatternComparison alternatives={[]} />

## Benefits

## Drawbacks

## Anatomy

## Variations

## Examples

<Playground patternType="forms" pattern="search-field" example="basic" />

## Best Practices

## Common Mistakes & Anti-Patterns 🚫

## Accessibility

## Validation Rules

## Error Handling

## Testing Guidelines

## Design Tokens

## Frequently Asked Questions

<FaqStructuredData items={[]} />

## Related Patterns

<RelatedPatternsCard patterns={[]} />

## Resources
`;

	assert.deepEqual(validatePatternStructureSource(source, SAMPLE_CONTRACT), []);
});

test("validatePatternStructureSource reports markdown related pattern lists", () => {
	const source = `## Overview

## Use Cases

<PatternComparison alternatives={[]} />

## Benefits

## Drawbacks

## Anatomy

## Variations

## Examples

<Playground patternType="forms" pattern="search-field" example="basic" />

## Best Practices

## Validation Rules

## Error Handling

## Common Mistakes & Anti-Patterns 🚫

## Accessibility

## Testing Guidelines

## Design Tokens

## Frequently Asked Questions

<FaqStructuredData items={[]} />

## Related Patterns

- [Autocomplete](/patterns/forms/autocomplete)

## Resources
`;

	const failures = validatePatternStructureSource(source, SAMPLE_CONTRACT);
	assert.ok(
		failures.some((failure) =>
			failure.includes(
				"Related Patterns must use <RelatedPatternsCard patterns={[...]} />.",
			),
		),
	);
	assert.ok(
		failures.some((failure) =>
			failure.includes(
				"Related Patterns must not use markdown bullet links once componentized.",
			),
		),
	);
});

test("validatePatternStructureSource reports section order mismatches", () => {
	const source = `## Overview

## Use Cases

<PatternComparison alternatives={[]} />

## Benefits

## Drawbacks

## Anatomy

## Variations

## Best Practices

## Examples

<Playground patternType="forms" pattern="search-field" example="basic" />

## Validation Rules

## Error Handling

## Common Mistakes & Anti-Patterns 🚫

## Accessibility

## Testing Guidelines

## Design Tokens

## Frequently Asked Questions

<FaqStructuredData items={[]} />

## Related Patterns

<RelatedPatternsCard patterns={[]} />

## Resources
`;

	const failures = validatePatternStructureSource(source, SAMPLE_CONTRACT);
	assert.ok(
		failures.some((failure) => failure.startsWith("Section order mismatch.")),
	);
});

test("validatePatternStructureSource reports headings glued to self-closing JSX", () => {
	const source = `## Overview

<BuildEffort level="medium" />## Use Cases

<PatternComparison alternatives={[]} />

## Benefits

## Drawbacks

## Anatomy

## Variations

## Examples

<Playground patternType="forms" pattern="search-field" example="basic" />

## Best Practices

## Common Mistakes & Anti-Patterns 🚫

## Accessibility

## Validation Rules

## Error Handling

## Testing Guidelines

## Design Tokens

## Frequently Asked Questions

<FaqStructuredData items={[]} />

## Related Patterns

<RelatedPatternsCard patterns={[]} />

## Resources
`;

	const failures = validatePatternStructureSource(source, SAMPLE_CONTRACT);
	assert.ok(
		failures.includes(
			"Markdown headings must start on a new line after self-closing JSX tags.",
		),
	);
});
