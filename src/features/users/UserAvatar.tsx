import { Avatar } from '../../components/ui/Avatar.tsx'
import type { User } from '../../types/user.ts'

/** Stable color per user id. */
const PALETTE = [
  'bg-surface-container-high text-primary',
  'bg-secondary-fixed/40 text-secondary',
  'bg-tertiary-fixed/60 text-tertiary',
  'bg-primary-fixed text-primary',
  'bg-secondary-fixed-dim/40 text-secondary',
  'bg-surface-dim text-on-surface',
  'bg-primary-fixed-dim/50 text-primary',
  'bg-tertiary-fixed-dim/40 text-tertiary',
]

interface UserAvatarProps {
  user: User
  size?: 'sm' | 'lg'
}

export function UserAvatar({ user, size }: UserAvatarProps) {
  return (
    <Avatar
      size={size}
      initials={`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}
      className={PALETTE[user.id % PALETTE.length]}
    />
  )
}
