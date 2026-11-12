export const GENDERS = ['female', 'male', 'other'] as const

export type Gender = (typeof GENDERS)[number]

export const GENDER_LABELS: Record<Gender, string> = {
  female: 'Femenino',
  male: 'Masculino',
  other: 'Otro',
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  gender: Gender
  telephone: string | null
  age: number
  /** Optimistic-lock version (also sent as ETag); PUT must send it back in If-Match. */
  version: number
  /** UTC timestamps set by the API (`Y-m-d H:i:s`); null on legacy rows. */
  created_at: string | null
  updated_at: string | null
}

/** Body accepted by POST /users and PUT /users/{id}. */
export type UserInput = Omit<User, 'id' | 'version' | 'created_at' | 'updated_at'>

/** Field name => message, as returned by the API on 422. */
export type FieldErrors = Partial<Record<keyof UserInput, string>>

export function fullName(user: Pick<User, 'first_name' | 'last_name'>): string {
  return `${user.first_name} ${user.last_name}`
}

/** Columns GET /users can sort by (backend UserListQuery::SORTABLE). */
export const SORT_KEYS = ['id', 'first_name', 'last_name', 'email', 'age'] as const

export type SortKey = (typeof SORT_KEYS)[number]

export type SortDir = 'asc' | 'desc'

export type GenderFilter = Gender | 'all'

/** Query of the users list (search, filter, sort, page size); the cursor is handled by useUsers. */
export interface UserListParams {
  q: string
  gender: GenderFilter
  sort: SortKey
  dir: SortDir
  limit: number
}

/** One page of GET /users. `total` is only computed when requested (with_total=1). */
export interface UserPage {
  users: User[]
  nextCursor: string | null
  total: number | null
}
