import { createCookie } from '@remix-run/node';

export const csrfCookie = createCookie('_csrfSecret', {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
});
