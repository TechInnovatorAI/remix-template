import { NavLink } from '@remix-run/react';

import { NavigationMenuItem } from '@kit/ui/navigation-menu';
import { cn } from '@kit/ui/utils';

const getClassName = (
  isActive: boolean,
) => {
  return cn(
    `text-sm font-medium px-2.5 py-2 border rounded-lg border-transparent transition-colors duration-100`,
    {
      'hover:border-border dark:text-gray-400 text-gray-600 hover:text-current dark:hover:text-white':
        !isActive,
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
        className={({isActive}) => {
          return getClassName(isActive);
        }}
        to={path}
      >
        {children}
      </NavLink>
    </NavigationMenuItem>
  );
}
