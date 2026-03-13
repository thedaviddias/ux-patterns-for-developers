import manifest from "../../../web/.generated/pattern-skills.json";

type PatternSkillRecord = (typeof manifest.patterns)[number];

export type LaunchSkill = Pick<
	PatternSkillRecord,
	"skillSlug" | "title" | "installCommand" | "description" | "category"
>;

const DEFAULT_HIGHLIGHT_SKILLS = ["login", "accordion", "button"] as const;
const DEFAULT_BURST_SKILLS = [
	"login",
	"signup",
	"accordion",
	"button",
	"tabs",
	"modal",
	"tooltip",
	"date-picker",
	"sidebar",
] as const;

const bySlug = new Map(
	manifest.patterns.map((item) => [item.skillSlug, item] as const),
);

const dedupe = <T>(items: readonly T[]) => [...new Set(items)];

const pickSkills = (skillSlugs: readonly string[]) =>
	dedupe(skillSlugs)
		.map((skillSlug) => bySlug.get(skillSlug))
		.filter((item): item is PatternSkillRecord => Boolean(item));

export const launchVideoData = {
	totalSkillCount: manifest.patterns.length + 1,
	globalSkill: manifest.globalSkill,
	defaultHighlightSkills: [...DEFAULT_HIGHLIGHT_SKILLS],
	burstSkills: pickSkills(DEFAULT_BURST_SKILLS),
};

export const getLaunchSkillData = (highlightSkills: readonly string[]) => {
	const resolvedHighlights = pickSkills(
		highlightSkills.length > 0 ? highlightSkills : DEFAULT_HIGHLIGHT_SKILLS,
	);

	const highlightSlugs = new Set(
		resolvedHighlights.map((item) => item.skillSlug),
	);
	const burstSkills = [
		...resolvedHighlights,
		...launchVideoData.burstSkills.filter(
			(item) => !highlightSlugs.has(item.skillSlug),
		),
	].slice(0, 9);

	return {
		...launchVideoData,
		highlightSkills: resolvedHighlights,
		burstSkills,
	};
};
