import { Footer as NextraFooter } from 'nextra-theme-docs';

import { FOOTER_MENU_LINKS } from '../_constants/footer';
import { getDictionary } from '../_dictionaries/get-dictionary';
import { LinkCustom } from './link-custom';
import { SOCIAL_LINKS } from './social';

type FooterLinksProps = {
  title: string;
  links: Array<{
    label: string;
    path?: string;
    shortlink?: string;
  }>;
};

const FooterLinks = ({ title, links }: FooterLinksProps) => {
  return (
    <div>
      <h3 className="small-title">{title}</h3>
      <ul className="mt-3 space-y-1">
        {links.map(({ label, path, shortlink }) => (
          <li key={label}>
            <LinkCustom
              href={path || shortlink || '#'}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors text-sm"
            >
              {label}
            </LinkCustom>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FooterMenuLinks = ({ lang }: { lang: string }) => (
  <FooterLinks title="General" links={FOOTER_MENU_LINKS(lang)} />
);

const FooterSocialLinks = () => <FooterLinks title="Support" links={SOCIAL_LINKS} />;

// Client component for footer content
const FooterContent = ({ dictionary, lang }: { dictionary: any; lang: string }) => {
  return (
    <NextraFooter className="mt-auto sm:pt-8 w-full">
      <div className="main-footer transform w-full">
        <h2 className="sr-only">Footer</h2>
        <div className="mx-auto max-w-5xl px-2 py-12 sm:px-6 lg:px-8 lg:py-7">
          <div className="flex flex-col-reverse sm:flex-row print:hidden">
            <div className="w-full flex-grow text-left sm:mb-0 sm:w-1/2 md:pr-24 lg:w-[20%]">
              <span className="mb-5 block text-xl font-bold">{dictionary.name}</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">{dictionary.description}</p>
              <div className="flex space-x-6"></div>
            </div>

            <div className="flex w-full !max-w-full flex-shrink-0 flex-grow justify-between text-gray-500 sm:w-1/2 lg:w-[30%] dark:text-gray-400">
              <FooterMenuLinks lang={lang} />
              <FooterSocialLinks />
            </div>
          </div>
          <div className="mt-8 flex items-center flex-col border-t border-gray-200 pt-3 dark:border-gray-400 text-sm">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} UX Patterns for Devs</p>
            <p className="text-gray-500">
              Made with ❤️ by{' '}
              <a
                href="https://ddias.link/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline dark:text-gray-300"
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
