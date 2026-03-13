import { loadFont as loadMonoFont } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadDisplayFont } from "@remotion/google-fonts/SpaceGrotesk";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import type { ReactNode } from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { CaptionCard } from "../components/CaptionCard";
import { SceneShell } from "../components/SceneShell";
import { getLaunchSkillData } from "../data/skills-data";
import {
	buildExampleCommands,
	type NpxSkillsLaunchProps,
	SCENE_SEGMENTS,
	TRANSITION_DURATION_IN_FRAMES,
} from "../data/video-config";

loadDisplayFont("normal", {
	subsets: ["latin"],
	weights: ["400", "500", "700"],
});
loadMonoFont("normal", {
	subsets: ["latin"],
	weights: ["400", "500", "700"],
});

const palette = {
	green:
		"radial-gradient(circle, rgba(112, 255, 195, 0.88), rgba(112, 255, 195, 0.12) 70%)",
	orange:
		"radial-gradient(circle, rgba(255, 154, 90, 0.86), rgba(255, 154, 90, 0.12) 72%)",
	blue: "radial-gradient(circle, rgba(84, 164, 255, 0.88), rgba(84, 164, 255, 0.12) 70%)",
};

const glassCardStyle = {
	borderRadius: 28,
	border: "1px solid rgba(16, 19, 33, 0.08)",
	background:
		"linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(248, 242, 232, 0.72))",
	boxShadow: "0 24px 60px rgba(16, 19, 33, 0.08)",
};

const getSpringProgress = (frame: number, fps: number, delay = 0) =>
	spring({
		frame: Math.max(0, frame - delay),
		fps,
		config: { stiffness: 120, damping: 18, mass: 0.9 },
	});

const AnimatedPanel = ({
	children,
	delay = 0,
	rotate = 0,
	x = 0,
	y = 0,
	padding = 24,
}: {
	children: ReactNode;
	delay?: number;
	rotate?: number;
	x?: number;
	y?: number;
	padding?: number | string;
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const enter = getSpringProgress(frame, fps, delay);
	const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				...glassCardStyle,
				padding,
				opacity,
				transform: `translate3d(${x * (1 - enter)}px, ${y * (1 - enter)}px, 0) rotate(${rotate * (1 - enter)}deg) scale(${0.92 + enter * 0.08})`,
			}}
		>
			{children}
		</div>
	);
};

const PhoneStage = ({
	children,
	delay = 0,
}: {
	children: ReactNode;
	delay?: number;
}) => {
	const frame = useCurrentFrame();
	const { fps, height, width } = useVideoConfig();
	const isPortrait = height > width;
	const enter = getSpringProgress(frame, fps, delay);

	return (
		<div
			style={{
				width: isPortrait ? 550 : 480,
				maxWidth: "100%",
				height: isPortrait ? 760 : 610,
				borderRadius: 44,
				padding: 16,
				background:
					"linear-gradient(160deg, rgba(16, 19, 33, 0.96), rgba(29, 36, 60, 0.92))",
				boxShadow: "0 42px 110px rgba(16, 19, 33, 0.24)",
				transform: `translateY(${(1 - enter) * 36}px) scale(${0.93 + enter * 0.07})`,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					height: "100%",
					borderRadius: 30,
					background:
						"radial-gradient(circle at top right, rgba(112, 255, 195, 0.16), transparent 32%), linear-gradient(180deg, rgba(248, 244, 238, 0.98), rgba(229, 236, 244, 0.98))",
					border: "1px solid rgba(255, 255, 255, 0.12)",
					padding: isPortrait ? "28px 26px" : "24px 24px",
					position: "relative",
				}}
			>
				{children}
			</div>
		</div>
	);
};

const TerminalWindow = ({
	command,
	label,
	mode = "full",
}: {
	command: string;
	label: string;
	mode?: "full" | "macro";
}) => {
	const frame = useCurrentFrame();
	const { fps, height, width } = useVideoConfig();
	const isPortrait = height > width;
	const reveal = interpolate(
		frame,
		[0, mode === "macro" ? 46 : 68],
		[0, command.length],
		{
			extrapolateRight: "clamp",
		},
	);
	const visibleCommand = command.slice(0, Math.floor(reveal));
	const blink = Math.floor(frame / 12) % 2 === 0;
	const scale = getSpringProgress(frame, fps, 0);

	return (
		<div
			style={{
				...glassCardStyle,
				padding: isPortrait
					? mode === "macro"
						? 22
						: 24
					: mode === "macro"
						? 26
						: 28,
				background:
					"linear-gradient(180deg, rgba(11, 14, 30, 0.98), rgba(20, 27, 49, 0.96))",
				border: "1px solid rgba(255,255,255,0.08)",
				boxShadow: "0 30px 70px rgba(16, 19, 33, 0.24)",
				transform: `scale(${0.96 + scale * 0.04})`,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: mode === "macro" ? 18 : 22,
					fontFamily: '"IBM Plex Mono", monospace',
					fontSize: isPortrait ? 15 : 17,
					color: "rgba(246, 244, 239, 0.58)",
				}}
			>
				<div style={{ display: "flex", gap: 10 }}>
					{["#ff6b6b", "#ffd166", "#2ec4b6"].map((color) => (
						<div
							key={color}
							style={{
								width: 10,
								height: 10,
								borderRadius: 999,
								background: color,
							}}
						/>
					))}
				</div>
				<span>{label}</span>
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "flex-start",
					gap: 14,
					fontFamily: '"IBM Plex Mono", monospace',
					fontSize:
						mode === "macro" ? (isPortrait ? 24 : 32) : isPortrait ? 17 : 22,
					lineHeight: 1.35,
					wordBreak: "break-word",
					color: "#f6f4ef",
				}}
			>
				<span style={{ color: "#70ffc3" }}>$</span>
				<span>{visibleCommand}</span>
				<span style={{ opacity: blink ? 1 : 0, color: "#70ffc3" }}>|</span>
			</div>
		</div>
	);
};

const FloatingChip = ({
	label,
	index,
	color,
}: {
	label: string;
	index: number;
	color: string;
}) => {
	const frame = useCurrentFrame();
	const { height, width } = useVideoConfig();
	const isPortrait = height > width;
	const xOffsets = isPortrait ? [-155, 170, -138, 148] : [-220, 230, -185, 190];
	const yOffsets = isPortrait ? [34, 122, 520, 606] : [24, 88, 388, 448];
	const rotateOffsets = [-8, 8, -6, 6];
	const floatY = Math.sin((frame + index * 11) / 18) * 10;

	return (
		<div
			style={{
				position: "absolute",
				left: "50%",
				top: yOffsets[index % yOffsets.length],
				transform: `translateX(${xOffsets[index % xOffsets.length]}px) translateY(${floatY}px) rotate(${rotateOffsets[index % rotateOffsets.length]}deg)`,
				padding: isPortrait ? "12px 14px" : "12px 16px",
				borderRadius: 999,
				background: color,
				color: "#101321",
				fontFamily: '"IBM Plex Mono", monospace',
				fontSize: isPortrait ? 16 : 18,
				boxShadow: "0 16px 40px rgba(16, 19, 33, 0.14)",
			}}
		>
			{label}
		</div>
	);
};

const HookScene = ({
	count,
	highlightTitles,
}: {
	count: number;
	highlightTitles: string[];
}) => {
	const frame = useCurrentFrame();
	const { fps, height, width } = useVideoConfig();
	const isPortrait = height > width;
	const countScale = getSpringProgress(frame, fps, 0);

	return (
		<SceneShell
			kicker="Launch"
			title="Installable UX patterns for fast feeds and small screens"
			subtitle="A tighter teaser with one central device-safe stage, floating context, and faster visual shifts."
			accent={palette.green}
		>
			<div style={{ position: "relative", height: "100%" }}>
				<AnimatedPanel
					delay={0}
					x={-30}
					y={14}
					padding={isPortrait ? "18px 20px" : "20px 22px"}
				>
					<div
						style={{ display: "inline-flex", alignItems: "center", gap: 14 }}
					>
						<div
							style={{
								fontFamily: '"Space Grotesk", sans-serif',
								fontSize: isPortrait ? 84 : 96,
								lineHeight: 0.9,
								letterSpacing: "-0.08em",
								transform: `scale(${0.94 + countScale * 0.06})`,
								transformOrigin: "left center",
							}}
						>
							{count}
						</div>
						<div
							style={{
								fontFamily: '"IBM Plex Mono", monospace',
								fontSize: isPortrait ? 15 : 17,
								textTransform: "uppercase",
								letterSpacing: "0.18em",
								color: "rgba(16, 19, 33, 0.58)",
							}}
						>
							live installs
						</div>
					</div>
				</AnimatedPanel>

				<div
					style={{
						position: "absolute",
						left: "50%",
						top: isPortrait ? 132 : 56,
						transform: "translateX(-50%)",
					}}
				>
					<PhoneStage delay={8}>
						<div
							style={{
								fontFamily: '"IBM Plex Mono", monospace',
								fontSize: isPortrait ? 15 : 16,
								textTransform: "uppercase",
								letterSpacing: "0.18em",
								color: "rgba(16,19,33,0.54)",
								marginBottom: 18,
							}}
						>
							Teaser view
						</div>
						<div
							style={{
								fontFamily: '"Space Grotesk", sans-serif',
								fontSize: isPortrait ? 46 : 42,
								lineHeight: 0.92,
								letterSpacing: "-0.06em",
								maxWidth: 420,
								marginBottom: 22,
							}}
						>
							Installable knowledge, not just documentation.
						</div>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: isPortrait ? "1fr" : "1fr 1fr",
								gap: 14,
							}}
						>
							{[
								"Terminal-first",
								"Pattern aware",
								"Copyable installs",
								"Feed-safe layout",
							].map((item, index) => (
								<AnimatedPanel
									key={item}
									delay={14 + index * 4}
									x={index % 2 === 0 ? -18 : 18}
									y={18}
									padding={isPortrait ? "14px 16px" : "14px 18px"}
								>
									<div
										style={{
											fontFamily: '"IBM Plex Mono", monospace',
											fontSize: isPortrait ? 15 : 16,
											color: "#101321",
										}}
									>
										{item}
									</div>
								</AnimatedPanel>
							))}
						</div>
					</PhoneStage>
				</div>

				<div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
					{highlightTitles.slice(0, 4).map((label, index) => (
						<FloatingChip
							key={label}
							label={label}
							index={index}
							color={["#70ffc3", "#ffd166", "#8bb8ff", "#ffb08a"][index % 4]}
						/>
					))}
				</div>
			</div>
		</SceneShell>
	);
};

const TerminalScene = ({ command }: { command: string }) => {
	const { height, width } = useVideoConfig();
	const isPortrait = height > width;

	return (
		<SceneShell
			kicker="Install"
			title="Macro view for the command, utility view for the proof"
			subtitle="The teaser shifts between a hero command block and supporting micro-panels so the core action still reads on mobile."
			accent={palette.orange}
		>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: isPortrait ? "1fr" : "1.2fr 0.8fr",
					gap: 18,
					height: "100%",
				}}
			>
				<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
					<AnimatedPanel delay={0} x={-32} y={18} rotate={-2} padding={0}>
						<TerminalWindow
							command={command}
							label="Global install"
							mode={isPortrait ? "full" : "macro"}
						/>
					</AnimatedPanel>

					<div
						style={{
							display: "grid",
							gridTemplateColumns: isPortrait ? "1fr" : "1fr 1fr",
							gap: 16,
						}}
					>
						<AnimatedPanel delay={10} x={-18} y={12} padding="18px 20px">
							<div
								style={{
									fontFamily: '"IBM Plex Mono", monospace',
									fontSize: 15,
									textTransform: "uppercase",
									letterSpacing: "0.18em",
									color: "rgba(16,19,33,0.54)",
									marginBottom: 10,
								}}
							>
								Install target
							</div>
							<div
								style={{
									fontFamily: '"Space Grotesk", sans-serif',
									fontSize: isPortrait ? 28 : 30,
									lineHeight: 1,
									letterSpacing: "-0.05em",
								}}
							>
								--skill ux-patterns
							</div>
						</AnimatedPanel>
						<AnimatedPanel delay={14} x={18} y={10} padding="18px 20px">
							<div
								style={{
									fontFamily: '"IBM Plex Mono", monospace',
									fontSize: 15,
									textTransform: "uppercase",
									letterSpacing: "0.18em",
									color: "rgba(16,19,33,0.54)",
									marginBottom: 10,
								}}
							>
								Install source
							</div>
							<div
								style={{
									fontFamily: '"Space Grotesk", sans-serif',
									fontSize: isPortrait ? 22 : 24,
									lineHeight: 1.04,
									letterSpacing: "-0.04em",
								}}
							>
								github.com/thedaviddias/ux-patterns-for-developers
							</div>
						</AnimatedPanel>
					</div>
				</div>

				<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
					{[
						"Pulled from the generated skills manifest.",
						"Direct repository install, not a placeholder.",
						"Large enough to stay readable in portrait.",
					].map((item, index) => (
						<AnimatedPanel
							key={item}
							delay={12 + index * 4}
							x={22}
							y={16}
							rotate={index % 2 === 0 ? 2 : -2}
							padding={isPortrait ? "18px 20px" : "20px 22px"}
						>
							<div
								style={{
									display: "flex",
									gap: 14,
									alignItems: "flex-start",
								}}
							>
								<div
									style={{
										width: 30,
										height: 30,
										borderRadius: 999,
										background: "#101321",
										color: "#f7f2e7",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontFamily: '"IBM Plex Mono", monospace',
										fontSize: 16,
										flexShrink: 0,
									}}
								>
									0{index + 1}
								</div>
								<p
									style={{
										margin: 0,
										fontFamily: '"Space Grotesk", sans-serif',
										fontSize: isPortrait ? 24 : 26,
										lineHeight: 1.1,
										letterSpacing: "-0.03em",
									}}
								>
									{item}
								</p>
							</div>
						</AnimatedPanel>
					))}
				</div>
			</div>
		</SceneShell>
	);
};

const SkillBurstScene = ({
	skills,
}: {
	skills: { skillSlug: string; title: string; category: string }[];
}) => {
	const frame = useCurrentFrame();
	const { height, width } = useVideoConfig();
	const isPortrait = height > width;

	return (
		<SceneShell
			kicker="Catalog"
			title="Different cards, different depths, one live manifest"
			subtitle="The middle of the teaser behaves like a moving catalog wall rather than a static grid."
			accent={palette.blue}
		>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: isPortrait
						? "repeat(2, minmax(0, 1fr))"
						: "repeat(3, minmax(0, 1fr))",
					gap: 18,
				}}
			>
				{skills.map((skill, index) => {
					const appearAt = 4 + index * 3;
					const translate = interpolate(
						frame,
						[appearAt, appearAt + 16],
						[48 + (index % 3) * 10, 0],
						{
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
						},
					);
					const opacity = interpolate(
						frame,
						[appearAt, appearAt + 14],
						[0, 1],
						{
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
						},
					);
					const scale = 1 + Math.sin((frame + index * 10) / 30) * 0.015;

					return (
						<div
							key={skill.skillSlug}
							style={{
								...glassCardStyle,
								padding: index === 0 && !isPortrait ? 30 : 24,
								display: "flex",
								flexDirection: "column",
								gap: 14,
								transform: `translateY(${translate + (index % 2 === 0 ? 0 : 10)}px) scale(${scale})`,
								opacity,
								minHeight: index === 0 && !isPortrait ? 220 : undefined,
							}}
						>
							<div
								style={{
									fontFamily: '"IBM Plex Mono", monospace',
									fontSize: 15,
									textTransform: "uppercase",
									letterSpacing: "0.16em",
									color: "rgba(16, 19, 33, 0.52)",
								}}
							>
								{skill.category}
							</div>
							<div
								style={{
									fontFamily: '"Space Grotesk", sans-serif',
									fontSize:
										index === 0 && !isPortrait ? 48 : isPortrait ? 30 : 34,
									lineHeight: 0.94,
									letterSpacing: "-0.05em",
								}}
							>
								{skill.title}
							</div>
							<div
								style={{
									height: 6,
									borderRadius: 999,
									background:
										index % 3 === 0
											? "#70ffc3"
											: index % 3 === 1
												? "#ffd166"
												: "#8bb8ff",
									width: `${62 + (index % 3) * 12}%`,
								}}
							/>
							<div
								style={{
									fontFamily: '"IBM Plex Mono", monospace',
									fontSize: isPortrait ? 16 : 18,
									color: "#2a8f6e",
								}}
							>
								--skill {skill.skillSlug}
							</div>
						</div>
					);
				})}
			</div>
		</SceneShell>
	);
};

const ExampleCommandsScene = ({ commands }: { commands: string[] }) => {
	const frame = useCurrentFrame();
	const { height, width } = useVideoConfig();
	const isPortrait = height > width;

	return (
		<SceneShell
			kicker="Examples"
			title="Stack the examples like a teaser, not a checklist"
			subtitle="One primary command on top, supporting views beneath it, all still readable inside a narrow device frame."
			accent={palette.green}
		>
			<div
				style={{
					position: "relative",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{commands.map((command, index) => {
					const appearAt = 6 + index * 6;
					const opacity = interpolate(
						frame,
						[appearAt, appearAt + 12],
						[0, 1],
						{
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
						},
					);
					const stackOffset = index * (isPortrait ? 70 : 54);
					const rotate = index === 0 ? -2 : index === 1 ? 2 : -1;
					const scale = index === 0 ? 1 : index === 1 ? 0.95 : 0.91;

					return (
						<div
							key={command}
							style={{
								...glassCardStyle,
								position: "absolute",
								width: isPortrait ? "100%" : "86%",
								maxWidth: 900,
								padding: isPortrait ? "22px 24px" : "26px 30px",
								display: "flex",
								alignItems: "flex-start",
								flexDirection: "column",
								gap: 16,
								opacity,
								transform: `translateY(${
									stackOffset +
									interpolate(frame, [appearAt, appearAt + 12], [40, 0], {
										extrapolateLeft: "clamp",
										extrapolateRight: "clamp",
									})
								}px) rotate(${rotate}deg) scale(${scale})`,
								zIndex: commands.length - index,
							}}
						>
							<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
								<div
									style={{
										padding: "8px 12px",
										borderRadius: 999,
										background: "#101321",
										color: "#f7f2e7",
										fontFamily: '"IBM Plex Mono", monospace',
										fontSize: 16,
										textTransform: "uppercase",
										letterSpacing: "0.12em",
									}}
								>
									view {index + 1}
								</div>
								<div
									style={{
										fontFamily: '"IBM Plex Mono", monospace',
										fontSize: 15,
										textTransform: "uppercase",
										letterSpacing: "0.18em",
										color: "rgba(16, 19, 33, 0.52)",
									}}
								>
									pattern install
								</div>
							</div>
							<div
								style={{
									fontFamily: '"IBM Plex Mono", monospace',
									fontSize: isPortrait ? 20 : 26,
									lineHeight: 1.25,
									color: "#101321",
									wordBreak: "break-word",
								}}
							>
								{command}
							</div>
						</div>
					);
				})}
			</div>
		</SceneShell>
	);
};

const CloseScene = ({ ctaUrl, count }: { ctaUrl: string; count: number }) => {
	const { height, width } = useVideoConfig();
	const isPortrait = height > width;

	return (
		<SceneShell
			kicker="Ship it"
			title="End on a clean CTA, not a crowded outro"
			subtitle="Hold the URL long enough to read on a phone, then reinforce the product line with one final install card."
			accent={palette.orange}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 18,
					height: "100%",
				}}
			>
				<AnimatedPanel
					delay={0}
					x={0}
					y={18}
					padding={isPortrait ? "24px 26px" : "28px 30px"}
				>
					<div
						style={{
							fontFamily: '"IBM Plex Mono", monospace',
							fontSize: 15,
							textTransform: "uppercase",
							letterSpacing: "0.18em",
							color: "rgba(16, 19, 33, 0.54)",
							marginBottom: 12,
						}}
					>
						Launch CTA
					</div>
					<div
						style={{
							fontFamily: '"Space Grotesk", sans-serif',
							fontSize: isPortrait ? 58 : 82,
							lineHeight: 0.9,
							letterSpacing: "-0.07em",
							wordBreak: "break-word",
							marginBottom: 18,
						}}
					>
						{ctaUrl.replace("https://", "")}
					</div>
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 14,
							padding: "14px 16px",
							borderRadius: 999,
							background: "#101321",
							color: "#f7f2e7",
							fontFamily: '"IBM Plex Mono", monospace',
							fontSize: isPortrait ? 16 : 18,
						}}
					>
						<span>{count} curated installs</span>
						<span style={{ opacity: 0.5 }}>•</span>
						<span>silent teaser</span>
					</div>
				</AnimatedPanel>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: isPortrait ? "1fr" : "1fr 1fr",
						gap: 18,
					}}
				>
					<AnimatedPanel
						delay={10}
						x={-20}
						y={18}
						rotate={-2}
						padding="22px 24px"
					>
						<div
							style={{
								fontFamily: '"IBM Plex Mono", monospace',
								fontSize: 15,
								textTransform: "uppercase",
								letterSpacing: "0.18em",
								color: "rgba(16, 19, 33, 0.54)",
								marginBottom: 10,
							}}
						>
							Product line
						</div>
						<div
							style={{
								fontFamily: '"Space Grotesk", sans-serif',
								fontSize: isPortrait ? 34 : 38,
								lineHeight: 0.94,
								letterSpacing: "-0.05em",
							}}
						>
							Patterns for developers, now packaged as skills.
						</div>
					</AnimatedPanel>
					<AnimatedPanel
						delay={14}
						x={20}
						y={18}
						rotate={2}
						padding="22px 24px"
					>
						<div
							style={{
								fontFamily: '"IBM Plex Mono", monospace',
								fontSize: 15,
								textTransform: "uppercase",
								letterSpacing: "0.18em",
								color: "rgba(16, 19, 33, 0.54)",
								marginBottom: 10,
							}}
						>
							Install pattern
						</div>
						<div
							style={{
								fontFamily: '"IBM Plex Mono", monospace',
								fontSize: isPortrait ? 18 : 20,
								lineHeight: 1.4,
								color: "#101321",
								wordBreak: "break-word",
							}}
						>
							npx skills add
							https://github.com/thedaviddias/ux-patterns-for-developers --skill
							ux-patterns
						</div>
					</AnimatedPanel>
				</div>
			</div>
		</SceneShell>
	);
};

export const NpxSkillsLaunch = ({
	ctaUrl,
	highlightSkills,
}: NpxSkillsLaunchProps) => {
	const data = getLaunchSkillData(highlightSkills);
	const exampleCommands = buildExampleCommands(data.highlightSkills);
	const highlightTitles =
		data.highlightSkills.length > 0
			? data.highlightSkills.map((item) => item.title)
			: ["Login", "Accordion", "Button", "Tabs"];

	return (
		<AbsoluteFill style={{ backgroundColor: "#f7f2e7" }}>
			<TransitionSeries>
				<TransitionSeries.Sequence
					durationInFrames={SCENE_SEGMENTS[0].durationInFrames}
				>
					<AbsoluteFill>
						<HookScene
							count={data.totalSkillCount}
							highlightTitles={highlightTitles}
						/>
						<CaptionCard text={SCENE_SEGMENTS[0].caption} />
					</AbsoluteFill>
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({
						durationInFrames: TRANSITION_DURATION_IN_FRAMES,
					})}
				/>
				<TransitionSeries.Sequence
					durationInFrames={SCENE_SEGMENTS[1].durationInFrames}
				>
					<AbsoluteFill>
						<TerminalScene command={data.globalSkill.installCommand} />
						<CaptionCard text={SCENE_SEGMENTS[1].caption} />
					</AbsoluteFill>
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({ direction: "from-right" })}
					timing={linearTiming({
						durationInFrames: TRANSITION_DURATION_IN_FRAMES,
					})}
				/>
				<TransitionSeries.Sequence
					durationInFrames={SCENE_SEGMENTS[2].durationInFrames}
				>
					<AbsoluteFill>
						<SkillBurstScene skills={data.burstSkills} />
						<CaptionCard text={SCENE_SEGMENTS[2].caption} />
					</AbsoluteFill>
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({
						durationInFrames: TRANSITION_DURATION_IN_FRAMES,
					})}
				/>
				<TransitionSeries.Sequence
					durationInFrames={SCENE_SEGMENTS[3].durationInFrames}
				>
					<AbsoluteFill>
						<ExampleCommandsScene commands={exampleCommands} />
						<CaptionCard text={SCENE_SEGMENTS[3].caption} />
					</AbsoluteFill>
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({ direction: "from-bottom" })}
					timing={linearTiming({
						durationInFrames: TRANSITION_DURATION_IN_FRAMES,
					})}
				/>
				<TransitionSeries.Sequence
					durationInFrames={SCENE_SEGMENTS[4].durationInFrames}
				>
					<AbsoluteFill>
						<CloseScene ctaUrl={ctaUrl} count={data.totalSkillCount} />
						<CaptionCard text={SCENE_SEGMENTS[4].caption} />
					</AbsoluteFill>
				</TransitionSeries.Sequence>
			</TransitionSeries>

			<div
				style={{
					position: "absolute",
					top: 30,
					right: 34,
					padding: "10px 16px",
					borderRadius: 999,
					background: "rgba(16, 19, 33, 0.08)",
					color: "#101321",
					fontFamily: '"IBM Plex Mono", monospace',
					fontSize: 16,
					letterSpacing: "0.12em",
					textTransform: "uppercase",
				}}
			>
				Modern teaser
			</div>
		</AbsoluteFill>
	);
};
