import { AppLayout } from '@/components/app/layouts/app-layout';
import { ImageUploadZone } from '@/features/images/components/image-upload-zone';

export function ImageLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Image library', path: '/image-library' }]}>
      <title>Image library</title>
      <div className="h-full p-6">
        <ImageUploadZone />
      </div>
    </AppLayout>
  );
}
