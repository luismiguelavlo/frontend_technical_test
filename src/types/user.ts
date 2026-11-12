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
