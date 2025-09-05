import type { FC, ReactNode } from "react";

export const Separator: FC<{ children: ReactNode }> = ({ children }) => {
	return <div className="flex items-center gap-2">{children}</div>;
};

export default {
	"getting-started": "",
	"when-to-use-what": "",
	books: "",
	_: {
		title: <Separator>Categories</Separator>,
		type: "separator",
	},
	forms: {
		title: "Input & Forms",
		theme: {
			collapsed: true,
		},
	},
	navigation: {
		title: "Layout & Navigation",
		theme: {
			collapsed: true,
		},
	},
	"content-management": {
		title: "Content Management",
		theme: {
			collapsed: true,
		},
	},
	"data-display": {
		title: "Data Display",
		theme: {
			collapsed: true,
		},
	},
	"user-feedback": {
		title: "User Feedback",
		theme: {
			collapsed: true,
		},
	},
	authentication: {
		title: "Authentication",
		theme: {
			collapsed: true,
		},
	},
	"ai-intelligence": {
		title: "AI & Intelligence",
		theme: {
			collapsed: true,
		},
	},
	media: {
		title: "Media",
		theme: {
			collapsed: true,
		},
	},
	"e-commerce": {
		title: "E-commerce",
		theme: {
			collapsed: true,
		},
	},
	social: {
		title: "Social",
		theme: {
			collapsed: true,
		},
	},
	advanced: {
		title: "Advanced",
		theme: {
			collapsed: true,
		},
	},
};
