import { describe, expect, it } from "vitest";
import { examples } from "@/examples/patterns";
import {
	composePatternExampleDocument,
	composePatternExampleMarkup,
	type PatternExampleDefinition,
	PLAYGROUND_AUTO_RESIZE_SOURCE,
	resolvePatternExample,
} from "@/examples/patterns/example";

const LEGACY_SCAFFOLD_SIGNATURE = [
	'body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; padding: 24px; background: #f8fafc; color: #0f172a; }',
	".demo-shell { max-width: 760px; margin: 0 auto; }",
	".card { background: white; border: 1px solid #dbe4ee; border-radius: 16px; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06); }",
];

function isPatternExampleDefinition(
	value: unknown,
): value is PatternExampleDefinition {
	return (
		typeof value === "object" &&
		value !== null &&
		"html" in value &&
		typeof (value as PatternExampleDefinition).html === "string"
	);
}

function collectExampleEntries(
	value: unknown,
	path: string[] = [],
): Array<{ id: string; example: PatternExampleDefinition }> {
	if (isPatternExampleDefinition(value)) {
		return [{ id: path.join("/"), example: value }];
	}

	if (typeof value !== "object" || value === null) {
		return [];
	}

	return Object.entries(value).flatMap(([key, nestedValue]) =>
		collectExampleEntries(nestedValue, [...path, key]),
	);
}

const allExampleEntries = collectExampleEntries(examples);
const interactiveExampleIds = [
	"authentication/account-settings/basic",
	"authentication/login/basic",
	"authentication/password-reset/basic",
	"authentication/signup/basic",
	"authentication/social-login/basic",
	"authentication/two-factor/basic",
	"authentication/user-profile/basic",
	"content-management/expandable-text/basic",
	"content-management/modal/native",
	"content-management/popover/basic",
	"forms/autocomplete/basic",
	"forms/button/basic",
	"forms/code-confirmation/basic",
	"forms/color-picker/basic",
	"forms/currency-input/basic",
	"forms/date-input/basic",
	"forms/date-picker/basic",
	"forms/date-range/basic",
	"forms/file-input/basic",
	"forms/multi-select-input/basic",
	"forms/selection-input/basic",
	"navigation/hambuger-menu/basic",
	"navigation/megamenu/basic",
	"navigation/navigation-menu/basic",
	"navigation/sidebar/basic",
	"navigation/tabs/basic",
];

describe("composePatternExampleDocument", () => {
	it("wraps html-only documents in the shared preview foundation", () => {
		const example: PatternExampleDefinition = {
			html: '<button type="button">Open</button>',
		};

		const document = composePatternExampleDocument(example);

		expect(document).toContain("ux-patterns preview foundation");
		expect(document).toContain("data-preview-root");
		expect(document).toContain('<button type="button">Open</button>');
	});

	it("includes css when provided", () => {
		const example: PatternExampleDefinition = {
			html: '<button type="button">Open</button>',
			css: "button { color: red; }",
		};

		expect(composePatternExampleDocument(example)).toContain(
			"button { color: red; }",
		);
	});

	it("includes js when provided", () => {
		const example: PatternExampleDefinition = {
			html: '<button type="button">Open</button>',
			css: "button { color: red; }",
			js: 'document.querySelector("button")?.focus();',
		};

		expect(composePatternExampleDocument(example)).toContain(
			'<script>document.querySelector("button")?.focus();</script>',
		);
	});

	it("applies the shared foundation to sandbox markup as well", () => {
		const markup = composePatternExampleMarkup({
			html: "<main>Hello</main>",
		});

		expect(markup).toContain("ux-patterns preview foundation");
		expect(markup).toContain("data-preview-root");
		expect(markup).toContain("<main>Hello</main>");
	});

	it("includes shared styles and example css without auto resize", () => {
		const document = composePatternExampleDocument({
			html: "<main>Hello</main>",
			css: "body { color: red; }",
			js: 'console.log("ready");',
		});

		expect(document).toContain("ux-patterns preview foundation");
		expect(document).toContain("body { color: red; }");
		expect(document).toContain('<script>console.log("ready");</script>');
	});

	it("injects the resize bridge only when auto resize is enabled", () => {
		const withoutAutoResize = composePatternExampleDocument({
			html: "<main>Hello</main>",
		});
		const withAutoResize = composePatternExampleDocument(
			{
				html: "<main>Hello</main>",
			},
			{ autoResizeFrameId: "frame-123" },
		);

		expect(withoutAutoResize).not.toContain(PLAYGROUND_AUTO_RESIZE_SOURCE);
		expect(withAutoResize).toContain(PLAYGROUND_AUTO_RESIZE_SOURCE);
		expect(withAutoResize).toContain('const frameId = "frame-123";');
	});

	it("defaults basic examples to canonical inline presentation", () => {
		expect(
			resolvePatternExample(
				{
					html: '<button type="button">Open</button>',
				},
				"basic",
			),
		).toMatchObject({
			presentation: "inline",
			variant: "canonical",
		});
	});

	it("defaults non-basic examples to collapsed advanced presentation", () => {
		expect(
			resolvePatternExample(
				{
					html: '<button type="button">Open</button>',
				},
				"advanced",
			),
		).toMatchObject({
			presentation: "collapsed",
			variant: "advanced",
		});
	});

	it("ensures every registered example renders with a style tag", () => {
		for (const { example } of allExampleEntries) {
			const document = composePatternExampleDocument(example);
			expect(document).toContain("<style>");
			expect(document).toContain("data-preview-root");
		}
	});

	it("does not allow legacy generated scaffold css to ship in examples", () => {
		for (const { id, example } of allExampleEntries) {
			const css = example.css ?? "";
			for (const fragment of LEGACY_SCAFFOLD_SIGNATURE) {
				expect(
					css,
					`${id} should not include legacy scaffold fragment`,
				).not.toContain(fragment);
			}
		}
	});

	it("ensures explicitly interactive examples provide runtime behavior", () => {
		const runtimePattern = /<script>|<dialog\b|<details\b| popover\b/i;

		for (const id of interactiveExampleIds) {
			const entry = allExampleEntries.find((candidate) => candidate.id === id);
			if (!entry) {
				throw new Error(`missing example ${id}`);
			}

			expect(
				runtimePattern.test(composePatternExampleDocument(entry.example)),
			).toBe(true);
		}
	});
});
