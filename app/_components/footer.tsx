import {
  Footer as NextraFooter,
} from 'nextra-theme-docs';

import { FOOTER_MENU_LINKS } from '../_constants/footer';
import { getDictionary } from '../_dictionaries/get-dictionary';
import { LinkCustom } from './link-custom';
import { SOCIAL_LINKS } from './social';

const FooterMenuLinks = ({ lang }: { lang: string }) => {
  return (
    <div>
      <h3 className="small-title">General</h3>
      <ul className="mt-3 space-y-1">
        {FOOTER_MENU_LINKS(lang).map(({ path, label }) => (
          <li key={label}>
            <LinkCustom href={path} className="dark:!text-white">
              {label}
            </LinkCustom>
          </li>
        ))}
      </ul>
    </div>
  )
}

const FooterSocialLinks = () => {
  return (
    <div>
      <h3 className="small-title">Social</h3>
      <ul className="mt-3 space-y-1">
        {SOCIAL_LINKS.map(({ label, shortlink }) => (
          <li key={label}>
            <LinkCustom href={shortlink} className="dark:!text-white">
              {label}
            </LinkCustom>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const Footer = async ({ lang }: { lang: string }) => {
  const dictionary = await getDictionary(lang)

  return (
    <NextraFooter className="mt-auto sm:pt-8 w-full">
      <div
        className="main-footer transform w-full"
        aria-labelledby="footer-heading"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-5xl px-2 py-12 sm:px-6 lg:px-8 lg:py-7">
          <div className="flex flex-col-reverse sm:flex-row print:hidden">
            <div className="w-full flex-grow text-left sm:mb-0 sm:w-1/2 md:pr-24 lg:w-[40%]">
              <span className="mb-5 block text-xl font-bold">{dictionary.name}</span>
              <p
                className="text-sm text-gray-500 dark:text-gray-400">
                {dictionary.description}
              </p>
              <div className="flex space-x-6"></div>
            </div>

            <div className="flex w-full !max-w-full flex-shrink-0 flex-grow justify-between text-gray-500 sm:w-1/2 lg:w-[40%] dark:text-gray-400">
              <FooterMenuLinks lang={lang} />
              <FooterSocialLinks />
            </div>
          </div>
          <div className="mt-8 flex items-start flex-col border-t border-gray-200 pt-3 dark:border-gray-400">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} UX Patterns for Devs
            </p>
            <p className="text-gray-500">
              Made with ❤️ by <a href="https://thedaviddias.com" target="_blank" rel="noopener noreferrer" className="font-bold underline">David Dias</a> for the Open-Source Community.
            </p>
          </div>
        </div>
      </div>
    </NextraFooter >
  )
}