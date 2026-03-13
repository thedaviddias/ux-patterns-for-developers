import { type CalculateMetadataFunction, Composition, Folder } from "remotion";
import { NpxSkillsLaunch } from "./compositions/NpxSkillsLaunch";
import {
	DEFAULT_PROPS,
	getVideoDimensions,
	type NpxSkillsLaunchProps,
	TOTAL_DURATION_IN_FRAMES,
} from "./data/video-config";

const calculateMetadata: CalculateMetadataFunction<NpxSkillsLaunchProps> = ({
	props,
}) => {
	const { width, height } = getVideoDimensions(props.format);

	return {
		width,
		height,
		durationInFrames: TOTAL_DURATION_IN_FRAMES,
		defaultOutName: `npx-skills-${props.format}.mp4`,
	};
};

export const RemotionRoot = () => {
	return (
		<Folder name="Launch">
			<Composition
				id="NpxSkillsLaunch"
				component={NpxSkillsLaunch}
				durationInFrames={TOTAL_DURATION_IN_FRAMES}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={DEFAULT_PROPS}
				calculateMetadata={calculateMetadata}
			/>
		</Folder>
	);
};
