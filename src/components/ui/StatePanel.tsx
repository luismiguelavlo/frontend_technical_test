import type { ReactNode } from 'react'
import type { IconName } from './Icon.tsx'
import { IconCircle } from './IconCircle.tsx'

interface StatePanelProps {
  icon: IconName
  tone?: 'primary' | 'error'
  title: string
  description?: string
  action?: ReactNode
}

/** Generic empty / error state block. */
export function StatePanel({ icon, tone = 'primary', title, description, action }: StatePanelProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className="flex flex-col items-center gap-space-sm px-space-md py-16 text-center"
    >
      <div className="mb-space-xs">
        <IconCircle icon={icon} tone={tone} size="lg" />
      </div>
      <h3 className="text-title-md text-on-surface">{title}</h3>
      {description && <p className="max-w-sm text-body-md text-on-surface-variant">{description}</p>}
      {action && <div className="mt-space-sm">{action}</div>}
    </div>
  )
}
