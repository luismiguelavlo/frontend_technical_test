import type { ReactNode } from 'react'
import { Card } from '../../components/ui/Card.tsx'
import { CopyButton } from '../../components/ui/CopyButton.tsx'
import { Icon, type IconName } from '../../components/ui/Icon.tsx'
import { Skeleton } from '../../components/ui/Skeleton.tsx'
import { fullName, type User } from '../../types/user.ts'
import { formatDateTime, formatRelative, parseApiDate } from '../../utils/dates.ts'
import { GenderBadge } from './GenderBadge.tsx'
import { UserAvatar } from './UserAvatar.tsx'

function MetaItem({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1">
      <Icon name={icon} className="size-4 text-outline" />
      {children}
    </span>
  )
}

function Separator() {
  return (
    <span aria-hidden="true" className="hidden text-outline-variant sm:inline">
      •
    </span>
  )
}

interface UserProfileHeaderProps {
  user: User
  onEmailCopied: () => void
  onCopyError: () => void
}

/** Hero card: avatar, name, gender, id, contact shortcuts and registration date. */
export function UserProfileHeader({ user, onEmailCopied, onCopyError }: UserProfileHeaderProps) {
  const createdAt = parseApiDate(user.created_at)

  return (
    <Card className="relative p-space-lg">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative flex flex-col items-start gap-space-lg sm:flex-row sm:items-center">
        <UserAvatar user={user} size="lg" />

        <div className="flex min-w-0 flex-col gap-space-xs">
          <div className="flex flex-wrap items-center gap-space-sm">
            <h1 className="text-headline-lg tracking-tight text-on-surface">{fullName(user)}</h1>
            <GenderBadge gender={user.gender} />
          </div>

          <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 pt-1 text-body-sm text-on-surface-variant">
            <span className="font-mono font-semibold text-primary">#{user.id}</span>
            <Separator />
            <MetaItem icon="mail">
              <CopyButton value={user.email} label={`Copiar email ${user.email}`} onCopied={onEmailCopied} onError={onCopyError} />
            </MetaItem>
            {user.telephone && (
              <>
                <Separator />
                <MetaItem icon="call">
                  <a href={`tel:${user.telephone.replace(/[^\d+]/g, '')}`} className="transition-colors hover:text-primary">
                    {user.telephone}
                  </a>
                </MetaItem>
              </>
            )}
            <Separator />
            <MetaItem icon="badge">{user.age} años</MetaItem>
          </div>

          {createdAt && (
            <div className="pt-1 text-body-sm text-on-surface-variant">
              <MetaItem icon="calendar">
                <span>
                  Registrado el {formatDateTime(createdAt)}{' '}
                  <span className="text-outline">({formatRelative(createdAt)})</span>
                </span>
              </MetaItem>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

/** Placeholder with the same layout as <UserProfileHeader>. */
export function UserProfileHeaderSkeleton() {
  return (
    <Card aria-hidden="true" className="p-space-lg">
      <div className="flex flex-col items-start gap-space-lg sm:flex-row sm:items-center">
        <Skeleton className="size-20 rounded-full sm:size-24" />
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-5 w-20 rounded-full" tone="muted" />
          </div>
          <Skeleton className="h-3.5 w-80 max-w-full" tone="muted" />
          <Skeleton className="h-3.5 w-64 max-w-full" tone="muted" />
        </div>
      </div>
    </Card>
  )
}
