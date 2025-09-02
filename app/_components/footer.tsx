import { FOOTER_GENERAL_LINKS, FOOTER_RESOURCES_LINKS } from '@app/_constants/footer';
import { getDictionary } from '@app/_dictionaries/get-dictionary';
import { Footer as NextraFooter } from 'nextra-theme-docs';
import { FooterCopyright } from './footer-copyright';
import { FooterLink } from './footer-link';
import { SOCIAL_LINKS } from './social';

type FooterLinksProps = {
  title: string;
  links: Array<{
    label: string;
    path?: string;
    shortlink?: string;
    rel?: string;
  }>;
  linkType?: 'general' | 'resource' | 'social';
};

const FooterLinks = ({ title, links, linkType = 'general' }: FooterLinksProps) => {
  return (
    <div>
      <h3 className="small-title">{title}</h3>
      <ul className="mt-3 space-y-1">
        {links.map(({ label, path, shortlink, rel }) => (
          <li key={path || shortlink || label}>
            <FooterLink
              label={label}
              path={path}
              shortlink={shortlink}
              rel={rel}
              linkType={linkType}
            />
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
          <FooterCopyright />
        </div>
      </div>
    </NextraFooter>
  );
};

export const Footer = async ({ lang }: { lang: string }) => {
  const dictionary = await getDictionary(lang);
  return <FooterContent dictionary={dictionary} lang={lang} />;
};
