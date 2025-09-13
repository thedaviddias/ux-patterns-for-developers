"use client";

import { trackDocsFeedback } from "@ux-patterns/tracking/helpers";
import { usePlausible } from "next-plausible";
import { handleFeedbackRate } from "@/lib/feedback-actions";
import type { ActionResponse, Feedback as FeedbackType } from "./feedback";
import { Feedback } from "./feedback";

export function FeedbackWrapper() {
	const plausible = usePlausible();

	const handleRateAction = async (
		url: string,
		feedback: FeedbackType,
	): Promise<ActionResponse> => {
		// Track the feedback event on the client side
		trackDocsFeedback(plausible, feedback.opinion, url, feedback.message);

		// Call the server action
		return handleFeedbackRate(url, feedback);
	};

	return <Feedback onRateAction={handleRateAction} />;
}
