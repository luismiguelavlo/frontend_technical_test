import { Icon, type IconName } from './Icon.tsx'

const TONES = {
  primary: 'bg-primary-fixed text-primary',
  neutral: 'bg-surface-container text-on-surface',
  error: 'bg-error-container text-error',
}

const SIZES = {
  sm: { box: 'size-8', icon: 'size-[18px]' },
  md: { box: 'size-10', icon: 'size-5' },
  lg: { box: 'size-12', icon: 'size-6' },
}

interface IconCircleProps {
  icon: IconName
  tone?: keyof typeof TONES
  size?: keyof typeof SIZES
  /** `circle` (states, confirm) or `square` (dialog headers). */
  shape?: 'circle' | 'square'
}

/** Icon inside a tinted circle/rounded square. */
export function IconCircle({ icon, tone = 'primary', size = 'md', shape = 'circle' }: IconCircleProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center ${shape === 'circle' ? 'rounded-full' : 'rounded-xl shadow-sm'} ${
        SIZES[size].box
      } ${TONES[tone]}`}
    >
      <Icon name={icon} className={SIZES[size].icon} />
    </div>
  )
}
