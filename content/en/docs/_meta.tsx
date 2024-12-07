import type { FC, ReactNode } from 'react'

export const Separator: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex items-center gap-2">
      {children}
    </div>
  )
}

export default {
  _: {
    title: <Separator>Docs</Separator>,
    type: 'separator'
  },
  'getting-started': '',
}
