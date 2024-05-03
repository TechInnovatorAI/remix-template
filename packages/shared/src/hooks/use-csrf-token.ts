/**
 * Get the CSRF token from the meta tag.
 * @returns The CSRF token.
 */
export function useCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');

  if (!meta) {
    return '';
  }

  return meta.getAttribute('content') ?? '';
}
