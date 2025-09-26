import { AppLayout } from '@/components/app/layouts/app-layout';

import { ImageGallery } from './components/image-gallery';

export function ImageLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Image library', path: '/image-library' }]}>
      <title>Image library</title>
      <div className="h-full p-6">
        <ImageGallery />
      </div>
    </AppLayout>
  );
}
