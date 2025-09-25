import { AppLayout } from '@/components/app/layouts/app-layout';

export function SoundLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Sound library', path: '/sound-library' }]}>
      <title>Sound library</title>
    </AppLayout>
  );
}
