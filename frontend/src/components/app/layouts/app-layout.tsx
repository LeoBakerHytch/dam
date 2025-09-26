import { type PropsWithChildren } from 'react';

import { AppHeader } from '@/components/app/components/app-header';
import { AppSidebar } from '@/components/app/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { type BreadcrumbItem } from '@/types/BreadcrumbItem';

export function AppLayout({
  children,
  breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <AppHeader breadcrumbs={breadcrumbs} />
        {children}
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
