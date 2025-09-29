import { AppLayout } from '@/components/app/layouts/app-layout';
import { LibraryPlaceholder } from '@/components/ui/library-placeholder';

export function IconLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Icon library', path: '/icon-library' }]}>
      <title>Icon library</title>
      <LibraryPlaceholder />
    </AppLayout>
  );
}
