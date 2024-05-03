import { SupabaseClient } from '@supabase/supabase-js';

import { redirect } from '@remix-run/react';
import { z } from 'zod';

import { Database } from '@kit/supabase/database';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import {
  DeleteInvitationSchema,
  InviteMembersSchema,
  RenewInvitationSchema,
  UpdateInvitationSchema,
} from '../../schema';
import { AcceptInvitationSchema } from '../../schema/accept-invitation.schema';
import { createAccountInvitationsService } from '../services/account-invitations.service';
import { createAccountPerSeatBillingService } from '../services/account-per-seat-billing.service';

/**
 * @name createInvitationsAction
 * @description Creates invitations for inviting members.
 */
export const createInvitationsAction = async (params: {
  client: SupabaseClient<Database>;
  data: z.infer<typeof InviteMembersSchema>;
}) => {
  const data = InviteMembersSchema.parse(params.data);

  // Create the service
  const service = createAccountInvitationsService(params.client);

  // send invitations
  await service.sendInvitations(data.payload);

  return {
    success: true,
  };
};

/**
 * @name deleteInvitationAction
 * @description Deletes an invitation specified by the invitation ID.
 */
export const deleteInvitationAction = async (params: {
  client: SupabaseClient<Database>;
  data: z.infer<typeof DeleteInvitationSchema>;
}) => {
  const service = createAccountInvitationsService(params.client);

  const data = DeleteInvitationSchema.parse(params.data);

  // Delete the invitation
  await service.deleteInvitation(data);

  return {
    success: true,
  };
};

/**
 * @name updateInvitationAction
 * @description Updates an invitation.
 */
export const updateInvitationAction = async (params: {
  client: SupabaseClient<Database>;
  data: z.infer<typeof UpdateInvitationSchema>;
}) => {
  const invitation = UpdateInvitationSchema.parse(params.data);

  const service = createAccountInvitationsService(params.client);

  await service.updateInvitation(invitation);

  return {
    success: true,
  };
};

/**
 * @name acceptInvitationAction
 * @description Accepts an invitation to join a team.
 */
export const acceptInvitationAction = async (params: {
  client: SupabaseClient<Database>;
  data: FormData;
}) => {
  const { inviteToken, nextPath } = AcceptInvitationSchema.parse(
    Object.fromEntries(params.data.entries()),
  );

  const client = params.client;

  // create the services
  const perSeatBillingService = createAccountPerSeatBillingService(client);
  const service = createAccountInvitationsService(client);

  const auth = await requireUser(client);

  if (!auth.data) {
    return redirect(auth.redirectTo);
  }

  // Accept the invitation
  const accountId = await service.acceptInvitationToTeam(
    getSupabaseServerAdminClient(),
    {
      inviteToken,
      userId: auth.data.id,
    },
  );

  // If the account ID is not present, throw an error
  if (!accountId) {
    throw new Error('Failed to accept invitation');
  }

  // Increase the seats for the account
  await perSeatBillingService.increaseSeats(accountId);

  return redirect(nextPath);
};

/**
 * @name renewInvitationAction
 * @description Renews an invitation.
 */
export const renewInvitationAction = async (params: {
  client: SupabaseClient<Database>;
  data: z.infer<typeof RenewInvitationSchema>;
}) => {
  const { payload } = RenewInvitationSchema.parse(params);

  const service = createAccountInvitationsService(params.client);

  // Renew the invitation
  await service.renewInvitation(payload.invitationId);

  return {
    success: true,
  };
};
