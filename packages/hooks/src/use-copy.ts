import { useCallback, useEffect, useRef, useState } from "react";

export function useCopy(duration = 1500) {
	const [copied, setCopied] = useState<boolean>(false);
	const timeoutRef = useRef<number | null>(null);

	const clearCopiedTimeout = useCallback(() => {
		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	const markCopied = useCallback(() => {
		setCopied(true);
		clearCopiedTimeout();
		timeoutRef.current = window.setTimeout(() => {
			setCopied(false);
			timeoutRef.current = null;
		}, duration);
	}, [clearCopiedTimeout, duration]);

	const copy = useCallback(
		async (text: string) => {
			try {
				await navigator.clipboard.writeText(text);
				markCopied();
				return true;
			} catch (err) {
				console.error("Failed to copy text: ", err);
				return false;
			}
		},
		[markCopied],
	);

	useEffect(() => {
		return () => {
			clearCopiedTimeout();
		};
	}, [clearCopiedTimeout]);

	return {
		copied,
		copy,
		markCopied,
	};
}
