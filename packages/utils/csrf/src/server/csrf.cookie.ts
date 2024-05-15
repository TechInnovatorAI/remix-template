import { createCookie } from '@remix-run/node';
import process from 'node:process';

export const csrfCookie = createCookie('_csrfSecret', {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
});
