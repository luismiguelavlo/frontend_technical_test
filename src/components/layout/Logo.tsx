/** App mark + name. */
export function Logo({ name }: { name: string }) {
  return (
    <a href="#/" className="flex items-center gap-space-sm">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <circle cx="13" cy="12.5" r="3.5" fill="#fff" />
        <path d="M6.5 23c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6v1h-13z" fill="#fff" />
        <circle cx="21.5" cy="13.5" r="2.75" fill="#fff" fillOpacity=".65" />
        <path d="M21 18.2c2.9.2 4.8 2.2 4.8 5v.8h-4.6v-1c0-1.9-.7-3.6-1.9-4.8.5 0 1.1 0 1.7 0z" fill="#fff" fillOpacity=".65" />
      </svg>
      <span className="whitespace-nowrap text-title-md text-on-surface">{name}</span>
    </a>
  )
}
