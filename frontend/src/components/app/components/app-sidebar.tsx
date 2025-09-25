import {
  Atom,
  AudioLines,
  FileText,
  Image,
  LayoutGrid,
  LayoutTemplate,
  Target,
} from 'lucide-react';
import { NavLink } from 'react-router';

import { AppLogo } from '@/components/app/components/app-logo';
import { NavFooter } from '@/components/app/nav/nav-footer';
import { NavMain } from '@/components/app/nav/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types/NavItem';

export const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutGrid,
    root: true,
  },
  {
    title: 'Image library',
    path: '/image-library',
    icon: Image,
  },
  {
    title: 'Logo library',
    path: '/logo-library',
    icon: Target,
  },
  {
    title: 'Document library',
    path: '/document-library',
    icon: FileText,
  },
  {
    title: 'Sound library',
    path: '/sound-library',
    icon: AudioLines,
  },
  {
    title: 'Icon library',
    path: '/icon-library',
    icon: Atom,
  },
  {
    title: 'Template library',
    path: '/template-library',
    icon: LayoutTemplate,
  },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
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
      </SidebarFooter>
    </Sidebar>
  );
}
