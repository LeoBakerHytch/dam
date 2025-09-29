import { AppLayout } from '@/components/app/layouts/app-layout';
import { LibraryPlaceholder } from '@/components/ui/library-placeholder';

export function TemplateLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Template library', path: '/template-library' }]}>
      <title>Template library</title>
      <LibraryPlaceholder />
    </AppLayout>
  );
}
