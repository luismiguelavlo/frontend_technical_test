import type { ReactNode } from 'react'

interface ToolbarProps {
  /** Main area (e.g. search), grows to fill the row. */
  children: ReactNode
  /** Right-aligned controls (e.g. filters). */
  end?: ReactNode
  /** Hide from assistive tech (skeleton placeholders). */
  ariaHidden?: boolean
}

/** Filter/search bar on top of a list card. Stacks on small screens. */
export function Toolbar({ children, end, ariaHidden }: ToolbarProps) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex flex-col justify-between gap-space-sm p-space-md md:flex-row md:items-center"
    >
      <div className="w-full max-w-xl flex-1">{children}</div>
      {end && <div className="flex items-center gap-space-sm self-end md:self-auto">{end}</div>}
    </div>
  )
}
