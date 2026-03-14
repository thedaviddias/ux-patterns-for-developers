export type PatternTheme = {
	label: string;
	accent: string;
	glow: string;
	badgeClass: string;
	panelClass: string;
};

export const PATTERN_THEMES: Record<string, PatternTheme> = {
	forms: {
		label: "Input & Forms",
		accent: "hsl(var(--atlas-blue))",
		glow: "rgba(37, 99, 235, 0.18)",
		badgeClass:
			"border-blue-200/70 bg-blue-100/80 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200",
		panelClass:
			"from-blue-100/90 via-white to-slate-50 dark:from-blue-950/30 dark:via-slate-950 dark:to-slate-950",
	},
	navigation: {
		label: "Layout & Navigation",
		accent: "hsl(var(--atlas-pink))",
		glow: "rgba(225, 29, 72, 0.18)",
		badgeClass:
			"border-rose-200/70 bg-rose-100/80 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
		panelClass:
			"from-rose-100/80 via-white to-orange-50 dark:from-rose-950/30 dark:via-slate-950 dark:to-slate-950",
	},
	"content-management": {
		label: "Content Management",
		accent: "hsl(var(--atlas-amber))",
		glow: "rgba(245, 158, 11, 0.18)",
		badgeClass:
			"border-amber-200/80 bg-amber-100/80 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
		panelClass:
			"from-amber-100/80 via-white to-orange-50 dark:from-amber-950/30 dark:via-slate-950 dark:to-slate-950",
	},
	"data-display": {
		label: "Data Display",
		accent: "hsl(var(--atlas-teal))",
		glow: "rgba(13, 148, 136, 0.18)",
		badgeClass:
			"border-teal-200/70 bg-teal-100/80 text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200",
		panelClass:
			"from-teal-100/80 via-white to-cyan-50 dark:from-teal-950/30 dark:via-slate-950 dark:to-slate-950",
	},
	"user-feedback": {
		label: "User Feedback",
		accent: "hsl(var(--atlas-orange))",
		glow: "rgba(249, 115, 22, 0.2)",
		badgeClass:
			"border-orange-200/80 bg-orange-100/80 text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-200",
		panelClass:
			"from-orange-100/80 via-white to-amber-50 dark:from-orange-950/30 dark:via-slate-950 dark:to-slate-950",
	},
	authentication: {
		label: "Authentication",
		accent: "hsl(var(--atlas-violet))",
		glow: "rgba(124, 58, 237, 0.18)",
		badgeClass:
			"border-violet-200/70 bg-violet-100/80 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200",
		panelClass:
			"from-violet-100/80 via-white to-fuchsia-50 dark:from-violet-950/30 dark:via-slate-950 dark:to-slate-950",
	},
	"ai-intelligence": {
		label: "AI & Intelligence",
		accent: "hsl(var(--atlas-pink))",
		glow: "rgba(217, 70, 239, 0.18)",
		badgeClass:
			"border-fuchsia-200/70 bg-fuchsia-100/80 text-fuchsia-800 dark:border-fuchsia-900 dark:bg-fuchsia-950/40 dark:text-fuchsia-200",
		panelClass:
			"from-fuchsia-100/80 via-white to-violet-50 dark:from-fuchsia-950/30 dark:via-slate-950 dark:to-slate-950",
	},
	media: {
		label: "Media",
		accent: "hsl(var(--atlas-orange))",
		glow: "rgba(234, 88, 12, 0.18)",
		badgeClass:
			"border-orange-200/70 bg-orange-100/80 text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-200",
		panelClass:
			"from-orange-100/80 via-white to-red-50 dark:from-orange-950/30 dark:via-slate-950 dark:to-slate-950",
	},
	"e-commerce": {
		label: "E-commerce",
		accent: "hsl(var(--atlas-amber))",
		glow: "rgba(234, 179, 8, 0.18)",
		badgeClass:
			"border-yellow-200/70 bg-yellow-100/80 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-200",
		panelClass:
			"from-yellow-100/80 via-white to-orange-50 dark:from-yellow-950/30 dark:via-slate-950 dark:to-slate-950",
	},
	social: {
		label: "Social",
		accent: "hsl(var(--atlas-blue))",
		glow: "rgba(59, 130, 246, 0.18)",
		badgeClass:
			"border-sky-200/70 bg-sky-100/80 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
		panelClass:
			"from-sky-100/80 via-white to-indigo-50 dark:from-sky-950/30 dark:via-slate-950 dark:to-slate-950",
	},
	advanced: {
		label: "Advanced",
		accent: "hsl(var(--atlas-teal))",
		glow: "rgba(20, 184, 166, 0.18)",
		badgeClass:
			"border-emerald-200/70 bg-emerald-100/80 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
		panelClass:
			"from-emerald-100/80 via-white to-teal-50 dark:from-emerald-950/30 dark:via-slate-950 dark:to-slate-950",
	},
};

export const DEFAULT_PATTERN_THEME: PatternTheme = {
	label: "Patterns",
	accent: "hsl(var(--atlas-orange))",
	glow: "rgba(249, 115, 22, 0.18)",
	badgeClass:
		"border-orange-200/80 bg-orange-100/80 text-orange-800 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-200",
	panelClass:
		"from-orange-100/80 via-white to-amber-50 dark:from-orange-950/30 dark:via-slate-950 dark:to-slate-950",
};

export function getPatternTheme(category: string): PatternTheme {
	return PATTERN_THEMES[category] ?? DEFAULT_PATTERN_THEME;
}
