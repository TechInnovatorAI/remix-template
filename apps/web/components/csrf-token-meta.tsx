import { headers } from 'next/headers';

/**
 * @description This component is used to render the CSRF token as a meta tag.
 * this tag can be retrieved for use in forms that require CSRF protection.
 * @constructor
 */
export function CsrfTokenMeta() {
  const csrf = headers().get('x-csrf-token') ?? '';

  return <meta content={csrf} name="csrf-token" />;
}
