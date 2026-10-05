/**
 * pattern_advisor tool
 * Interactive recommendation system for pattern selection
 */

import { getPatterns } from "../data";
import type {
	PatternAdvisorInteractiveResponse,
	PatternAdvisorParams,
	PatternAdvisorRecommendationResponse,
} from "../types";

export const patternAdvisorDefinition = {
	name: "pattern_advisor",
	description:
		"Interactive advisor to help choose the right UX pattern for your needs",
	inputSchema: {
		type: "object" as const,
		properties: {
			mode: {
				type: "string",
				enum: ["interactive", "direct"],
				description:
					'Mode: "interactive" for guided questions, "direct" for immediate recommendations',
				default: "direct",
			},
			requirements: {
				type: "string",
				description: "Description of what you need (for direct mode)",
			},
			sessionId: {
				type: "string",
				description:
					"Opaque continuation token returned by the previous interactive response. Pass it unchanged; it contains choices, not credentials.",
				maxLength: 2048,
			},
			answers: {
				type: "object",
				description: "Answers to previous questions (for interactive mode)",
			},
		},
		required: [],
	},
};

// Question flow for interactive mode
const questions = [
	{
		id: "interaction_type",
		question: "What type of user interaction are you building?",
		options: [
			"Form input",
			"Navigation",
			"Content display",
			"Feedback/notification",
			"Overlay/modal",
		],
		type: "single" as const,
	},
	{
		id: "user_action",
		question: "What is the primary user action?",
		options: [
			"Enter data",
			"Select from options",
			"Browse content",
			"Confirm action",
			"View details",
		],
		type: "single" as const,
	},
	{
		id: "data_type",
		question: "What type of data are you working with?",
		options: [
			"Text/numbers",
			"Dates/times",
			"Multiple choice",
			"Boolean (yes/no)",
			"Complex/structured",
		],
		type: "single" as const,
	},
	{
		id: "accessibility_priority",
		question: "How important is accessibility?",
		options: ["Critical (must comply)", "Important", "Nice to have"],
		type: "single" as const,
	},
];

// Continuation choices travel with the client; no worker-local session state.
const TOKEN_PREFIX = "advisor_v2_";

function validateAnswers(value: unknown): Record<string, string> {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		throw new Error(
			"Answers must be an object of question IDs and listed options.",
		);
	}
	const result: Record<string, string> = {};
	for (const [key, answer] of Object.entries(value)) {
		const question = questions.find((item) => item.id === key);
		if (
			!question ||
			typeof answer !== "string" ||
			!question.options.includes(answer)
		) {
			throw new Error("Use a listed option for each known advisor question.");
		}
		result[key] = answer;
	}
	return result;
}

function readContinuation(token?: string): Record<string, string> {
	if (!token) return {};
	try {
		if (token.length > 2048 || !token.startsWith(TOKEN_PREFIX))
			throw new Error();
		const state = JSON.parse(
			Buffer.from(token.slice(TOKEN_PREFIX.length), "base64url").toString(
				"utf8",
			),
		);
		if (state?.version !== 2) throw new Error();
		return validateAnswers(state.answers);
	} catch {
		throw new Error(
			"Invalid advisor continuation token. Restart interactive mode without sessionId and resend your choices.",
		);
	}
}

function continuation(answers: Record<string, string>): string {
	const ordered = Object.fromEntries(
		questions.filter((q) => q.id in answers).map((q) => [q.id, answers[q.id]]),
	);
	return (
		TOKEN_PREFIX +
		Buffer.from(JSON.stringify({ version: 2, answers: ordered })).toString(
			"base64url",
		)
	);
}

function getRecommendations(
	answers: Record<string, string>,
	requirements?: string,
): PatternAdvisorRecommendationResponse {
	const patterns = getPatterns();
	const recommendations: Array<{
		pattern: string;
		title: string;
		confidence: number;
		rationale: string;
		category: string;
	}> = [];

	// Score patterns based on answers
	for (const pattern of patterns) {
		let confidence = 0;
		const rationale: string[] = [];

		// Match interaction type
		if (
			answers.interaction_type === "Form input" &&
			pattern.category === "forms"
		) {
			confidence += 30;
			rationale.push("Matches form input needs");
		}
		if (
			answers.interaction_type === "Navigation" &&
			pattern.category === "navigation"
		) {
			confidence += 30;
			rationale.push("Matches navigation needs");
		}
		if (
			answers.interaction_type === "Content display" &&
			pattern.category === "content"
		) {
			confidence += 30;
			rationale.push("Matches content display needs");
		}
		if (
			answers.interaction_type === "Feedback/notification" &&
			pattern.category === "user-feedback"
		) {
			confidence += 30;
			rationale.push("Matches feedback needs");
		}
		if (
			answers.interaction_type === "Overlay/modal" &&
			pattern.category === "overlays"
		) {
			confidence += 30;
			rationale.push("Matches overlay needs");
		}

		// Match user action
		if (
			answers.user_action === "Enter data" &&
			pattern.slug.includes("text-field")
		) {
			confidence += 20;
			rationale.push("Good for data entry");
		}
		if (answers.user_action === "Select from options") {
			if (
				pattern.slug.includes("select") ||
				pattern.slug.includes("radio") ||
				pattern.slug.includes("checkbox")
			) {
				confidence += 20;
				rationale.push("Designed for option selection");
			}
		}

		// Match data type
		if (answers.data_type === "Boolean (yes/no)") {
			if (
				pattern.slug.includes("toggle") ||
				pattern.slug.includes("checkbox")
			) {
				confidence += 15;
				rationale.push("Ideal for boolean values");
			}
		}
		if (answers.data_type === "Multiple choice") {
			if (pattern.slug.includes("checkbox") || pattern.slug.includes("multi")) {
				confidence += 15;
				rationale.push("Supports multiple selections");
			}
		}

		// Check requirements text if provided
		if (requirements) {
			const reqLower = requirements.toLowerCase();
			if (pattern.title.toLowerCase().includes(reqLower)) {
				confidence += 25;
				rationale.push("Direct title match");
			}
			if (pattern.description.toLowerCase().includes(reqLower)) {
				confidence += 10;
				rationale.push("Matches description");
			}
			if (pattern.aliases?.some((a) => reqLower.includes(a.toLowerCase()))) {
				confidence += 20;
				rationale.push("Matches alias");
			}
		}

		if (confidence > 0) {
			recommendations.push({
				pattern: pattern.slug,
				title: pattern.title,
				confidence: Math.min(confidence / 100, 1),
				rationale: rationale.join("; ") || "May be relevant to your needs",
				category: pattern.category,
			});
		}
	}

	// Sort by confidence and take top 5
	recommendations.sort((a, b) => b.confidence - a.confidence);
	const topRecommendations = recommendations.slice(0, 5);

	// Generate alternative approaches
	const categories = new Set(topRecommendations.map((r) => r.category));
	const alternativeApproaches =
		categories.size > 1
			? Array.from(categories).map(
					(c) => `Consider patterns from the ${c} category`,
				)
			: undefined;

	return {
		recommendations: topRecommendations,
		alternativeApproaches,
	};
}

export async function patternAdvisor(
	args: Record<string, unknown>,
): Promise<
	PatternAdvisorInteractiveResponse | PatternAdvisorRecommendationResponse
> {
	const params = args as unknown as PatternAdvisorParams;
	const {
		mode = "direct",
		requirements,
		sessionId,
		answers: newAnswers,
	} = params;

	// Direct mode - just give recommendations based on requirements
	if (mode === "direct") {
		return getRecommendations(newAnswers || {}, requirements);
	}

	// Repeating the same token and answers produces the same next question.
	const answers = {
		...readContinuation(sessionId),
		...validateAnswers(newAnswers ?? {}),
	};
	const next = questions.find((question) => !(question.id in answers));
	if (!next) return getRecommendations(answers, requirements);
	return {
		sessionId: continuation(answers),
		questions: [next],
		progress: Object.keys(answers).length / questions.length,
	};
}
