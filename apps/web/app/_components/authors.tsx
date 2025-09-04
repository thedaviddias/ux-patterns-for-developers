import { getDictionary } from '@app/_dictionaries/get-dictionary';
import type { Locale } from '@app/_dictionaries/i18n-config';
import type { FC } from 'react';
import { LinkCustom } from './link-custom';

type TopContentProps = {
  title: string;
  date: string;
  authors: {
    name: string;
    link: string;
  }[];
  lang: Locale;
};

export const TopContent: FC<TopContentProps> = async ({ title, date, authors, lang }) => {
  const dictionary = await getDictionary(lang);
  const dateObj = new Date(date);

  return (
    <>
      <h1>{title}</h1>
      <div className="mt-8 mb-16 text-sm text-gray-400">
        <time dateTime={dateObj.toISOString()}>
          {dateObj.toLocaleDateString(lang, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>{' '}
        {dictionary.by}{' '}
        {authors.map((author) => (
          <span key={author.name} className="not-last:after:content-[',_']">
            <LinkCustom href={author.link} className="text-gray-800 dark:text-gray-100">
              {author.name}
            </LinkCustom>
          </span>
        ))}
      </div>
    </>
  );
};
