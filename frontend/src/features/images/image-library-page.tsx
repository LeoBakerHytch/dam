import { AppLayout } from '@/components/app/layouts/app-layout';

export function ImageLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Image library', path: '/image-library' }]}>{null}</AppLayout>
  );
}
