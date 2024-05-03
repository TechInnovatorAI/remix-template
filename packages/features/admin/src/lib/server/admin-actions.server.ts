'use server';

import { SupabaseClient } from '@supabase/supabase-js';

import { redirect } from '@remix-run/react';
import { z } from 'zod';

import { Database } from '@kit/supabase/database';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import {
  BanUserSchema,
  DeleteAccountSchema,
  DeleteUserSchema,
  ImpersonateUserSchema,
  ReactivateUserSchema,
} from './schema/admin-actions.schema';
import { createAdminAccountsService } from './services/admin-accounts.service';
import { createAdminAuthUserService } from './services/admin-auth-user.service';

/**
 * @name banUserAction
 * @description Ban a user from the system.
 */
export const banUserAction = async (params: {
  data: z.infer<typeof BanUserSchema>;
  client: SupabaseClient<Database>;
}) => {
  const service = getAdminAuthService(params.client);
  const userId = params.data.payload.userId;

  await service.banUser(userId);

  return {
    success: true,
  };
};

/**
 * @name reactivateUserAction
 * @description Reactivate a user in the system.
 */
export const reactivateUserAction = async ({
  data,
  client,
}: {
  data: z.infer<typeof ReactivateUserSchema>;
  client: SupabaseClient<Database>;
}) => {
  const service = getAdminAuthService(client);

  await service.reactivateUser(data.payload.userId);

  return {
    success: true,
  };
};

/**
 * @name impersonateUserAction
 * @description Impersonate a user in the system.
 */
export const impersonateUserAction = async ({
  data,
  client,
}: {
  data: z.infer<typeof ImpersonateUserSchema>;
  client: SupabaseClient<Database>;
}) => {
  const service = getAdminAuthService(client);

  return await service.impersonateUser(data.payload.userId);
};

/**
 * @name deleteUserAction
 * @description Delete a user from the system.
 */
export const deleteUserAction = async ({
  data,
  client,
}: {
  data: z.infer<typeof DeleteUserSchema>;
  client: SupabaseClient<Database>;
}) => {
  const service = getAdminAuthService(client);

  await service.deleteUser(data.payload.userId);

  return redirect('/admin/accounts');
};

/**
 * @name deleteAccountAction
 * @description Delete an account from the system.
 */
export const deleteAccountAction = async ({
  payload,
}: z.infer<typeof DeleteAccountSchema>) => {
  const service = getAdminAccountsService();

  await service.deleteAccount(payload.accountId);

  return redirect('/admin/accounts');
};

function getAdminAuthService(client: SupabaseClient<Database>) {
  const adminClient = getSupabaseServerAdminClient();

  return createAdminAuthUserService(client, adminClient);
}

function getAdminAccountsService() {
  const adminClient = getSupabaseServerAdminClient();

  return createAdminAccountsService(adminClient);
}
