import type { CSSProperties } from "react";
import { DEFAULT_PATTERN_COVER_COLOR } from "@/lib/pattern-cover-colors";

export const MODAL_OG_SIZE = {
	width: 1200,
	height: 630,
} as const;

export const MODAL_COVER_SIZE = {
	width: 1920,
	height: 1080,
} as const;

export type ModalSceneVariant = "og" | "cover";

const COVER_PADDING = 132;
const ACCENT = "#d7a241";
const BACKGROUND = "#050505";
const SURFACE = "rgba(16, 16, 16, 0.96)";
const SURFACE_BORDER = "rgba(255, 255, 255, 0.12)";
const MUTED_TEXT = "rgba(255, 255, 255, 0.72)";
const SOFT_TEXT = "rgba(255, 255, 255, 0.46)";

const OG_HELPER_TEXT = "Focused dialogs for critical actions";
const PROFILE_DESCRIPTION =
	"Make changes to your profile here. Click save when you're done.";

const fillLayerStyle: CSSProperties = {
	position: "absolute",
	inset: 0,
};

type ModalSceneProps = {
	backgroundImageUrl?: string;
	coverBackgroundColor?: string;
	style?: CSSProperties;
	variant?: ModalSceneVariant;
};

type ModalSceneConfig = {
	actionGap: number;
	buttonFontSize: number;
	buttonHeight: number;
	buttonPaddingX: number;
	canvasBackgroundColor: string;
	cardDescriptionFontSize: number;
	cardLineGap: number;
	cardLineHeight: number;
	cardLineWidths: [string, string];
	cardShadow: string;
	cardTitleFontSize: number;
	cardWidth: number;
	chromeGapBottom: number;
	closeSize: number;
	contentPaddingX: number;
	contentPaddingY: number;
	footerPaddingBottom: number;
	footerPaddingTop: number;
	gridOpacity: number;
	headerDescriptionMaxWidth: number;
	headerDescriptionSize: number;
	headerLabelSize: number;
	headerTitleSize: number;
	scenePaddingBottom: number;
	scenePaddingTop: number;
	scenePaddingX: number;
	secondaryButtonPaddingX: number;
	showChrome: boolean;
	showOgBackground: boolean;
	slotHeight: number;
	slotJustifyContent: "center" | "flex-start";
	slotPaddingTop: number;
	slotWidth: number;
};

function getModalSceneConfig(
	variant: ModalSceneVariant,
	coverBackgroundColor?: string,
): ModalSceneConfig {
	if (variant === "cover") {
		return {
			actionGap: 18,
			buttonFontSize: 30,
			buttonHeight: 84,
			buttonPaddingX: 40,
			canvasBackgroundColor:
				coverBackgroundColor || DEFAULT_PATTERN_COVER_COLOR,
			cardDescriptionFontSize: 28,
			cardLineGap: 18,
			cardLineHeight: 20,
			cardLineWidths: ["90%", "74%"],
			cardShadow: "0 36px 80px rgba(0, 0, 0, 0.24)",
			cardTitleFontSize: 54,
			cardWidth: 1220,
			chromeGapBottom: 0,
			closeSize: 58,
			contentPaddingX: 48,
			contentPaddingY: 40,
			footerPaddingBottom: 40,
			footerPaddingTop: 34,
			gridOpacity: 0,
			headerDescriptionMaxWidth: 860,
			headerDescriptionSize: 28,
			headerLabelSize: 0,
			headerTitleSize: 0,
			scenePaddingBottom: 0,
			scenePaddingTop: 0,
			scenePaddingX: COVER_PADDING,
			secondaryButtonPaddingX: 32,
			showChrome: false,
			showOgBackground: false,
			slotHeight: 560,
			slotJustifyContent: "center",
			slotPaddingTop: 0,
			slotWidth: 1320,
		};
	}

	return {
		actionGap: 16,
		buttonFontSize: 18,
		buttonHeight: 54,
		buttonPaddingX: 28,
		canvasBackgroundColor: BACKGROUND,
		cardDescriptionFontSize: 18,
		cardLineGap: 14,
		cardLineHeight: 14,
		cardLineWidths: ["88%", "72%"],
		cardShadow:
			"0 28px 72px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255, 255, 255, 0.03) inset",
		cardTitleFontSize: 28,
		cardWidth: 720,
		chromeGapBottom: 18,
		closeSize: 38,
		contentPaddingX: 40,
		contentPaddingY: 28,
		footerPaddingBottom: 28,
		footerPaddingTop: 24,
		gridOpacity: 1,
		headerDescriptionMaxWidth: 720,
		headerDescriptionSize: 24,
		headerLabelSize: 15,
		headerTitleSize: 76,
		scenePaddingBottom: 40,
		scenePaddingTop: 56,
		scenePaddingX: 48,
		secondaryButtonPaddingX: 24,
		showChrome: true,
		showOgBackground: true,
		slotHeight: 312,
		slotJustifyContent: "center",
		slotPaddingTop: 0,
		slotWidth: 760,
	};
}

function HeaderChrome(props: { config: ModalSceneConfig }) {
	return (
		<div
			data-testid="modal-scene-chrome"
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				textAlign: "center",
				marginBottom: 0,
			}}
		>
			<div
				style={{
					display: "flex",
					fontSize: props.config.headerLabelSize,
					fontWeight: 700,
					letterSpacing: "0.18em",
					textTransform: "uppercase",
					color: ACCENT,
					marginBottom: 18,
				}}
			>
				Content Management
			</div>
			<div
				style={{
					display: "flex",
					fontSize: props.config.headerTitleSize,
					lineHeight: 1,
					fontWeight: 800,
					letterSpacing: "-0.05em",
					marginBottom: 16,
				}}
			>
				Modal
			</div>
			<div
				style={{
					display: "flex",
					fontSize: props.config.headerDescriptionSize,
					lineHeight: 1.35,
					fontWeight: 400,
					color: MUTED_TEXT,
					maxWidth: props.config.headerDescriptionMaxWidth,
				}}
			>
				{OG_HELPER_TEXT}
			</div>
		</div>
	);
}

function PlaceholderLine(props: { height: number; width: string }) {
	return (
		<div
			style={{
				display: "flex",
				height: props.height,
				width: props.width,
				borderRadius: 999,
				backgroundColor: "rgba(255, 255, 255, 0.10)",
			}}
		/>
	);
}

function ModalForeground(props: { config: ModalSceneConfig }) {
	return (
		<div
			style={{
				display: "flex",
				width: props.config.cardWidth,
				flexDirection: "column",
				borderRadius: 28,
				border: `1px solid ${SURFACE_BORDER}`,
				backgroundColor: SURFACE,
				boxShadow: props.config.cardShadow,
				backdropFilter: "blur(12px)",
			}}
		>
			<div
				style={{
					display: "flex",
					paddingLeft: props.config.contentPaddingX,
					paddingRight: props.config.contentPaddingX,
					paddingTop: props.config.contentPaddingY,
					paddingBottom: 24,
				}}
			>
				<div
					style={{
						display: "flex",
						flex: 1,
						flexDirection: "column",
						gap: 12,
					}}
				>
					<div
						style={{
							display: "flex",
							fontSize: props.config.cardTitleFontSize,
							fontWeight: 700,
							letterSpacing: "-0.04em",
							color: "#ffffff",
						}}
					>
						Edit profile
					</div>
					<div
						style={{
							display: "flex",
							maxWidth: props.config.cardWidth - 220,
							fontSize: props.config.cardDescriptionFontSize,
							lineHeight: 1.45,
							fontWeight: 400,
							color: MUTED_TEXT,
						}}
					>
						{PROFILE_DESCRIPTION}
					</div>
				</div>

				<div
					style={{
						display: "flex",
						width: props.config.closeSize,
						height: props.config.closeSize,
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 999,
						border: "1px solid rgba(255, 255, 255, 0.12)",
						color: SOFT_TEXT,
						fontSize: props.config.closeSize * 0.58,
						lineHeight: 1,
					}}
				>
					×
				</div>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: props.config.cardLineGap,
					paddingLeft: props.config.contentPaddingX,
					paddingRight: props.config.contentPaddingX,
					paddingBottom: 30,
				}}
			>
				<PlaceholderLine
					height={props.config.cardLineHeight}
					width={props.config.cardLineWidths[0]}
				/>
				<PlaceholderLine
					height={props.config.cardLineHeight}
					width={props.config.cardLineWidths[1]}
				/>
			</div>

			<div
				style={{
					display: "flex",
					height: 1,
					backgroundColor: "rgba(255, 255, 255, 0.10)",
				}}
			/>

			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					paddingLeft: props.config.contentPaddingX,
					paddingRight: props.config.contentPaddingX,
					paddingTop: props.config.footerPaddingTop,
					paddingBottom: props.config.footerPaddingBottom,
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: props.config.actionGap,
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: props.config.buttonHeight,
							paddingLeft: props.config.secondaryButtonPaddingX,
							paddingRight: props.config.secondaryButtonPaddingX,
							borderRadius: 999,
							border: "1px solid rgba(255, 255, 255, 0.14)",
							color: MUTED_TEXT,
							fontSize: props.config.buttonFontSize,
							fontWeight: 500,
						}}
					>
						Cancel
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: props.config.buttonHeight,
							paddingLeft: props.config.buttonPaddingX,
							paddingRight: props.config.buttonPaddingX,
							borderRadius: 999,
							backgroundColor: ACCENT,
							color: "#15110a",
							fontSize: props.config.buttonFontSize,
							fontWeight: 700,
							boxShadow: "0 16px 34px rgba(215, 162, 65, 0.24)",
						}}
					>
						Save changes
					</div>
				</div>
			</div>
		</div>
	);
}

function OgBackground(props: {
	backgroundImageUrl?: string;
	config: ModalSceneConfig;
}) {
	return (
		<>
			<div
				style={{
					...fillLayerStyle,
					zIndex: 0,
					background:
						"radial-gradient(circle at 50% 58%, rgba(215, 162, 65, 0.22) 0%, rgba(215, 162, 65, 0.12) 18%, rgba(5, 5, 5, 0) 58%)",
				}}
			/>
			<div
				style={{
					...fillLayerStyle,
					zIndex: 1,
					background:
						"linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 24%, rgba(255, 255, 255, 0) 100%)",
				}}
			/>
			<div
				style={{
					...fillLayerStyle,
					zIndex: 2,
					background:
						"radial-gradient(circle at 50% 48%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.18) 56%, rgba(0, 0, 0, 0.48) 100%)",
				}}
			/>
			{props.backgroundImageUrl ? (
				<>
					{/* biome-ignore lint/performance/noImgElement: next/og rendering requires a plain img element */}
					<img
						src={props.backgroundImageUrl}
						alt=""
						style={{
							...fillLayerStyle,
							display: "block",
							width: "100%",
							height: "100%",
							objectFit: "cover",
							opacity: props.config.gridOpacity,
							zIndex: 3,
						}}
					/>
				</>
			) : null}
		</>
	);
}

export function ModalScene(props: ModalSceneProps) {
	const variant = props.variant || "og";
	const config = getModalSceneConfig(variant, props.coverBackgroundColor);

	return (
		<div
			data-testid="modal-scene-root"
			data-variant={variant}
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				position: "relative",
				overflow: "hidden",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: config.canvasBackgroundColor,
				fontFamily:
					'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
				color: "#ffffff",
				...props.style,
			}}
		>
			{config.showOgBackground ? (
				<OgBackground
					backgroundImageUrl={props.backgroundImageUrl}
					config={config}
				/>
			) : null}

			<div
				style={{
					position: "relative",
					zIndex: 4,
					display: "flex",
					width: "100%",
					height: "100%",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: config.showChrome ? "flex-start" : "center",
					paddingTop: config.scenePaddingTop,
					paddingBottom: config.scenePaddingBottom,
					paddingLeft: config.scenePaddingX,
					paddingRight: config.scenePaddingX,
				}}
			>
				{config.showChrome ? <HeaderChrome config={config} /> : null}
				<div
					data-testid="modal-scene-ui-slot"
					style={{
						display: "flex",
						width: config.slotWidth,
						overflow: "hidden",
						alignItems: "center",
						justifyContent: config.slotJustifyContent,
						paddingTop: config.slotPaddingTop,
						marginTop: config.chromeGapBottom,
					}}
				>
					<ModalForeground config={config} />
				</div>
			</div>
		</div>
	);
}

export function ModalOG(props: { style?: CSSProperties }) {
	return <ModalScene style={props.style} variant="og" />;
}

export function ModalCover(props: {
	coverBackgroundColor?: string;
	style?: CSSProperties;
}) {
	return (
		<ModalScene
			coverBackgroundColor={props.coverBackgroundColor}
			style={props.style}
			variant="cover"
		/>
	);
}
