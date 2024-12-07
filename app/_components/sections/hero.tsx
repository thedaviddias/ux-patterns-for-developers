import type { FC } from 'react'
import type { Locale } from '../../_dictionaries/i18n-config'

export const Hero: FC<{
  lang: Locale
  title: string
  description: string
}> = async ({ title, description }) => {

  return (
    <div className="mx-auto mb-10 w-[880px] max-w-full px-4 text-center">
      <p className="mb-2 text-lg text-gray-500 md:text-2xl">{title}</p>
      <p className="md:text-lg">{description}</p>
    </div>
  )
}
