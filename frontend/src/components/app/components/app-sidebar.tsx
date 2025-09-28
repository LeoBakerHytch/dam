import { NavLink } from 'react-router';

import { AppLogo } from '@/components/app/components/app-logo';
import { NavFooter } from '@/components/app/nav/nav-footer';
import { footerNavItems, mainNavItems } from '@/components/app/nav/nav-items';
import { NavMain } from '@/components/app/nav/nav-main';
import { NavUser } from '@/components/app/nav/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useUser } from '@/providers/user-provider';

export function AppSidebar() {
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/">
                <AppLogo />
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
