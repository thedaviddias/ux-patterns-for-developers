import assert from "node:assert/strict";
import test from "node:test";
import {
	renderResources,
	syncResourceSectionSource,
	validatePatternResourcesSource,
} from "./pattern-resources-lib.mjs";

const SAMPLE_FILE = "advanced/command-palette.mdx";

test("renderResources produces the required subsections in order", () => {
	const rendered = renderResources(SAMPLE_FILE);
	const referencesIndex = rendered.indexOf("### References");
	const guidesIndex = rendered.indexOf("### Guides");
	const articlesIndex = rendered.indexOf("### Articles");
	const packagesIndex = rendered.indexOf("### NPM Packages");

	assert.ok(referencesIndex > -1);
	assert.ok(guidesIndex > referencesIndex);
	assert.ok(articlesIndex > guidesIndex);
	assert.ok(packagesIndex > articlesIndex);
});

test("validatePatternResourcesSource accepts a compliant resource section", () => {
	const source = `## Overview

Intro

${renderResources(SAMPLE_FILE)}`;

	assert.deepEqual(validatePatternResourcesSource(source, SAMPLE_FILE), []);
});

test("validatePatternResourcesSource rejects missing required subsections", () => {
	const source = `## Overview

Intro

## Resources

### References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - Accessibility baseline.
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - Interaction guidance.
`;
	const failures = validatePatternResourcesSource(source, SAMPLE_FILE);

	assert.ok(
		failures.some((failure) =>
			failure.includes("Required resource subsection order mismatch"),
		),
	);
});

test("validatePatternResourcesSource rejects non-external resource links", () => {
	const source = `## Overview

Intro

## Resources

### References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - Accessibility baseline.
- [Internal Link](/patterns/forms/button) - Should not be here.

### Guides

- [WAI Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/) - Guidance.

### Articles

- [Smashing Magazine](https://www.smashingmagazine.com/2017/06/designing-efficient-web-forms/) - Article.

### NPM Packages

- [\`cmdk\`](https://www.npmjs.com/package/cmdk) - Command menu primitive.
- [\`kbar\`](https://www.npmjs.com/package/kbar) - Searchable action layer.
`;
	const failures = validatePatternResourcesSource(source, SAMPLE_FILE);

	assert.ok(
		failures.some((failure) =>
			failure.includes("Resources must only contain external https links"),
		),
	);
});

test("syncResourceSectionSource moves resources to the end of the document", () => {
	const source = `## Overview

Intro

## Resources

### References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - Accessibility baseline.
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - Interaction guidance.

### Guides

- [WAI Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/) - Guidance.

### Articles

- [Smashing Magazine](https://www.smashingmagazine.com/2017/06/designing-efficient-web-forms/) - Article.

### NPM Packages

- [\`cmdk\`](https://www.npmjs.com/package/cmdk) - Command menu primitive.
- [\`kbar\`](https://www.npmjs.com/package/kbar) - Searchable action layer.

## Related Patterns

Stuff
`;
	const synced = syncResourceSectionSource(source, SAMPLE_FILE);

	assert.ok(synced.trimEnd().endsWith(renderResources(SAMPLE_FILE).trim()));
});
