import { AppLayout } from '@/components/app/layouts/app-layout';
import { LibraryPlaceholder } from '@/components/ui/library-placeholder';

export function LogoLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Logo library', path: '/logo-library' }]}>
      <title>Logo library</title>
      <LibraryPlaceholder />
    </AppLayout>
  );
}
