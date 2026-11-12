import type { ApiStatus } from '../../types/api.ts'
import { ApiStatusBadge } from './ApiStatusBadge.tsx'
import { Logo } from './Logo.tsx'
import { MainNav, type NavItem } from './MainNav.tsx'

// Only the USER module exists in the test scope.
const NAV_ITEMS: NavItem[] = [{ label: 'Usuarios', href: '#/', active: true }]

export function AppHeader({ apiStatus }: { apiStatus: ApiStatus }) {
  return (
    <header className="fixed left-0 top-0 z-30 w-full bg-surface-container-lowest/95 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-space-md px-gutter">
        <div className="flex items-center gap-space-lg">
          <Logo name="Gestión de Usuarios" />
          <MainNav items={NAV_ITEMS} />
        </div>
        <ApiStatusBadge status={apiStatus} />
      </div>
    </header>
  )
}
