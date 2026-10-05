import assert from "node:assert/strict";
import { test } from "node:test";
import { validate } from "./assertions.mjs";
import { measureFlow } from "./measure.mjs";

test("budget and quality gates reject oversized or degraded real responses", async () => {
	const row = await measureFlow("targeted");
	assert.equal(validate(row), true);
	assert.equal(validate({ ...row, responseTokens: 100000 }), false);
	const degraded = structuredClone(row);
	degraded.results[0].structuredContent.body = "";
	assert.equal(validate(degraded), false);
	const snippet = await measureFlow("accessibility");
	assert.equal(validate(snippet), true);
	snippet.results[0].structuredContent.passed = ["1.4.3 (Level AA)"];
	assert.equal(validate(snippet), false);
});
