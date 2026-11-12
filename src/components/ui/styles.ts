const fieldBase = 'w-full text-on-surface focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'

/** Filled look (toolbar search/filters). */
export function filledFieldClass(error?: string) {
  return `${fieldBase} rounded bg-surface-container-low shadow-inner placeholder:text-outline focus:bg-surface-container-lowest focus-visible:ring-2 ${
    error ? 'ring-1 ring-error focus-visible:ring-error/50' : 'focus-visible:ring-primary/40'
  }`
}

/** Outlined look (form fields). */
export function outlinedFieldClass(error?: string) {
  return `${fieldBase} rounded-lg border bg-surface-container-lowest py-2.5 text-body-md placeholder:text-outline transition-all focus:ring-2 disabled:bg-surface-container-low ${
    error ? 'border-error focus:border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-primary/20'
  }`
}
