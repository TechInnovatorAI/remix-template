'use client';

export function AuthenticityToken() {
  const token = useCsrfToken();

  return <input type="hidden" name="csrf_token" value={token} />;
}

function useCsrfToken() {
  if (typeof window === 'undefined') return '';

  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content') ?? ''
  );
}
