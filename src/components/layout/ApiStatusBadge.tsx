import type { ApiStatus } from '../../types/api.ts'
import { Badge } from '../ui/Badge.tsx'

const STATUS: Record<ApiStatus, { label: string; className: string; dot: string }> = {
  loading: { label: 'Conectando API…', className: 'text-on-surface-variant', dot: 'bg-outline animate-pulse' },
  success: { label: 'API conectada', className: 'text-secondary', dot: 'bg-secondary' },
  error: { label: 'API sin conexión', className: 'text-error', dot: 'bg-error' },
}

export function ApiStatusBadge({ status }: { status: ApiStatus }) {
  const { label, className, dot } = STATUS[status]

  return (
    <Badge
      role="status"
      className={`hidden bg-surface-container-low sm:inline-flex ${className}`}
      dotClassName={dot}
    >
      {label}
    </Badge>
  )
}
