import { AppLayout } from '@/components/app/layouts/app-layout';

export function LogoLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Logo library', path: '/logo-library' }]}>
      <title>Logo library</title>
    </AppLayout>
  );
}
