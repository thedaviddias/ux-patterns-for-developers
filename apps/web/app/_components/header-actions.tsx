import { HeaderIcons } from "./header-icons";
import { StarsWrapper } from "./stars-wrapper";

export const HeaderActions = () => {
	return (
		<div className="flex items-center gap-4">
			<StarsWrapper variant="small" />
			<div className="h-5 w-px bg-gray-300 dark:bg-gray-600" />
			<HeaderIcons />
		</div>
	);
};
