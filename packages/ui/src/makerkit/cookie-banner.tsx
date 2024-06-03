'use client';

import { useCallback, useMemo, useState } from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import { Button } from '../shadcn/button';
import { Heading } from '../shadcn/heading';
import { Trans } from './trans';

// configure this as you wish
const COOKIE_CONSENT_STATUS = 'cookie_consent_status';

enum ConsentStatus {
  Accepted = 'accepted',
  Rejected = 'rejected',
  Unknown = 'unknown',
}

export function CookieBanner() {
  const { status, accept, reject } = useCookieConsent();

  if (!isBrowser()) {
    return null;
  }

  if (status !== ConsentStatus.Unknown) {
    return null;
  }

  return (
    <DialogPrimitive.Root open modal={false}>
      <DialogPrimitive.Content
        className={`dark:shadow-primary-500/40 fixed bottom-0 w-full max-w-lg border bg-background p-6 shadow-2xl delay-1000 duration-1000 animate-in fade-in zoom-in-95 slide-in-from-bottom-16 fill-mode-both lg:bottom-[2rem] lg:left-[2rem] lg:h-48 lg:rounded-lg`}
      >
        <div className={'flex flex-col space-y-4'}>
          <div>
            <Heading level={3}>
              <Trans i18nKey={'cookieBanner.title'} />
            </Heading>
          </div>

          <div className={'text-gray-500 dark:text-gray-400'}>
            <Trans i18nKey={'cookieBanner.description'} />
          </div>

          <div className={'flex justify-end space-x-2.5'}>
            <Button variant={'ghost'} onClick={reject}>
              <Trans i18nKey={'cookieBanner.reject'} />
            </Button>

            <Button autoFocus onClick={accept}>
              <Trans i18nKey={'cookieBanner.accept'} />
            </Button>
          </div>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  );
}

export function useCookieConsent() {
  const initialState = getStatusFromLocalStorage();
  const [status, setStatus] = useState<ConsentStatus>(initialState);

  const accept = useCallback(() => {
    const status = ConsentStatus.Accepted;

    setStatus(status);
    storeStatusInLocalStorage(status);
  }, []);

  const reject = useCallback(() => {
    const status = ConsentStatus.Rejected;

    setStatus(status);
    storeStatusInLocalStorage(status);
  }, []);

  const clear = useCallback(() => {
    const status = ConsentStatus.Unknown;

    setStatus(status);
    storeStatusInLocalStorage(status);
  }, []);

  return useMemo(() => {
    return {
      clear,
      status,
      accept,
      reject,
    };
  }, [clear, status, accept, reject]);
}

function storeStatusInLocalStorage(status: ConsentStatus) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(COOKIE_CONSENT_STATUS, status);
}

function getStatusFromLocalStorage() {
  if (!isBrowser()) {
    return ConsentStatus.Unknown;
  }

  const status = localStorage.getItem(COOKIE_CONSENT_STATUS) as ConsentStatus;

  return status ?? ConsentStatus.Unknown;
}

function isBrowser() {
  return typeof window !== 'undefined';
}
