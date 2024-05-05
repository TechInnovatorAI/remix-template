import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, json, useLoaderData } from '@remix-run/react';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { If } from '@kit/ui/if';
import {
  Page,
  PageLayoutStyle,
  PageMobileNavigation,
  PageNavigation,
} from '@kit/ui/page';

import { AppLogo } from '~/components/app-logo';
import { getTeamAccountSidebarConfig } from '~/config/team-account-navigation.config';
import { layoutStyleCookie } from '~/lib/cookies';

import { TeamAccountLayoutMobileNavigation } from './_components/team-account-layout-mobile-navigation';
import { TeamAccountLayoutSidebar } from './_components/team-account-layout-sidebar';
import { TeamAccountNavigationMenu } from './_components/team-account-navigation-menu';
import { loadTeamWorkspace } from './_lib/team-account-workspace-loader.server';
import pathsConfig from "~/config/paths.config";

export const loader = async (args: LoaderFunctionArgs) => {
  const accountSlug = args.params.account as string;
  const client = getSupabaseServerClient(args.request);
  const style = await getLayoutStyle(args.request, accountSlug);

  const workspace = await loadTeamWorkspace({
    accountSlug,
    client,
  });

  return json({
    workspace,
    style,
  });
};

export default function TeamWorkspaceLayout() {
  const { workspace, style } = useLoaderData<typeof loader>();

  const accounts = workspace.accounts.map(({ name, slug, picture_url }) => ({
    label: name,
    value: slug,
    image: picture_url,
  }));

  return (
    <Page style={style}>
      <PageNavigation>
        <If condition={style === 'sidebar'}>
          <TeamAccountLayoutSidebar
            collapsed={false}
            account={workspace.account.slug}
            accountId={workspace.account.id}
            accounts={accounts}
            user={workspace.user}
          />
        </If>

        <If condition={style === 'header'}>
          <TeamAccountNavigationMenu workspace={workspace} />
        </If>
      </PageNavigation>

      <PageMobileNavigation className={'flex items-center justify-between'}>
        <AppLogo href={pathsConfig.app.home} />

        <div className={'flex space-x-4'}>
          <TeamAccountLayoutMobileNavigation
            accounts={accounts}
            account={workspace.account.slug}
          />
        </div>
      </PageMobileNavigation>

      <Outlet />
    </Page>
  );
}

async function getLayoutStyle(request: Request, account: string) {
  const value = await layoutStyleCookie.parse(
    request.headers.get('cookie') ?? '',
  );

  if (typeof value === 'string') {
    return value as PageLayoutStyle;
  }

  return getTeamAccountSidebarConfig(account).style;
}
