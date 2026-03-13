import type { LaunchSkill } from "./skills-data";

export const FPS = 30;

export type VideoFormat = "portrait" | "landscape";

export type NpxSkillsLaunchProps = {
	format: VideoFormat;
	highlightSkills: string[];
	ctaUrl: string;
};

export type SceneSegment = {
	id: string;
	caption: string;
	durationInFrames: number;
};

export const SCENE_SEGMENTS: SceneSegment[] = [
	{
		id: "hook",
		caption: "UX Patterns is now installable as skills.",
		durationInFrames: 90,
	},
	{
		id: "terminal",
		caption: "One command installs the global guide.",
		durationInFrames: 108,
	},
	{
		id: "burst",
		caption: "Real pattern skills. Real slugs. Real install commands.",
		durationInFrames: 120,
	},
	{
		id: "examples",
		caption: "Pick the exact pattern you need and drop it into the workflow.",
		durationInFrames: 108,
	},
	{
		id: "close",
		caption: "Open uxpatterns.dev slash skills.",
		durationInFrames: 96,
	},
];

export const TRANSITION_DURATION_IN_FRAMES = 12;

export const TOTAL_DURATION_IN_FRAMES =
	SCENE_SEGMENTS.reduce((sum, scene) => sum + scene.durationInFrames, 0) -
	(SCENE_SEGMENTS.length - 1) * TRANSITION_DURATION_IN_FRAMES;

export const DEFAULT_PROPS: NpxSkillsLaunchProps = {
	format: "landscape",
	highlightSkills: ["login", "accordion", "button"],
	ctaUrl: "https://uxpatterns.dev/skills",
};

export const getVideoDimensions = (format: VideoFormat) => {
	if (format === "portrait") {
		return { width: 1080, height: 1920 };
	}

	return { width: 1920, height: 1080 };
};

export const buildExampleCommands = (skills: LaunchSkill[]) =>
	skills.slice(0, 3).map((item) => item.installCommand);
