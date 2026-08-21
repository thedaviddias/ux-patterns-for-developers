import assert from "node:assert/strict";
import { test } from "node:test";
import { auditWorkflow } from "./validate-deploy-workflows.mjs";

const wf = (checkoutWith, deploy = true) => `
jobs:
  validate-and-deploy:
    steps:
      - name: Checkout
        uses: actions/checkout@abc123 # v6.0.2
        with:
${checkoutWith}
      - name: Enable pnpm
        run: corepack enable
${deploy ? "      - name: Deploy\n        run: bash scripts/ci/deploy-vercel.sh production" : ""}
`;

test("accepts a checkout that requests full history", () => {
	const r = auditWorkflow(
		wf("          fetch-depth: 0\n          filter: blob:none"),
	);
	assert.equal(r.deploys, true);
	assert.deepEqual(
		r.checkouts.map((c) => c.fullHistory),
		[true],
	);
});

test("flags the default shallow checkout", () => {
	const r = auditWorkflow(wf("          persist-credentials: false"));
	assert.deepEqual(
		r.checkouts.map((c) => c.fullHistory),
		[false],
	);
});

test("flags an explicitly shallow depth", () => {
	const r = auditWorkflow(wf("          fetch-depth: 1"));
	assert.deepEqual(
		r.checkouts.map((c) => c.fullHistory),
		[false],
	);
});

test("does not let a later step's fetch-depth leak into the checkout step", () => {
	const leaky = `
jobs:
  build:
    steps:
      - name: Checkout
        uses: actions/checkout@abc123
        with:
          persist-credentials: false
      - name: Something else
        with:
          fetch-depth: 0
      - name: Deploy
        run: bash scripts/ci/deploy-vercel.sh production
`;
	assert.deepEqual(
		auditWorkflow(leaky).checkouts.map((c) => c.fullHistory),
		[false],
	);
});

test("ignores workflows that do not deploy", () => {
	assert.equal(
		auditWorkflow(wf("          fetch-depth: 0", false)).deploys,
		false,
	);
});

test("reports every checkout when a workflow has several", () => {
	const two = `
jobs:
  a:
    steps:
      - name: Checkout
        uses: actions/checkout@abc
        with:
          fetch-depth: 0
  b:
    steps:
      - name: Checkout
        uses: actions/checkout@abc
        with:
          persist-credentials: false
      - name: Deploy
        run: bash scripts/ci/deploy-vercel.sh production
`;
	assert.deepEqual(
		auditWorkflow(two).checkouts.map((c) => c.fullHistory),
		[true, false],
	);
});

test("a commented-out fetch-depth does not count", () => {
	const r = auditWorkflow(
		wf("          # fetch-depth: 0\n          persist-credentials: false"),
	);
	assert.deepEqual(
		r.checkouts.map((c) => c.fullHistory),
		[false],
	);
});
