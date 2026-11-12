import type { ReactNode } from 'react'
import { Card, CardHeader } from '../../components/ui/Card.tsx'
import { Skeleton } from '../../components/ui/Skeleton.tsx'
import type { User } from '../../types/user.ts'
import { formatDateTime, formatRelative, parseApiDate } from '../../utils/dates.ts'

const TITLE = 'Metadatos del registro'

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 rounded bg-surface-container-low p-2">
      <dt className="text-[10px] tracking-wider text-outline uppercase">{label}</dt>
      <dd className="text-label-sm text-on-surface">{children}</dd>
    </div>
  )
}

function Timestamp({ value }: { value: string | null }) {
  const date = parseApiDate(value)
  if (!date) return <span className="text-outline">Sin dato</span>

  return (
    <time dateTime={date.toISOString()} title={`${value} UTC`}>
      {formatDateTime(date)} <span className="font-normal text-on-surface-variant">· {formatRelative(date)}</span>
    </time>
  )
}

/** Technical data returned by the API: id, optimistic-lock version and timestamps. */
export function UserRecordMeta({ user }: { user: User }) {
  return (
    <Card aria-labelledby="record-meta-title" className="gap-space-md p-space-lg">
      <CardHeader titleId="record-meta-title" icon="info" title={TITLE} />
      <dl className="flex flex-col gap-space-xs">
        <MetaRow label="ID">
          <span className="font-mono">#{user.id}</span>
        </MetaRow>
        <MetaRow label="Versión (ETag)">
          <span className="font-mono">"{user.version}"</span>
        </MetaRow>
        <MetaRow label="Creado">
          <Timestamp value={user.created_at} />
        </MetaRow>
        <MetaRow label="Última modificación">
          <Timestamp value={user.updated_at} />
        </MetaRow>
        <MetaRow label="Recurso API">
          <span className="font-mono break-all">GET /users/{user.id}</span>
        </MetaRow>
      </dl>
    </Card>
  )
}

export function UserRecordMetaSkeleton() {
  return (
    <Card aria-hidden="true" className="gap-space-md p-space-lg">
      <CardHeader icon="info" title={TITLE} />
      <div className="flex flex-col gap-space-xs">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-12 w-full" tone="muted" />
        ))}
      </div>
    </Card>
  )
}
