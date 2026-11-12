import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  /** Buttons shown on the right (below on small screens). */
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-center">
      <div className="space-y-1">
        <h1 className="text-headline-xl text-on-surface">{title}</h1>
        {description && <p className="max-w-2xl text-body-md text-on-surface-variant">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-space-sm">{actions}</div>}
    </div>
  )
}
