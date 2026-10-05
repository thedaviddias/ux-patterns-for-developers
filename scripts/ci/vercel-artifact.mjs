#!/usr/bin/env node

import { execFile } from "node:child_process";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import fs from "node:fs";
import { appendFile, mkdtemp, open, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { promisify } from "node:util";

const run = promisify(execFile);
const magic = Buffer.from("UXART001");
const headerLength = magic.length + 12;
const tagLength = 16;
const members = {
	configuration: [".vercel/project.json", ".vercel/.env.production.local"],
	production: [".vercel/output", ".vercel/project.json"],
};

async function encrypt(source, destination, key) {
	const iv = randomBytes(12);
	const header = Buffer.concat([magic, iv]);
	const cipher = createCipheriv("aes-256-gcm", key, iv);
	cipher.setAAD(header);
	const file = await open(destination, "wx", 0o600);
	await file.write(header);
	await file.close();
	try {
		await pipeline(
			fs.createReadStream(source),
			cipher,
			fs.createWriteStream(destination, { flags: "a" }),
		);
		await appendFile(destination, cipher.getAuthTag());
	} catch (error) {
		await rm(destination, { force: true });
		throw error;
	}
}

async function decrypt(source, destination, key) {
	const file = await open(source, "r");
	let size;
	const header = Buffer.alloc(headerLength);
	const tag = Buffer.alloc(tagLength);
	try {
		size = (await file.stat()).size;
		if (size <= headerLength + tagLength)
			throw new Error("Invalid encrypted artifact.");
		await file.read(header, 0, headerLength, 0);
		await file.read(tag, 0, tagLength, size - tagLength);
	} finally {
		await file.close();
	}
	if (!header.subarray(0, magic.length).equals(magic)) {
		throw new Error("Invalid encrypted artifact header.");
	}
	const decipher = createDecipheriv(
		"aes-256-gcm",
		key,
		header.subarray(magic.length),
	);
	decipher.setAAD(header);
	decipher.setAuthTag(tag);
	try {
		await pipeline(
			fs.createReadStream(source, {
				start: headerLength,
				end: size - tagLength - 1,
			}),
			decipher,
			fs.createWriteStream(destination, { flags: "wx", mode: 0o600 }),
		);
	} catch (error) {
		await rm(destination, { force: true });
		throw error;
	}
}

async function main() {
	const [operation, kind] = process.argv.slice(2);
	if (
		!["pack", "unpack"].includes(operation) ||
		!Object.hasOwn(members, kind)
	) {
		throw new Error(
			"Usage: node scripts/ci/vercel-artifact.mjs [pack|unpack] [configuration|production]",
		);
	}
	const secret = process.env.CI_ARTIFACT_KEY;
	if (!secret || !/^[a-fA-F0-9]{64}$/.test(secret)) {
		throw new Error(
			"CI_ARTIFACT_KEY must contain 64 hexadecimal characters (32 random bytes).",
		);
	}
	const key = Buffer.from(secret, "hex");
	const temporary = await mkdtemp(
		path.join(process.env.RUNNER_TEMP || os.tmpdir(), "vercel-artifact-"),
	);
	const archive = path.join(temporary, "payload.tar");
	const encrypted = path.join(
		process.env.RUNNER_TEMP || os.tmpdir(),
		`vercel-${kind}.tar.enc`,
	);
	const environment = { ...process.env };
	delete environment.CI_ARTIFACT_KEY;
	delete environment.VERCEL_TOKEN;
	try {
		if (operation === "pack") {
			await run("tar", ["-cf", archive, ...members[kind]], {
				env: environment,
			});
			await encrypt(archive, encrypted, key);
		} else {
			// Authenticate the entire archive before allowing tar to extract anything.
			await decrypt(encrypted, archive, key);
			await run("tar", ["-xf", archive], { env: environment });
		}
	} finally {
		key.fill(0);
		await rm(temporary, { recursive: true, force: true });
	}
}

main().catch(() => {
	process.stderr.write(
		"Vercel artifact transfer failed. Check CI_ARTIFACT_KEY, archive integrity, and required files.\n",
	);
	process.exitCode = 1;
});
