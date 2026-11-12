/**
 * Hash-based routes (`#/`, `#/users/12`): no router dependency and works on any
 * static host without rewrite rules.
 */
export type Route = { name: 'users' } | { name: 'userDetail'; id: number }

export const paths = {
  users: () => '#/',
  userDetail: (id: number) => `#/users/${id}`,
}

/** `#/users/12` → { name: 'userDetail', id: 12 }. Unknown paths fall back to the list. */
export function parseRoute(hash: string): Route {
  const detail = /^#\/users\/(\d+)\/?$/.exec(hash)
  const id = detail ? Number(detail[1]) : 0
  return id > 0 ? { name: 'userDetail', id } : { name: 'users' }
}

export function navigate(href: string) {
  window.location.hash = href
}
