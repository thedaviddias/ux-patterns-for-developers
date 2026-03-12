export const runtime = "edge";

export function GET() {
	return Response.json(
		{ status: "ok", timestamp: Date.now() },
		{
			headers: {
				"Cache-Control": "no-cache, no-store, must-revalidate",
				"X-Robots-Tag": "noindex",
			},
		},
	);
}
