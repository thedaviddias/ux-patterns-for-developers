const TRUNCATION_SUFFIX =
	"\n\n[... response truncated to stay within token budget ...]";

export const DEFAULT_MAX_RESPONSE_CHARS = 32_000;

export function capResponseText(
	text: string,
	maxChars: number = DEFAULT_MAX_RESPONSE_CHARS,
): string {
	if (text.length <= maxChars) {
		return text;
	}

	const keep = maxChars - TRUNCATION_SUFFIX.length;
	const truncated = text.slice(0, keep);
	const lastNewline = truncated.lastIndexOf("\n");
	const cut = lastNewline > keep * 0.8 ? lastNewline + 1 : keep;

	return text.slice(0, cut) + TRUNCATION_SUFFIX;
}
