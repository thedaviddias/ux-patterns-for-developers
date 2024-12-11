import type { FC, ReactNode } from 'react'

export const Separator: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex items-center gap-2">
      {children}
    </div>
  )
}

export default {
  'getting-started': '',
  _: {
    title: <Separator>Categories</Separator>,
    type: 'separator'
  },
  "navigation": "Layout & Navigation",
  "forms": "Inputs & Forms",
}
