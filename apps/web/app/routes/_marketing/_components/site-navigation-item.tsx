import { NavLink } from '@remix-run/react';

import { NavigationMenuItem } from '@kit/ui/navigation-menu';
import { cn } from '@kit/ui/utils';

const getClassName = (isActive: boolean) => {
  return cn(
    `text-sm font-medium transition-colors duration-300 inline-flex w-max`,
    {
      'dark:text-gray-300 dark:hover:text-white': !isActive,
      'dark:text-white text-current': isActive,
    },
  );
};

export function SiteNavigationItem({
  path,
  children,
}: React.PropsWithChildren<{
  path: string;
}>) {
  return (
    <NavigationMenuItem key={path}>
      <NavLink
        className={({ isActive }) => {
          return getClassName(isActive);
        }}
        to={path}
      >
        {children}
      </NavLink>
    </NavigationMenuItem>
  );
}
