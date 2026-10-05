import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./deploy-vercel.sh", import.meta.url));

function runDeployment(t, environment, operation, overrides = {}) {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), "vercel-ci-test-"));
	t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
	const log = path.join(directory, "calls.jsonl");
	fs.writeFileSync(
		path.join(directory, "pnpm"),
		`#!/usr/bin/env node
const fs = require("node:fs");
const args = process.argv.slice(2);
fs.appendFileSync(process.env.CALL_LOG, JSON.stringify({args, token: process.env.VERCEL_TOKEN ?? null}) + "\\n");
if (args[2] === "deploy" && process.env.DEPLOY_STATUS) {
  if (process.env.DEPLOY_URL) console.log(process.env.DEPLOY_URL);
  process.exit(Number(process.env.DEPLOY_STATUS));
}
if (args[2] === "inspect") process.exit(Number(process.env.INSPECT_STATUS ?? 0));
`,
		{ mode: 0o755 },
	);
	const result = spawnSync("bash", [script, environment, operation], {
		encoding: "utf8",
		env: {
			...process.env,
			PATH: `${directory}${path.delimiter}${process.env.PATH}`,
			CALL_LOG: log,
			VERCEL_TOKEN: "test-deployment-token",
			VERCEL_ORG_ID: "test-org",
			VERCEL_PROJECT_ID: "test-project",
			...overrides,
		},
	});
	const calls = fs.existsSync(log)
		? fs.readFileSync(log, "utf8").trim().split("\n").map(JSON.parse)
		: [];
	return { ...result, calls };
}

for (const environment of ["production", "preview"]) {
	test(`${environment} builds never inherit or pass the deployment token`, (t) => {
		const result = runDeployment(t, environment, "build");
		assert.equal(result.status, 0, result.stderr);
		assert.equal(result.calls.length, 1);
		assert.equal(result.calls[0].token, null);
		assert.equal(
			result.calls[0].args.some((arg) => arg.startsWith("--token")),
			false,
		);
		assert.ok(result.calls[0].args.includes("--cwd=."));
		assert.equal(
			result.calls[0].args.includes("--prod"),
			environment === "production",
		);
	});
}

test("a build succeeds without a deployment token", (t) => {
	assert.equal(
		runDeployment(t, "production", "build", { VERCEL_TOKEN: "" }).status,
		0,
	);
});

test("pull authenticates and selects the production environment", (t) => {
	const result = runDeployment(t, "production", "pull");
	assert.equal(result.status, 0, result.stderr);
	assert.ok(result.calls[0].args.includes("--environment=production"));
	assert.ok(result.calls[0].args.includes("--token=test-deployment-token"));
});

for (const operation of ["pull", "deploy"]) {
	test(`${operation} rejects missing credentials before invoking the CLI`, (t) => {
		const result = runDeployment(t, "production", operation, {
			VERCEL_TOKEN: "",
		});
		assert.equal(result.status, 1);
		assert.equal(result.calls.length, 0);
	});
}

test("deploy uses prebuilt output and never runs a build", (t) => {
	const result = runDeployment(t, "production", "deploy");
	assert.equal(result.status, 0, result.stderr);
	assert.equal(result.calls.length, 1);
	assert.ok(result.calls[0].args.includes("--prebuilt"));
	assert.ok(result.calls[0].args.includes("--yes"));
});

test("a nonzero deploy is recovered only after successful inspection", (t) => {
	const result = runDeployment(t, "production", "deploy", {
		DEPLOY_STATUS: "7",
		DEPLOY_URL: "https://test-deployment.vercel.app",
	});
	assert.equal(result.status, 0, result.stderr);
	assert.equal(result.calls.length, 2);
	assert.equal(result.calls[1].args[2], "inspect");
	assert.ok(result.calls[1].args.includes("--wait"));
});

test("a nonzero deploy without a URL remains failed", (t) => {
	const result = runDeployment(t, "production", "deploy", {
		DEPLOY_STATUS: "7",
	});
	assert.equal(result.status, 7);
	assert.equal(result.calls.length, 1);
});

test("failed inspection remains failed", (t) => {
	const result = runDeployment(t, "production", "deploy", {
		DEPLOY_STATUS: "7",
		DEPLOY_URL: "https://test-deployment.vercel.app",
		INSPECT_STATUS: "9",
	});
	assert.equal(result.status, 9);
});

test("invalid operations fail without CLI side effects", (t) => {
	const result = runDeployment(t, "production", "invalid");
	assert.equal(result.status, 2);
	assert.equal(result.calls.length, 0);
});

for (const provider of ["github", "gitea"]) {
	test(`${provider} build job has no token-bearing steps`, () => {
		const workflow = fs.readFileSync(
			new URL(`../../.${provider}/workflows/routed-ci.yml`, import.meta.url),
			"utf8",
		);
		const buildJob = workflow
			.split("  validate-and-build:\n")[1]
			.split("\n  deploy:")[0];
		assert.doesNotMatch(buildJob, /VERCEL_TOKEN|deployment-state\.sh/);
		assert.match(buildJob, /deploy-vercel\.sh production build/);
		assert.doesNotMatch(
			workflow,
			/apps\/web\/\.vercel|deployment-state\.sh mark/,
		);
		assert.equal((workflow.match(/retention-days: 1/g) ?? []).length, 2);
		assert.match(workflow, /vercel-artifact\.mjs pack production/);
		assert.equal((workflow.match(/path:.*\.tar\.enc/g) ?? []).length, 2);
		const applicationBuild = buildJob
			.split("      - name: Build production for Vercel")[1]
			.split("      - name: Package")[0];
		assert.doesNotMatch(applicationBuild, /CI_ARTIFACT_KEY/);
	});
}

test("preview deploys do not use the production flag", (t) => {
	const result = runDeployment(t, "preview", "deploy");
	assert.equal(result.status, 0, result.stderr);
	assert.equal(result.calls[0].args.includes("--prod"), false);
});
