import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, json, useLoaderData } from '@remix-run/react';

import { If } from '@kit/ui/if';
import {
  Page,
  PageLayoutStyle,
  PageMobileNavigation,
  PageNavigation,
} from '@kit/ui/page';

import { AppLogo } from '~/components/app-logo';
import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';
import { layoutStyleCookie } from '~/lib/cookies';
import { loadUserWorkspace } from '~/routes/home._user/_lib/load-user-workspace.server';

// home imports
import { HomeMenuNavigation } from './_components/home-menu-navigation';
import { HomeMobileNavigation } from './_components/home-mobile-navigation';
import { HomeSidebar } from './_components/home-sidebar';

export const loader = async (args: LoaderFunctionArgs) => {
  const workspace = await loadUserWorkspace(args.request);
  const cookieHeader = args.request.headers.get('Cookie');
  const cookie = await layoutStyleCookie.parse(cookieHeader);

  const style =
    typeof cookie === 'string'
      ? (cookie as PageLayoutStyle)
      : personalAccountNavigationConfig.style;

  return json({
    workspace,
    style,
  });
};

export default function UserHomeLayout() {
  const { workspace, style } = useLoaderData<typeof loader>();

  return (
    <Page style={style}>
      <PageNavigation>
        <If condition={style === 'header'}>
          <HomeMenuNavigation workspace={workspace} />
        </If>

        <If condition={style === 'sidebar'}>
          <HomeSidebar workspace={workspace} />
        </If>
      </PageNavigation>

      <PageMobileNavigation className={'flex items-center justify-between'}>
        <AppLogo />
        <HomeMobileNavigation workspace={workspace} />
      </PageMobileNavigation>

      <Outlet />
    </Page>
  );
}
