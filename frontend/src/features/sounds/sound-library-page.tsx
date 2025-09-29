import { AppLayout } from '@/components/app/layouts/app-layout';
import { LibraryPlaceholder } from '@/components/ui/library-placeholder';

export function SoundLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Sound library', path: '/sound-library' }]}>
      <title>Sound library</title>
      <LibraryPlaceholder />
    </AppLayout>
  );
}
