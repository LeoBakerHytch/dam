import { AppLayout } from '@/components/app/layouts/app-layout';

export function IconLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Icon library', path: '/icon-library' }]}>{null}</AppLayout>
  );
}
