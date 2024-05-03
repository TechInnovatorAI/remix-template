import { createCookie } from '@remix-run/node';

export const languageCookie = createCookie('lang');

export const themeCookie = createCookie('theme');

export const layoutStyleCookie = createCookie('layout-style');