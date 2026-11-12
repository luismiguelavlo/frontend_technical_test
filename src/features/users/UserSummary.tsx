import { fullName, type User } from '../../types/user.ts'
import { GenderBadge } from './GenderBadge.tsx'
import { UserAvatar } from './UserAvatar.tsx'

/** Compact user card: avatar, name, email and gender. */
export function UserSummary({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-space-md rounded-xl border border-surface-container-high bg-surface-container-low p-space-md">
      <UserAvatar user={user} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-label-md font-semibold text-on-surface">{fullName(user)}</p>
        <p className="truncate text-body-sm text-on-surface-variant">{user.email}</p>
      </div>
      <GenderBadge gender={user.gender} />
    </div>
  )
}
