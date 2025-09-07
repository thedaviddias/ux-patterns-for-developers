/**
 * Get the appropriate web app URL based on the environment
 * In development: http://localhost:3060
 * In production: https://uxpatterns.dev
 */
export const getWebAppUrl = () => {
	if (process.env.NODE_ENV === "development") {
		return "http://localhost:3060";
	}
	return "https://uxpatterns.dev";
};
