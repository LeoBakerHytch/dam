import { AppLayout } from '@/components/app/layouts/app-layout';
import { BreadcrumbItem } from '@/types/BreadcrumbItem';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    path: '/',
  },
];
export function App() {
  return <AppLayout breadcrumbs={breadcrumbs}></AppLayout>;
}
