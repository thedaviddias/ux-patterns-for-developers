export const BASE_URL = "https://uxpatterns.dev";

export const GITHUB_REPO_URL =
	"https://github.com/thedaviddias/ux-patterns-for-developers/blob/main/apps/web/";

export const PROJECT_URL =
	"https://github.com/thedaviddias/ux-patterns-for-developers";

/**
 * Get the appropriate web app URL based on the environment
 * In development: http://localhost:3060
 * In production: https://uxpatterns.dev
 */
export const getWebAppUrl = () => {
	if (process.env.NODE_ENV === "development") {
		return "http://localhost:3060";
	}
	return BASE_URL;
};
