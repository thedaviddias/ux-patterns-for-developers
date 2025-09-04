import { TRACKING_CLASSES } from '@app/_utils/tracking';
import bcd from '@mdn/browser-compat-data';
import type { FC } from 'react';
import { type SimpleIcon, siFirefox, siGooglechrome, siSafari } from 'simple-icons';

interface BrowserSupportProps {
  features: string[]; // e.g. ['html.elements.button', 'api.HTMLButtonElement']
}

export const SimpleIconComponent: FC<{ icon?: SimpleIcon; className?: string }> = ({
  icon,
  className,
}) => (
  <svg
    role="img"
    aria-label={icon?.title || 'Browser icon'}
    viewBox="0 0 26 26"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
  >
    <path d={icon?.path} />
  </svg>
);

export const BrowserSupport = ({ features }: BrowserSupportProps) => {
  const getCompatData = (path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], bcd)?.__compat?.support;
  };

  const formatVersion = (version: string | boolean | undefined) => {
    if (version === undefined || version === false) return 'No';
    if (version === true) return 'Yes';
    if (version.startsWith('≤')) return `Up to ${version.substring(1)}`;
    return `Since v${version}`;
  };

  const getBrowserIcon = (browser: string) => {
    const iconProps = 'w-6 h-6';

    switch (browser) {
      case 'chrome':
        return <SimpleIconComponent icon={siGooglechrome} className={iconProps} />;
      case 'firefox':
        return <SimpleIconComponent icon={siFirefox} className={iconProps} />;
      case 'safari':
        return <SimpleIconComponent icon={siSafari} className={iconProps} />;
      default:
        return null;
    }
  };

  const getCaniUseUrl = (feature: string) => {
    const slug = feature.split('.').pop()?.toLowerCase();

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
              {['chrome', 'firefox', 'safari'].map((browser) => (
                <div
                  key={browser}
                  className="text-center p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="text-lg mb-1 flex justify-center">{getBrowserIcon(browser)}</div>
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
