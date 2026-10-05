import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const helper = fileURLToPath(new URL("./vercel-artifact.mjs", import.meta.url));

function fixture(t) {
	const directory = fs.mkdtempSync(
		path.join(os.tmpdir(), "vercel-encryption-test-"),
	);
	t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
	const source = path.join(directory, "source");
	const destination = path.join(directory, "destination");
	const temporary = path.join(directory, "artifacts");
	fs.mkdirSync(path.join(source, ".vercel/output"), { recursive: true });
	fs.mkdirSync(destination);
	fs.mkdirSync(temporary);
	fs.writeFileSync(path.join(source, ".vercel/project.json"), "{}");
	fs.writeFileSync(
		path.join(source, ".vercel/.env.production.local"),
		"APP_SECRET=private-test-value",
	);
	fs.writeFileSync(path.join(source, ".vercel/output/handler"), "test", {
		mode: 0o755,
	});
	fs.symlinkSync("handler", path.join(source, ".vercel/output/link"));
	const key = randomBytes(32).toString("hex");
	const run = (operation, kind, secret = key) =>
		spawnSync(process.execPath, [helper, operation, kind], {
			cwd: operation === "pack" ? source : destination,
			env: { ...process.env, RUNNER_TEMP: temporary, CI_ARTIFACT_KEY: secret },
			encoding: "utf8",
		});
	return { source, destination, temporary, key, run };
}

test("encrypted workflow transfers preserve dotfiles, symlinks and permissions", (t) => {
	const f = fixture(t);
	const workflow = fs.readFileSync(
		new URL("../../.github/workflows/routed-ci.yml", import.meta.url),
		"utf8",
	);
	const transfers = [
		...workflow.matchAll(
			/run: node scripts\/ci\/vercel-artifact\.mjs (pack|unpack) (configuration|production)/g,
		),
	];
	assert.equal(transfers.length, 4);
	for (const [, operation, kind] of transfers) {
		const result = f.run(operation, kind);
		assert.equal(result.status, 0, result.stderr);
	}
	assert.equal(
		fs.readFileSync(
			path.join(f.destination, ".vercel/.env.production.local"),
			"utf8",
		),
		"APP_SECRET=private-test-value",
	);
	assert.equal(
		fs.readlinkSync(path.join(f.destination, ".vercel/output/link")),
		"handler",
	);
	assert.equal(
		fs.statSync(path.join(f.destination, ".vercel/output/handler")).mode &
			0o777,
		0o755,
	);
	const encrypted = fs.readFileSync(
		path.join(f.temporary, "vercel-configuration.tar.enc"),
	);
	assert.equal(
		encrypted.includes(Buffer.from("APP_SECRET=private-test-value")),
		false,
	);
	assert.equal(encrypted.includes(Buffer.from(f.key)), false);
	assert.deepEqual(fs.readdirSync(f.temporary).sort(), [
		"vercel-configuration.tar.enc",
		"vercel-production.tar.enc",
	]);
});

test("a wrong key rejects the archive before extraction", (t) => {
	const f = fixture(t);
	assert.equal(f.run("pack", "configuration").status, 0);
	assert.equal(
		f.run("unpack", "configuration", randomBytes(32).toString("hex")).status,
		1,
	);
	assert.deepEqual(fs.readdirSync(f.destination), []);
	assert.deepEqual(fs.readdirSync(f.temporary), [
		"vercel-configuration.tar.enc",
	]);
});

test("ciphertext tampering is rejected before extraction", (t) => {
	const f = fixture(t);
	assert.equal(f.run("pack", "configuration").status, 0);
	const archive = path.join(f.temporary, "vercel-configuration.tar.enc");
	const bytes = fs.readFileSync(archive);
	bytes[30] ^= 1;
	fs.writeFileSync(archive, bytes);
	assert.equal(f.run("unpack", "configuration").status, 1);
	assert.deepEqual(fs.readdirSync(f.destination), []);
});

test("missing encryption credentials fail without creating artifacts", (t) => {
	const f = fixture(t);
	const result = f.run("pack", "configuration", "");
	assert.equal(result.status, 1);
	assert.deepEqual(fs.readdirSync(f.temporary), []);
});

test("truncated artifacts fail before extraction", (t) => {
	const f = fixture(t);
	fs.writeFileSync(
		path.join(f.temporary, "vercel-configuration.tar.enc"),
		"short",
	);
	assert.equal(f.run("unpack", "configuration").status, 1);
	assert.deepEqual(fs.readdirSync(f.destination), []);
});
