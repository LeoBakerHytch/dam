import { AppLayout } from '@/components/app/layouts/app-layout';
import { LibraryPlaceholder } from '@/components/ui/library-placeholder';

export function DocumentLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Document library', path: '/document-library' }]}>
      <title>Document library</title>
      <LibraryPlaceholder />
    </AppLayout>
  );
}
