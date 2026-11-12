import type { ReactNode } from 'react'

/** 2/3 + 1/3 layout from `lg`; stacked below. Shared by the page and its skeleton. */
export function UserDetailGrid({ main, aside }: { main: ReactNode; aside: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
      <div className="flex flex-col gap-space-lg lg:col-span-8">{main}</div>
      <div className="flex flex-col gap-space-lg lg:col-span-4">{aside}</div>
    </div>
  )
}
