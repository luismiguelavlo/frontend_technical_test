import { useSyncExternalStore } from 'react'
import { parseRoute } from '../utils/routes.ts'

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const getHash = () => window.location.hash

/** Current route, re-rendering on every hash change (back/forward included). */
export function useHashRoute() {
  return parseRoute(useSyncExternalStore(subscribe, getHash))
}
