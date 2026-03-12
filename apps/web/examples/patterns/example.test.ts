import { describe, expect, it } from "vitest";
import {
	composePatternExampleDocument,
	type PatternExampleDefinition,
	resolvePatternExample,
} from "@/examples/patterns/example";

describe("composePatternExampleDocument", () => {
	it("renders an html-only document", () => {
		const example: PatternExampleDefinition = {
			html: '<button type="button">Open</button>',
		};

		expect(composePatternExampleDocument(example)).toBe(
			'<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body><button type="button">Open</button></body></html>',
		);
	});

	it("includes css when provided", () => {
		const example: PatternExampleDefinition = {
			html: '<button type="button">Open</button>',
			css: "button { color: red; }",
		};

		expect(composePatternExampleDocument(example)).toContain(
			"<style>button { color: red; }</style>",
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
});
