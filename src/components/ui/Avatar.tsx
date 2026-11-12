const SIZES = {
  sm: 'size-8 text-label-sm',
  lg: 'size-20 text-headline-lg sm:size-24',
}

interface AvatarProps {
  /** Text shown in the circle (usually 2 initials). */
  initials: string
  /** Background/text color classes. */
  className?: string
  size?: keyof typeof SIZES
}

export function Avatar({ initials, className = 'bg-primary text-on-primary', size = 'sm' }: AvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${SIZES[size]} ${className}`}
    >
      {initials.toUpperCase()}
    </div>
  )
}
