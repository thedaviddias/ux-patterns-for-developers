import manifest from "../.generated/pattern-skills.json";

export interface PatternSkillRecord {
	skillSlug: string;
	patternSlug: string;
	category: string;
	title: string;
	summary?: string;
	description?: string;
	aliases: string[];
	url: string;
	sourcePath: string;
	referencePath: string;
	installCommand: string;
	relatedPatternUrls: string[];
}

export interface GlobalPatternSkillRecord {
	skillSlug: string;
	title: string;
	description: string;
	url: string;
	referencePath: string;
	installCommand: string;
}

export interface PatternSkillsManifest {
	generatedAt: string;
	installSource: string;
	globalSkill: GlobalPatternSkillRecord;
	patterns: PatternSkillRecord[];
}

const typedManifest = manifest as PatternSkillsManifest;

export const patternSkillsManifest = typedManifest;
export const globalPatternSkill = typedManifest.globalSkill;

export function getPatternSkill(patternSlug: string) {
	return typedManifest.patterns.find(
		(item) => item.patternSlug === patternSlug,
	);
}

export function getPatternSkillBySlug(skillSlug: string) {
	if (skillSlug === typedManifest.globalSkill.skillSlug) {
		return typedManifest.globalSkill;
	}

	return typedManifest.patterns.find((item) => item.skillSlug === skillSlug);
}
