import assert from "node:assert/strict";
import test from "node:test";
import manifest from "../../../web/.generated/pattern-skills.json";
import { getLaunchSkillData, launchVideoData } from "./skills-data";

test("launch video data uses the generated manifest as source of truth", () => {
	assert.equal(launchVideoData.totalSkillCount, manifest.patterns.length + 1);
	assert.equal(
		launchVideoData.globalSkill.installCommand,
		manifest.globalSkill.installCommand,
	);
});

test("highlight skills preserve order and drop unknown values", () => {
	const data = getLaunchSkillData(["button", "missing-skill", "login"]);

	assert.deepEqual(
		data.highlightSkills.map((item) => item.skillSlug),
		["button", "login"],
	);
});
