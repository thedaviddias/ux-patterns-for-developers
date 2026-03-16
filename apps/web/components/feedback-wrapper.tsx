"use client";

import { trackDocsFeedback } from "@ux-patterns/tracking/helpers";
import { handleFeedbackRate } from "@/lib/feedback-actions";
import type { ActionResponse, Feedback as FeedbackType } from "./feedback";
import { Feedback } from "./feedback";

export function FeedbackWrapper() {
	const handleRateAction = async (
		url: string,
		feedback: FeedbackType,
	): Promise<ActionResponse> => {
		// Track the feedback event on the client side
		trackDocsFeedback(feedback.opinion, url, feedback.message);

		// Call the server action
		return handleFeedbackRate(url, feedback);
	};

	return <Feedback onRateAction={handleRateAction} />;
}
