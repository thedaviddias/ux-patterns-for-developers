import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

export const CaptionCard = ({ text }: { text: string }) => {
	const frame = useCurrentFrame();
	const { fps, height, width } = useVideoConfig();
	const isPortrait = height > width;
	const rise = spring({
		fps,
		frame,
		config: { damping: 20, stiffness: 120 },
	});
	const opacity = interpolate(frame, [0, 8, 28], [0, 0.85, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: "flex-end",
				alignItems: "center",
				padding: isPortrait ? "0 34px 56px" : "0 64px 56px",
				pointerEvents: "none",
			}}
		>
			<div
				style={{
					maxWidth: isPortrait ? 860 : 980,
					padding: isPortrait ? "18px 22px" : "18px 26px",
					borderRadius: 26,
					border: "1px solid rgba(245, 245, 240, 0.18)",
					background:
						"linear-gradient(135deg, rgba(12, 15, 31, 0.86), rgba(23, 31, 57, 0.76))",
					boxShadow: "0 30px 80px rgba(0, 0, 0, 0.32)",
					backdropFilter: "blur(24px)",
					color: "#f8f7f2",
					fontFamily: '"Space Grotesk", sans-serif',
					fontSize: isPortrait ? 28 : 34,
					fontWeight: 500,
					lineHeight: 1.3,
					letterSpacing: "-0.03em",
					opacity,
					transform: `translateY(${(1 - rise) * 28}px)`,
				}}
			>
				{text}
			</div>
		</AbsoluteFill>
	);
};
