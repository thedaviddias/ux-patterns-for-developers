export const PATTERN_SKILLS_GLOBAL_SLUG = "ux-patterns-global";
export const PATTERN_SKILLS_INSTALL_SOURCE =
	"https://github.com/thedaviddias/ux-patterns-for-developers/tree/main/skills";
export const PATTERN_SKILLS_SITE_URL = "https://uxpatterns.dev";

export function getSkillInstallCommand(skillSlug) {
	return `npx skills add ${PATTERN_SKILLS_INSTALL_SOURCE} --skill ${skillSlug}`;
}

export function getSkillReferenceUrl(skillSlug) {
	return `/skills/${skillSlug}`;
}
