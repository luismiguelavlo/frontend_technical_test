import { fullName, type Gender, type User } from '../types/user.ts'

export type GenderFilter = Gender | 'all'

/** Lowercase + strip accents, so "lucia" matches "Lucía". */
function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Matches name or email (accent-insensitive) and gender. */
export function filterUsers(users: User[], search: string, gender: GenderFilter): User[] {
  const query = normalize(search.trim())
  return users.filter(
    (u) =>
      (gender === 'all' || u.gender === gender) &&
      (!query || normalize(`${fullName(u)} ${u.email}`).includes(query)),
  )
}
