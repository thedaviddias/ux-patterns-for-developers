import { Footer as NextraFooter } from 'nextra-theme-docs';

import { FOOTER_GENERAL_LINKS, FOOTER_RESOURCES_LINKS } from '../_constants/footer';
import { getDictionary } from '../_dictionaries/get-dictionary';
import { TRACKING_CLASSES } from '../_utils/tracking';
import { LinkCustom } from './link-custom';
import { SOCIAL_LINKS } from './social';

type FooterLinksProps = {
  title: string;
  links: Array<{
    label: string;
    path?: string;
    shortlink?: string;
  }>;
  linkType?: 'general' | 'resource' | 'social';
};

const FooterLinks = ({ title, links, linkType = 'general' }: FooterLinksProps) => {
  return (
    <div>
      <h3 className="small-title">{title}</h3>
      <ul className="mt-3 space-y-1">
        {links.map(({ label, path, shortlink }) => (
          <li key={label}>
            <LinkCustom
              href={path || shortlink || '#'}
              className={`text-gray-500 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors text-sm ${
                linkType === 'social'
                  ? TRACKING_CLASSES.FOOTER_SOCIAL_CLICK
                  : TRACKING_CLASSES.FOOTER_LINK_CLICK
              }`}
              data-link-type={linkType}
              data-link-label={label}
            >
              {label}
            </LinkCustom>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FooterGeneralLinks = () => (
  <FooterLinks title="General" links={FOOTER_GENERAL_LINKS} linkType="general" />
);

const FooterResourcesLinks = () => (
  <FooterLinks title="Resources" links={FOOTER_RESOURCES_LINKS} linkType="resource" />
);

const FooterSocialLinks = () => (
  <FooterLinks title="Support" links={SOCIAL_LINKS} linkType="social" />
);

// Client component for footer content
const FooterContent = ({ dictionary, lang }: { dictionary: any; lang: string }) => {
  return (
    <NextraFooter className="mt-auto w-full">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="w-full">
          <h2 className="sr-only">Footer</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <span className="mb-3 block text-xl font-bold">{dictionary.name}</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">{dictionary.description}</p>
            </div>

            {/* General Links */}
            <div className="md:col-span-1">
              <FooterGeneralLinks />
            </div>

            {/* Resources Links */}
            <div className="md:col-span-1">
              <FooterResourcesLinks />
            </div>

            {/* Support/Social Links */}
            <div className="md:col-span-1">
              <FooterSocialLinks />
            </div>
          </div>
          {/* Copyright Section */}
          <div className="pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} UX Patterns for Devs</p>
            <p className="mt-2">
              Made with ❤️ by{' '}
              <a
                href="https://thedaviddias.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition-colors ${TRACKING_CLASSES.FOOTER_LINK_CLICK}`}
                data-link-type="author"
                data-link-label="David Dias"
              >
                David Dias
              </a>{' '}
              for the Open-Source Community.
            </p>
          </div>
        </div>
      </div>
    </NextraFooter>
  );
};

export const Footer = async ({ lang }: { lang: string }) => {
  const dictionary = await getDictionary(lang);
  return <FooterContent dictionary={dictionary} lang={lang} />;
};
