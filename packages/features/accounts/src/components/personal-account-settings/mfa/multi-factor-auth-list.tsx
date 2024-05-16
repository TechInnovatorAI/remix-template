'use client';

import { useCallback, useState } from 'react';

import type { Factor } from '@supabase/supabase-js';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import useFetchAuthFactors from '@kit/supabase/hooks/use-fetch-mfa-factors';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useFactorsMutationKey } from '@kit/supabase/hooks/use-user-factors-mutation-key';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@kit/ui/alert-dialog';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { If } from '@kit/ui/if';
import { Spinner } from '@kit/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@kit/ui/tooltip';
import { Trans } from '@kit/ui/trans';

import { MultiFactorAuthSetupDialog } from './multi-factor-auth-setup-dialog';

const MAX_FACTOR_COUNT = 10;

export function MultiFactorAuthFactorsList() {
  const { data: factors, isLoading, isError } = useFetchAuthFactors();
  const [unEnrolling, setUnenrolling] = useState<string>();

  if (isLoading) {
    return (
      <div className={'flex items-center space-x-4'}>
        <Spinner />

        <div>
          <Trans i18nKey={'account:loadingFactors'} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Alert variant={'destructive'}>
          <ExclamationTriangleIcon className={'h-4'} />

          <AlertTitle>
            <Trans i18nKey={'account:factorsListError'} />
          </AlertTitle>

          <AlertDescription>
            <Trans i18nKey={'account:factorsListErrorDescription'} />
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const allFactors = factors?.all ?? [];

  if (!allFactors.length) {
    return (
      <div className={'flex flex-col space-y-4'}>
        <Alert>
          <ShieldCheck className={'h-4'} />

          <AlertTitle>
            <Trans i18nKey={'account:multiFactorAuthHeading'} />
          </AlertTitle>

          <AlertDescription>
            <Trans i18nKey={'account:multiFactorAuthDescription'} />
          </AlertDescription>
        </Alert>

        <div>
          <MultiFactorAuthSetupDialog />
        </div>
      </div>
    );
  }

  const canAddNewFactors = allFactors.length < MAX_FACTOR_COUNT;

  return (
    <div className={'flex flex-col space-y-4'}>
      <FactorsTable factors={allFactors} setUnenrolling={setUnenrolling} />

      <If condition={canAddNewFactors}>
        <div>
          <MultiFactorAuthSetupDialog />
        </div>
      </If>

      <If condition={unEnrolling}>
        {(factorId) => (
          <ConfirmUnenrollFactorModal
            factorId={factorId}
            setIsModalOpen={() => setUnenrolling(undefined)}
          />
        )}
      </If>
    </div>
  );
}

function ConfirmUnenrollFactorModal(
  props: React.PropsWithChildren<{
    factorId: string;
    setIsModalOpen: (isOpen: boolean) => void;
  }>,
) {
  const { t } = useTranslation();
  const unEnroll = useUnenrollFactor();

  const onUnenrollRequested = useCallback(
    (factorId: string) => {
      if (unEnroll.isPending) return;

      const promise = unEnroll.mutateAsync(factorId).then(() => {
        props.setIsModalOpen(false);
      });

      toast.promise(promise, {
        loading: t(`account:unenrollingFactor`),
        success: t(`account:unenrollFactorSuccess`),
        error: t(`account:unenrollFactorError`),
      });
    },
    [props, t, unEnroll],
  );

  return (
    <AlertDialog open={!!props.factorId} onOpenChange={props.setIsModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Trans i18nKey={'account:unenrollFactorModalHeading'} />
          </AlertDialogTitle>

          <AlertDialogDescription>
            <Trans i18nKey={'account:unenrollFactorModalDescription'} />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            <Trans i18nKey={'common:cancel'} />
          </AlertDialogCancel>

          <AlertDialogAction
            type={'button'}
            disabled={unEnroll.isPending}
            onClick={() => onUnenrollRequested(props.factorId)}
          >
            <Trans i18nKey={'account:unenrollFactorModalButtonLabel'} />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FactorsTable({
  setUnenrolling,
  factors,
}: React.PropsWithChildren<{
  setUnenrolling: (factorId: string) => void;
  factors: Factor[];
}>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Trans i18nKey={'account:factorName'} />
          </TableHead>
          <TableHead>
            <Trans i18nKey={'account:factorType'} />
          </TableHead>
          <TableHead>
            <Trans i18nKey={'account:factorStatus'} />
          </TableHead>

          <TableHead />
        </TableRow>
      </TableHeader>

      <TableBody>
        {factors.map((factor) => (
          <TableRow key={factor.id}>
            <TableCell>
              <span className={'block truncate'}>{factor.friendly_name}</span>
            </TableCell>

            <TableCell>
              <Badge variant={'info'} className={'inline-flex uppercase'}>
                {factor.factor_type}
              </Badge>
            </TableCell>

            <td>
              <Badge
                variant={'info'}
                className={'inline-flex capitalize'}
                color={factor.status === 'verified' ? 'success' : 'normal'}
              >
                {factor.status}
              </Badge>
            </td>

            <td className={'flex justify-end'}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      onClick={() => setUnenrolling(factor.id)}
                    >
                      <X className={'h-4'} />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    <Trans i18nKey={'account:unenrollTooltip'} />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function useUnenrollFactor() {
  const queryClient = useQueryClient();
  const client = useSupabase();
  const mutationKey = useFactorsMutationKey();

  const mutationFn = async (factorId: string) => {
    const { data, error } = await client.auth.mfa.unenroll({
      factorId,
    });

    if (error) {
      throw error;
    }

    return data;
  };

  return useMutation({
    mutationFn,
    mutationKey,
    onSuccess: async () => {
      return queryClient.refetchQueries({
        queryKey: mutationKey,
      });
    },
  });
}
