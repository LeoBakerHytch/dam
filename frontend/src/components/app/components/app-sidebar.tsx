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
    to: '/',
    icon: LayoutGrid,
  },
  {
    title: 'Image library',
    to: '/image-library',
    icon: Image,
  },
  {
    title: 'Logo library',
    to: '/logo-library',
    icon: Target,
  },
  {
    title: 'Document library',
    to: '/document-library',
    icon: FileText,
  },
  {
    title: 'Sound library',
    to: '/sound-library',
    icon: AudioLines,
  },
  {
    title: 'Icon library',
    to: '/icon-library',
    icon: Atom,
  },
  {
    title: 'Template library',
    to: '/template-library',
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
