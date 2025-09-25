import { NavLink, useLocation } from 'react-router';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types/NavItem';

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const location = useLocation();
  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={location.pathname.startsWith(item.to)}
              tooltip={{ children: item.title }}
            >
              <NavLink to={item.to}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
