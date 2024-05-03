import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

export function createAdminAuthUserService(
  client: SupabaseClient<Database>,
  adminClient: SupabaseClient<Database>,
) {
  return new AdminAuthUserService(client, adminClient);
}

/**
 * @name AdminAuthUserService
 * @description Service for performing admin actions on users in the system.
 * This service only interacts with the Supabase Auth Admin API.
 */
class AdminAuthUserService {
  constructor(
    private readonly client: SupabaseClient<Database>,
    private readonly adminClient: SupabaseClient<Database>,
  ) {}

  /**
   * Delete a user by deleting the user record and auth record.
   * @param userId
   */
  async deleteUser(userId: string) {
    await this.assertUserIsNotCurrentSuperAdmin(userId);

    const deleteUserResponse =
      await this.adminClient.auth.admin.deleteUser(userId);

    if (deleteUserResponse.error) {
      throw new Error(`Error deleting user record or auth record.`);
    }
  }

  /**
   * Ban a user by setting the ban duration to `876600h` (100 years).
   * @param userId
   */
  async banUser(userId: string) {
    await this.assertUserIsNotCurrentSuperAdmin(userId);

    return this.setBanDuration(userId, `876600h`);
  }

  /**
   * Reactivate a user by setting the ban duration to `none`.
   * @param userId
   */
  async reactivateUser(userId: string) {
    await this.assertUserIsNotCurrentSuperAdmin(userId);

    return this.setBanDuration(userId, `none`);
  }

  /**
   * Impersonate a user by generating a magic link and returning the access and refresh tokens.
   * @param userId
   */
  async impersonateUser(userId: string) {
    await this.assertUserIsNotCurrentSuperAdmin(userId);

    const {
      data: { user },
      error,
    } = await this.adminClient.auth.admin.getUserById(userId);

    if (error ?? !user) {
      throw new Error(`Error fetching user`);
    }

    const email = user.email;

    if (!email) {
      throw new Error(`User has no email. Cannot impersonate`);
    }

    const { error: linkError, data } =
      await this.adminClient.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
          redirectTo: `/`,
        },
      });

    if (linkError ?? !data) {
      throw new Error(`Error generating magic link`);
    }

    const response = await fetch(data.properties?.action_link, {
      method: 'GET',
      redirect: 'manual',
    });

    const location = response.headers.get('Location');

    if (!location) {
      throw new Error(`Error generating magic link. Location header not found`);
    }

    const hash = new URL(location).hash.substring(1);
    const query = new URLSearchParams(hash);
    const accessToken = query.get('access_token');
    const refreshToken = query.get('refresh_token');

    if (!accessToken || !refreshToken) {
      throw new Error(
        `Error generating magic link. Tokens not found in URL hash.`,
      );
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Assert that the target user is not the current user.
   * @param targetUserId
   */
  private async assertUserIsNotCurrentSuperAdmin(targetUserId: string) {
    const { data: user } = await this.client.auth.getUser();
    const currentUserId = user.user?.id;

    if (!currentUserId) {
      throw new Error(`Error fetching user`);
    }

    if (currentUserId === targetUserId) {
      throw new Error(
        `You cannot perform a destructive action on your own account as a Super Admin`,
      );
    }
  }

  private async setBanDuration(userId: string, banDuration: string) {
    await this.adminClient.auth.admin.updateUserById(userId, {
      ban_duration: banDuration,
    });
  }
}
