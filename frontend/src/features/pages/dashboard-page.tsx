import { Atom, AudioLines, FileText, Image, LayoutTemplate, Target } from 'lucide-react';

import { AppLayout } from '@/components/app/layouts/app-layout';
import { DashboardCard } from '@/features/components/dashboard-card';
import { DashboardPlaceholderCard } from '@/features/components/dashboard-placeholder-card';
import { BreadcrumbItem } from '@/types/BreadcrumbItem';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/',
  },
];

// TODO: Ideally the dashboards would not be defined redundantly both here and in the sidebar nav

export function DashboardPage() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <title>Dashboard</title>
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <DashboardCard
            title="Image library"
            icon={<Image className="size-full" />}
            to="/image-library"
          />
          <DashboardCard
            title="Logo library"
            icon={<Target className="size-full" />}
            to="/logo-library"
          />
          <DashboardCard
            title="Document library"
            icon={<FileText className="size-full" />}
            to="/document-library"
          />
          <DashboardCard
            title="Sound library"
            icon={<AudioLines className="size-full" />}
            to="/sound-library"
          />
          <DashboardCard
            title="Icon library"
            icon={<Atom className="size-full" />}
            to="/icon-library"
          />
          <DashboardCard
            title="Template library"
            icon={<LayoutTemplate className="size-full" />}
            to="/template-library"
          />
        </div>
        <DashboardPlaceholderCard />
      </div>
    </AppLayout>
  );
}
