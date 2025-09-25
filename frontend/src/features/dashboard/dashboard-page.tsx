import { mainNavItems } from '@/components/app/components/app-sidebar';
import { AppLayout } from '@/components/app/layouts/app-layout';
import { DashboardCard } from '@/features/dashboard/components/dashboard-card';
import { DashboardPlaceholderCard } from '@/features/dashboard/components/dashboard-placeholder-card';

export function DashboardPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', path: '/dashboard' }]}>
      <title>Dashboard</title>
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {mainNavItems
            .filter((navItem) => !navItem.root)
            .map((navItem) => (
              <DashboardCard key={navItem.to} {...navItem} />
            ))}
        </div>
        <DashboardPlaceholderCard />
      </div>
    </AppLayout>
  );
}
