const YEAR = new Date().getFullYear()
const LINKS = ['Privacidad', 'Términos de Servicio', 'Soporte Técnico']

export function AppFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest py-space-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-space-xs px-gutter sm:flex-row">
        <p className="text-body-sm text-on-surface-variant">
          © {YEAR} Gestión de Usuarios. Plataforma Corporativa Segura.
        </p>
        <div className="flex items-center gap-space-md text-body-sm text-on-surface-variant">
          {LINKS.map((label) => (
            <a key={label} href="#" className="transition-colors hover:text-on-surface">
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
