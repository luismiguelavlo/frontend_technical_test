import type { ReactNode } from 'react'

/** Responsive form layout: 1 column on mobile, 2 from `md`. */
export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-x-space-lg gap-y-space-md md:grid-cols-2">{children}</div>
}
