import type { ReactNode } from "react";
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

export const SceneShell = ({
	children,
	kicker,
	title,
	subtitle,
	accent,
}: {
	children: ReactNode;
	kicker: string;
	title: string;
	subtitle: string;
	accent: string;
}) => {
	const frame = useCurrentFrame();
	const { height, width } = useVideoConfig();
	const isPortrait = height > width;
	const opacity = interpolate(frame, [0, 10], [0.75, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				background:
					"radial-gradient(circle at top left, rgba(112, 255, 195, 0.18), transparent 35%), radial-gradient(circle at top right, rgba(255, 154, 90, 0.16), transparent 32%), linear-gradient(160deg, #f7f2e7 0%, #e7ebf7 42%, #dbe7ef 100%)",
				color: "#101321",
				opacity,
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: isPortrait ? 18 : 24,
					borderRadius: 42,
					border: "1px solid rgba(16, 19, 33, 0.08)",
					background:
						"linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(247, 242, 231, 0.58))",
					boxShadow: "0 40px 120px rgba(16, 19, 33, 0.12)",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: -120,
						right: -100,
						width: 380,
						height: 380,
						borderRadius: 999,
						background: accent,
						filter: "blur(60px)",
						opacity: 0.4,
					}}
				/>

				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage:
							"linear-gradient(rgba(16, 19, 33, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 19, 33, 0.04) 1px, transparent 1px)",
						backgroundSize: "54px 54px",
						maskImage:
							"linear-gradient(180deg, rgba(0,0,0,0.36), rgba(0,0,0,0.08) 60%, transparent)",
					}}
				/>

				<div
					style={{
						position: "relative",
						height: "100%",
						padding: isPortrait ? "52px 42px 170px" : "64px 68px 168px",
						display: "flex",
						flexDirection: "column",
						gap: isPortrait ? 20 : 24,
					}}
				>
					<div
						style={{
							display: "inline-flex",
							alignSelf: "flex-start",
							padding: "10px 16px",
							borderRadius: 999,
							background: "rgba(16, 19, 33, 0.08)",
							border: "1px solid rgba(16, 19, 33, 0.08)",
							fontFamily: '"IBM Plex Mono", monospace',
							fontSize: isPortrait ? 18 : 22,
							textTransform: "uppercase",
							letterSpacing: "0.18em",
						}}
					>
						{kicker}
					</div>

					<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
						<h1
							style={{
								margin: 0,
								fontFamily: '"Space Grotesk", sans-serif',
								fontSize: isPortrait ? 64 : 84,
								lineHeight: 0.94,
								letterSpacing: "-0.06em",
								maxWidth: 1020,
							}}
						>
							{title}
						</h1>
						<p
							style={{
								margin: 0,
								maxWidth: 980,
								fontFamily: '"Space Grotesk", sans-serif',
								fontSize: isPortrait ? 24 : 30,
								lineHeight: 1.3,
								color: "rgba(16, 19, 33, 0.72)",
							}}
						>
							{subtitle}
						</p>
					</div>

					<div style={{ flex: 1, minHeight: 0 }}>{children}</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
