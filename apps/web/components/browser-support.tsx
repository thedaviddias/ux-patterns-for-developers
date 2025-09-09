import {
	SiFirefox,
	SiGooglechrome,
	SiSafari,
} from "@icons-pack/react-simple-icons";
import { use } from "react";
import { TRACKING_CLASSES } from "@/utils/tracking";

interface BrowserSupportProps {
	features: string[]; // e.g. ['html.elements.button', 'api.HTMLButtonElement']
}

// Cache for the browser compat data promise
const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(
	key: string,
	setPromise: () => Promise<T>,
): Promise<T> {
	const cached = cache.get(key);
	if (cached) return cached as Promise<T>;

	const promise = setPromise();
	cache.set(key, promise);
	return promise;
}

export const BrowserSupport = ({ features }: BrowserSupportProps) => {
	// Dynamically import the browser compat data
	const { default: bcd } = use(
		cachePromise(
			"browser-compat-data",
			() => import("@mdn/browser-compat-data"),
		),
	);

	const getCompatData = (path: string) => {
		return path.split(".").reduce((obj: any, key) => obj?.[key], bcd)?.__compat
			?.support;
	};

	const formatVersion = (version: string | boolean | undefined) => {
		if (version === undefined || version === false) return "No";
		if (version === true) return "Yes";
		if (version.startsWith("≤")) return `Up to ${version.substring(1)}`;
		return `Since v${version}`;
	};

	const getBrowserIcon = (browser: string) => {
		const iconProps = "w-6 h-6";

		switch (browser) {
			case "chrome":
				return <SiGooglechrome className={iconProps} />;
			case "firefox":
				return <SiFirefox className={iconProps} />;
			case "safari":
				return <SiSafari className={iconProps} />;
			default:
				return null;
		}
	};

	const getCaniUseUrl = (feature: string) => {
		const slug = feature.split(".").pop()?.toLowerCase();

		return `https://caniuse.com/?search=${slug}`;
	};

	return (
		<div>
			{features.map((feature) => {
				const compatData = getCompatData(feature);

				return (
					<div key={feature} className="mb-6 mt-4">
						<h3 className="text-sm font-medium mb-2">{feature}</h3>
						<div className="grid grid-cols-3 gap-4">
							{["chrome", "firefox", "safari"].map((browser) => (
								<div
									key={browser}
									className="text-center p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
								>
									<div className="text-lg mb-1 flex justify-center">
										{getBrowserIcon(browser)}
									</div>
									<div className="text-xs text-gray-500 x.dark:text-gray-400 capitalize mb-1">
										{browser}
									</div>
									<div className="text-sm font-medium">
										{formatVersion(compatData?.[browser]?.version_added)}
									</div>
								</div>
							))}
						</div>
						<div className="mt-2 text-xs text-gray-500">
							<a
								href={getCaniUseUrl(feature)}
								target="_blank"
								rel="noopener noreferrer"
								className={`hover:underline ${TRACKING_CLASSES.CANIUSE_LINK_CLICK}`}
								data-feature={feature}
							>
								View on CanIUse
							</a>
						</div>
					</div>
				);
			})}
		</div>
	);
};
