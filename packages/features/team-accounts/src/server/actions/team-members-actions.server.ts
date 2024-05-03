'use server';

import { SupabaseClient } from '@supabase/supabase-js';

import { z } from 'zod';

import { Database } from '@kit/supabase/database';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import { RemoveMemberSchema, TransferOwnershipConfirmationSchema } from '../../schema';
import { UpdateMemberRoleSchema } from '../../schema/update-member-role.schema';
import { createAccountMembersService } from '../services/account-members.service';

/**
 * @name removeMemberFromAccountAction
 * @description Removes a member from an account.
 */
export const removeMemberFromAccountAction = async (params: {
  client: SupabaseClient<Database>;
  data: z.infer<typeof RemoveMemberSchema>;
}) => {
  const data = RemoveMemberSchema.parse(params.data);

  const service = createAccountMembersService(params.client);

  await service.removeMemberFromAccount(data);

  return {
    success: true
  };
};

/**
 * @name updateMemberRoleAction
 * @description Updates the role of a member in an account.
 */
export const updateMemberRoleAction = async (params: {
  client: SupabaseClient<Database>;
  data: z.infer<typeof UpdateMemberRoleSchema>;
}) => {
  const client = params.client;
  const data = UpdateMemberRoleSchema.parse(params.data);

  const service = createAccountMembersService(client);
  const adminClient = getSupabaseServerAdminClient();

  // update the role of the member
  await service.updateMemberRole(data, adminClient);

  return {
    success: true
  };
};

/**
 * @name transferOwnershipAction
 * @description Transfers the ownership of an account to another member.
 */
export const transferOwnershipAction = async (params: {
  client: SupabaseClient<Database>;
  data: z.infer<typeof TransferOwnershipConfirmationSchema>;
}) => {
  const client = params.client;
  const data = TransferOwnershipConfirmationSchema.parse(params.data);

  // assert that the user is the owner of the account
  const { data: isOwner, error } = await client.rpc('is_account_owner', {
    account_id: data.payload.accountId,
  });

  if (error ?? !isOwner) {
    throw new Error(
      `You must be the owner of the account to transfer ownership`,
    );
  }

  const service = createAccountMembersService(client);

  // at this point, the user is authenticated and is the owner of the account
  // so we proceed with the transfer of ownership with admin privileges
  const adminClient = getSupabaseServerAdminClient();

  // transfer the ownership of the account
  await service.transferOwnership(data, adminClient);

  return {
    success: true,
  };
};
