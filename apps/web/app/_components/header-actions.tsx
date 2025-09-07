import { HeaderIcons } from "./header-icons";
import { StarsWrapper } from "./stars-wrapper";

export const HeaderActions = () => {
	return (
		<div className="flex items-center gap-4">
			<StarsWrapper variant="small" />
			<HeaderIcons />
		</div>
	);
};
