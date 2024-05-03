import {Database} from "@kit/supabase/database";

type Db = Database['public']['Tables'];
type Membership = Db['accounts_memberships']['Row'];
type Account = Db['accounts']['Row'];

export function AdminAccountPage(props: {
  account: Account & { memberships: Membership[] };
}) {
  const isPersonalAccount = props.account.is_personal_account;

  if (isPersonalAccount) {
    return <PersonalAccountPage account={props.account} />;
  }

  return <TeamAccountPage account={props.account} />;
}
