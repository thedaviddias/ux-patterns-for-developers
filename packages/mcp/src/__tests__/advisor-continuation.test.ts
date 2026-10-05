import { jest } from "@jest/globals";
import { patternAdvisor } from "../tools/pattern-advisor";

describe("stateless interactive advisor", () => {
	it("retries the same answer without skipping a question", async () => {
		const first = await patternAdvisor({ mode: "interactive" });
		if (!("sessionId" in first)) throw new Error("Expected continuation");
		const args = {
			mode: "interactive",
			sessionId: first.sessionId,
			answers: { interaction_type: "Form input" },
		};
		const next = await patternAdvisor(args);
		expect(next).toEqual(await patternAdvisor(args));
		expect(next).toMatchObject({
			progress: 0.25,
			questions: [{ id: "user_action" }],
		});
	});
	it("resumes on a fresh module and completes with all choices", async () => {
		const initial = await patternAdvisor({
			mode: "interactive",
			answers: { interaction_type: "Form input" },
		});
		if (!("sessionId" in initial)) throw new Error("Expected continuation");
		jest.resetModules();
		const fresh = (await import("../tools/pattern-advisor")).patternAdvisor;
		const result = await fresh({
			mode: "interactive",
			sessionId: initial.sessionId,
			answers: {
				user_action: "Select from options",
				data_type: "Multiple choice",
				accessibility_priority: "Important",
			},
		});
		expect(result).toHaveProperty("recommendations");
		expect(result).not.toHaveProperty("sessionId");
	});
	it("rejects malformed, oversized and obsolete tokens with a restart path", async () => {
		for (const sessionId of [
			"advisor_old",
			"advisor_v2_invalid",
			"x".repeat(2049),
		]) {
			await expect(
				patternAdvisor({ mode: "interactive", sessionId }),
			).rejects.toThrow("Restart interactive mode without sessionId");
		}
	});
	it("rejects arbitrary choices and unknown question IDs", async () => {
		for (const answers of [
			{ interaction_type: "invented" },
			{ unknown: "Form input" },
			[],
		]) {
			await expect(
				patternAdvisor({ mode: "interactive", answers }),
			).rejects.toThrow();
		}
	});
});
