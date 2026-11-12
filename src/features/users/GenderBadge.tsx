import { Badge } from '../../components/ui/Badge.tsx'
import { GENDER_LABELS, type Gender } from '../../types/user.ts'

const STYLES: Record<Gender, { className: string; dot: string }> = {
  female: { className: 'bg-primary-fixed/40 text-primary', dot: 'bg-primary' },
  male: { className: 'bg-surface-container-high text-on-surface', dot: 'bg-outline' },
  other: { className: 'bg-surface-container text-on-surface-variant', dot: 'bg-outline-variant' },
}

export function GenderBadge({ gender }: { gender: Gender }) {
  const { className, dot } = STYLES[gender]

  return (
    <Badge className={className} dotClassName={dot}>
      {GENDER_LABELS[gender]}
    </Badge>
  )
}
