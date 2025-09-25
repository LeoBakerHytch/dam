import { mainNavItems } from '@/components/app/components/app-sidebar';
import { AppLayout } from '@/components/app/layouts/app-layout';
import { DashboardCard } from '@/features/components/dashboard-card';
import { DashboardPlaceholderCard } from '@/features/components/dashboard-placeholder-card';
import { BreadcrumbItem } from '@/types/BreadcrumbItem';
import { NavItem } from '@/types/NavItem';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/',
  },
];

export function DashboardPage() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <title>Dashboard</title>
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {mainNavItems.map((navItem: NavItem) => (
            <DashboardCard key={navItem.to} {...navItem} />
          ))}
        </div>
        <DashboardPlaceholderCard />
      </div>
    </AppLayout>
  );
}
