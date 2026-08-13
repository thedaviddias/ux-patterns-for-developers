import { createRouteHandler as createOpenPanelRouteHandler } from "@openpanel/nextjs/server";

import { OPENPANEL_API_URL } from "./constants";

export function createRouteHandler() {
	return createOpenPanelRouteHandler({ apiUrl: OPENPANEL_API_URL });
}
