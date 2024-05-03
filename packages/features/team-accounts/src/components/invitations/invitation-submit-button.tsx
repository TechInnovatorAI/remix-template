'use client';

import { Button } from '@kit/ui/button';
import { Trans } from '@kit/ui/trans';

export function InvitationSubmitButton(props: {
  accountName: string;
  email: string;
  pending: boolean;
}) {
  return (
    <Button type={'submit'} className={'w-full'} disabled={props.pending}>
      <Trans
        i18nKey={props.pending ? 'teams:joiningTeam' : 'teams:continueAs'}
        values={{
          accountName: props.accountName,
          email: props.email,
        }}
      />
    </Button>
  );
}
