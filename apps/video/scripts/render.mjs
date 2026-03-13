import {execFileSync} from "node:child_process";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const format = process.argv[2];

if (format !== "landscape" && format !== "portrait") {
	throw new Error("Pass either `landscape` or `portrait` to render.mjs.");
}

const props = JSON.stringify({
	format,
	highlightSkills: ["login", "accordion", "button"],
	ctaUrl: "https://uxpatterns.dev/skills",
});

const outFile = `out/npx-skills-${format}.mp4`;
const args = [
	"exec",
	"remotion",
	"render",
	"src/index.ts",
	"NpxSkillsLaunch",
	outFile,
	"--chrome-mode=chrome-for-testing",
	"--concurrency=1",
	`--props=${props}`,
];

execFileSync("pnpm", args, {
	cwd: rootDir,
	stdio: "inherit",
});
