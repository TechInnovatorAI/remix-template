import { Link } from '@remix-run/react';
import { Menu } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';

export function AdminMobileNavigation() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Menu className={'h-8 w-8'} />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to={'/admin'}>Home</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link to={'/admin/accounts'}>Accounts</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
