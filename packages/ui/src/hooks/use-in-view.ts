import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
	threshold?: number;
	rootMargin?: string;
	triggerOnce?: boolean;
}

export function useInView(options: UseInViewOptions = {}) {
	const { threshold = 0, rootMargin = "0px", triggerOnce = false } = options;
	const [isInView, setIsInView] = useState(false);
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsInView(entry.isIntersecting);
				if (entry.isIntersecting && triggerOnce) {
					observer.disconnect();
				}
			},
			{
				threshold,
				rootMargin,
			},
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [threshold, rootMargin, triggerOnce]);

	return { ref, isInView };
}
