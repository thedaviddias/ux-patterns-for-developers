// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { initBotId } from "botid/client/core";

Sentry.init({
	dsn: "https://931a829b16ed3b014310f19f0a55c618@o515454.ingest.us.sentry.io/4508413880041472",

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
	enabled: process.env.NODE_ENV !== "development",
});

// Initialize BotID protection for sensitive endpoints
// https://vercel.com/docs/botid/get-started
initBotId({
	protect: [
		// Newsletter subscription API
		{
			path: "/api/newsletter",
			method: "POST",
		},
		// Feedback server actions (invoked from content pages)
		// Wildcard matches all dynamic page routes where feedback can be submitted
		{
			path: "/*",
			method: "POST",
		},
	],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
