'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../shadcn/alert-dialog';
import { Button } from '../shadcn/button';
import { Trans } from './trans';

/**
 * Current version of the app that is running
 */
let version: string | null = null;

/**
 * Default interval time in seconds to check for new version
 * By default, it is set to 120 seconds
 */
const DEFAULT_REFETCH_INTERVAL = 120;

/**
 * Default interval time in seconds to check for new version
 */
const VERSION_UPDATER_REFETCH_INTERVAL_SECONDS = import.meta.env
  .VERSION_UDPATER_REFETCH_INTERVAL_SECONDS;

export function VersionUpdater(props: { intervalTimeInSecond?: number }) {
  const { data } = useVersionUpdater(props);
  const [dismissed, setDismissed] = useState(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  useEffect(() => {
    setShowDialog(data?.didChange ?? false);
  }, [data?.didChange]);

  if (!data?.didChange || dismissed) {
    return null;
  }

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Trans i18nKey="common:newVersionAvailable" />
          </AlertDialogTitle>

          <AlertDialogDescription>
            <Trans i18nKey="common:newVersionAvailableDescription" />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button
            variant={'outline'}
            onClick={() => {
              setShowDialog(false);
              setDismissed(true);
            }}
          >
            <Trans i18nKey="common:back" />
          </Button>

          <Button onClick={() => window.location.reload()}>
            <Trans i18nKey="common:newVersionSubmitButton" />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function useVersionUpdater(props: { intervalTimeInSecond?: number } = {}) {
  const interval = VERSION_UPDATER_REFETCH_INTERVAL_SECONDS
    ? Number(VERSION_UPDATER_REFETCH_INTERVAL_SECONDS)
    : DEFAULT_REFETCH_INTERVAL;

  const refetchInterval = (props.intervalTimeInSecond ?? interval) * 1000;

  // start fetching new version after half of the interval time
  const staleTime = refetchInterval / 2;

  return useQuery({
    queryKey: ['version-updater'],
    staleTime,
    gcTime: refetchInterval,
    refetchIntervalInBackground: true,
    refetchInterval,
    initialData: null,
    queryFn: async () => {
      const response = await fetch('/version');
      const currentVersion = await response.text();
      const oldVersion = version;

      version = currentVersion;

      const didChange = oldVersion !== null && currentVersion !== oldVersion;

      return {
        currentVersion,
        oldVersion,
        didChange,
      };
    },
  });
}
