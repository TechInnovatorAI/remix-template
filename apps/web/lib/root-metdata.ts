import { Metadata } from 'next';

import appConfig from '~/config/app.config';

/**
 * @name rootMetadata
 * @description Define the root metadata for the application.
 */
export const rootMetadata: Metadata = {
  title: appConfig.name,
  description: appConfig.description,
  metadataBase: new URL(appConfig.url),
  openGraph: {
    url: appConfig.url,
    siteName: appConfig.name,
    description: appConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: appConfig.title,
    description: appConfig.description,
  },
  icons: {
    icon: '/images/favicon/favicon.ico',
    shortcut: '/shortcut-icon.png',
    apple: '/images/favicon/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
};
