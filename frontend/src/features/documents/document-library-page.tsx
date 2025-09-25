import { AppLayout } from '@/components/app/layouts/app-layout';

export function DocumentLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Document library', path: '/document-library' }]}>
      <title>Document library</title>
    </AppLayout>
  );
}
