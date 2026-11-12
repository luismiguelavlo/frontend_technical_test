import type { ReactNode } from 'react'
import { Icon } from './Icon.tsx'

interface AlertProps {
  title?: string
  children: ReactNode
}

/** Error banner (title + detail). */
export function Alert({ title, children }: AlertProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-space-sm rounded-xl border border-error/20 bg-error-container/70 p-space-md text-on-error-container"
    >
      <Icon name="error" className="mt-0.5 size-5 text-error" />
      <div className="flex-1 space-y-0.5">
        {title && <p className="text-label-sm font-bold text-error">{title}</p>}
        <div className="text-body-sm">{children}</div>
      </div>
    </div>
  )
}
