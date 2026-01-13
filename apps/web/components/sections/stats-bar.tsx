"use client";

import { BookOpen, FolderOpen, Github, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StatsBarProps {
	patternCount: number;
	categoryCount: number;
	sectionsPerPattern?: number;
}

const GITHUB_API_URL =
	"https://api.github.com/repos/thedaviddias/ux-patterns-for-developers";

/**
 * Animated counter hook - counts up when element becomes visible
 */
function useAnimatedCounter(
	target: number,
	duration = 1500,
	startAnimation = false,
) {
	const [count, setCount] = useState(0);
	const startTime = useRef<number | null>(null);
	const animationFrame = useRef<number | null>(null);

	useEffect(() => {
		if (!startAnimation || target === 0) {
			setCount(target);
			return;
		}

		const animate = (timestamp: number) => {
			if (!startTime.current) startTime.current = timestamp;
			const progress = Math.min((timestamp - startTime.current) / duration, 1);

			// Easing function (ease-out-cubic)
			const eased = 1 - (1 - progress) ** 3;
			setCount(Math.floor(eased * target));

			if (progress < 1) {
				animationFrame.current = requestAnimationFrame(animate);
			} else {
				setCount(target);
			}
		};

		animationFrame.current = requestAnimationFrame(animate);

		return () => {
			if (animationFrame.current) {
				cancelAnimationFrame(animationFrame.current);
			}
		};
	}, [target, duration, startAnimation]);

	return count;
}

interface StatItemProps {
	value: number;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	suffix?: string;
}

function StatItem({ value, label, icon: Icon, suffix = "" }: StatItemProps) {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const animatedValue = useAnimatedCounter(value, 1500, isVisible);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.5 },
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref} className="flex flex-col items-center gap-1.5 py-4">
			<div className="flex items-center gap-2">
				<Icon className="h-4 w-4 text-muted-foreground/60" aria-hidden="true" />
				<span className="text-2xl sm:text-3xl font-semibold text-foreground tabular-nums tracking-tight">
					{animatedValue}
					{suffix}
				</span>
			</div>
			<span className="text-xs sm:text-sm text-muted-foreground">{label}</span>
		</div>
	);
}

function GitHubStarsItem() {
	const [stars, setStars] = useState<number | null>(null);
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const animatedStars = useAnimatedCounter(
		stars ?? 0,
		1500,
		isVisible && stars !== null,
	);

	useEffect(() => {
		const fetchStars = async () => {
			try {
				const response = await fetch(GITHUB_API_URL);
				if (!response.ok) return;
				const data = await response.json();
				if (typeof data.stargazers_count === "number") {
					setStars(data.stargazers_count);
				}
			} catch {
				// Silently fail - stars count is not critical
			}
		};
		fetchStars();
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.5 },
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref} className="flex flex-col items-center gap-1.5 py-4">
			<div className="flex items-center gap-2">
				<Github
					className="h-4 w-4 text-muted-foreground/60"
					aria-hidden="true"
				/>
				<span className="text-2xl sm:text-3xl font-semibold text-foreground tabular-nums tracking-tight">
					{stars === null ? "—" : animatedStars}
				</span>
			</div>
			<span className="text-xs sm:text-sm text-muted-foreground">
				GitHub Stars
			</span>
		</div>
	);
}

export function StatsBar({
	patternCount,
	categoryCount,
	sectionsPerPattern = 17,
}: StatsBarProps) {
	return (
		<section
			aria-label="Project statistics"
			className="border-y border-border bg-muted/30"
		>
			<div className="container mx-auto px-6">
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
					<StatItem
						value={patternCount}
						label="Patterns"
						icon={Layers}
						suffix="+"
					/>
					<StatItem
						value={categoryCount}
						label="Categories"
						icon={FolderOpen}
					/>
					<StatItem
						value={sectionsPerPattern}
						label="Sections per Pattern"
						icon={BookOpen}
					/>
					<GitHubStarsItem />
				</div>
			</div>
		</section>
	);
}
