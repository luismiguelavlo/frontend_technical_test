import type { ReactNode } from 'react'
import { AppFooter } from './AppFooter.tsx'
import type { ListStatus } from '../../hooks/useUsers.ts'
import { AppHeader } from './AppHeader.tsx'

export function AppLayout({ apiStatus, children }: { apiStatus: ListStatus; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader apiStatus={apiStatus} />
      <main className="w-full flex-1 pt-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-space-lg px-gutter py-space-lg">{children}</div>
      </main>
      <AppFooter />
    </div>
  )
}
