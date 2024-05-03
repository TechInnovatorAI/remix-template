import { z } from 'zod';

type LanguagePriority = 'user' | 'application';

const FeatureFlagsSchema = z.object({
  enableThemeToggle: z.boolean({
    description: 'Enable theme toggle in the user interface.',
    required_error: 'Provide the variable REMIX_PUBLIC_ENABLE_THEME_TOGGLE',
  }),
  enableAccountDeletion: z.boolean({
    description: 'Enable personal account deletion.',
    required_error:
      'Provide the variable REMIX_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION',
  }),
  enableTeamDeletion: z.boolean({
    description: 'Enable team deletion.',
    required_error: 'Provide the variable REMIX_PUBLIC_ENABLE_TEAM_DELETION',
  }),
  enableTeamAccounts: z.boolean({
    description: 'Enable team accounts.',
    required_error:
      'Provide the variable REMIX_PUBLIC_ENABLE_TEAM_ACCOUNTS_DELETION',
  }),
  enableTeamCreation: z.boolean({
    description: 'Enable team creation.',
    required_error:
      'Provide the variable REMIX_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION',
  }),
  enablePersonalAccountBilling: z.boolean({
    description: 'Enable personal account billing.',
    required_error:
      'Provide the variable REMIX_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING',
  }),
  enableTeamAccountBilling: z.boolean({
    description: 'Enable team account billing.',
    required_error:
      'Provide the variable REMIX_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING',
  }),
  languagePriority: z
    .enum(['user', 'application'], {
      required_error: 'Provide the variable REMIX_PUBLIC_LANGUAGE_PRIORITY',
      description: `If set to user, use the user's preferred language. If set to application, use the application's default language.`,
    })
    .default('application'),
  enableNotifications: z.boolean({
    description: 'Enable notifications functionality',
    required_error: 'Provide the variable REMIX_PUBLIC_ENABLE_NOTIFICATIONS',
  }),
  realtimeNotifications: z.boolean({
    description: 'Enable realtime for the notifications functionality',
    required_error: 'Provide the variable REMIX_PUBLIC_REALTIME_NOTIFICATIONS',
  }),
});

const featuresFlagConfig = FeatureFlagsSchema.parse({
  enableThemeToggle: getBoolean(
    process.env.REMIX_PUBLIC_ENABLE_THEME_TOGGLE,
    true,
  ),
  enableAccountDeletion: getBoolean(
    process.env.REMIX_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION,
    false,
  ),
  enableTeamDeletion: getBoolean(
    process.env.REMIX_PUBLIC_ENABLE_TEAM_ACCOUNTS_DELETION,
    false,
  ),
  enableTeamAccounts: getBoolean(
    process.env.REMIX_PUBLIC_ENABLE_TEAM_ACCOUNTS,
    true,
  ),
  enableTeamCreation: getBoolean(
    process.env.REMIX_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION,
    true,
  ),
  enablePersonalAccountBilling: getBoolean(
    process.env.REMIX_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING,
    false,
  ),
  enableTeamAccountBilling: getBoolean(
    process.env.REMIX_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING,
    false,
  ),
  languagePriority: process.env
    .REMIX_PUBLIC_LANGUAGE_PRIORITY as LanguagePriority,
  enableNotifications: getBoolean(
    process.env.REMIX_PUBLIC_ENABLE_NOTIFICATIONS,
    true,
  ),
  realtimeNotifications: getBoolean(
    process.env.REMIX_PUBLIC_REALTIME_NOTIFICATIONS,
    false,
  ),
} satisfies z.infer<typeof FeatureFlagsSchema>);

export default featuresFlagConfig;

function getBoolean(value: unknown, defaultValue: boolean) {
  if (typeof value === 'string') {
    return value === 'true';
  }

  return defaultValue;
}
