import { LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router';

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/features/user/components/user-info';
import { type User } from '@/graphql/user';
import { useAuth } from '@/providers/auth-provider';

export function UserMenuContent({ user }: { user: User }) {
  const { logOut } = useAuth();

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link className="block w-full" to="/settings">
            <Settings className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <button className="block w-full" onClick={logOut} data-test="logout-button">
          <LogOut className="mr-2" />
          Log out
        </button>
      </DropdownMenuItem>
    </>
  );
}
