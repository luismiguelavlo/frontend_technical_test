import { SearchInput } from '../../components/ui/SearchInput.tsx'
import { Select } from '../../components/ui/Select.tsx'
import { Skeleton } from '../../components/ui/Skeleton.tsx'
import { Toolbar } from '../../components/ui/Toolbar.tsx'
import { GENDERS, GENDER_LABELS } from '../../types/user.ts'
import type { GenderFilter } from '../../utils/userFilters.ts'

/** Placeholder with the same layout as <UserFilters> while data loads. */
export function UserFiltersSkeleton() {
  return (
    <Toolbar ariaHidden end={<Skeleton className="h-9 w-40" tone="muted" />}>
      <Skeleton className="h-9 w-full" tone="muted" />
    </Toolbar>
  )
}

interface UserFiltersProps {
  search: string
  gender: GenderFilter
  onSearchChange: (value: string) => void
  onGenderChange: (value: GenderFilter) => void
}

export function UserFilters({ search, gender, onSearchChange, onGenderChange }: UserFiltersProps) {
  return (
    <Toolbar
      end={
        <Select
          aria-label="Filtrar por género"
          value={gender}
          onChange={(e) => onGenderChange(e.target.value as GenderFilter)}
        >
          <option value="all">Género: Todos</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              Género: {GENDER_LABELS[g]}
            </option>
          ))}
        </Select>
      }
    >
      <SearchInput
        value={search}
        onValueChange={onSearchChange}
        label="Buscar usuarios por nombre o email"
        placeholder="Buscar por nombre o email..."
      />
    </Toolbar>
  )
}
