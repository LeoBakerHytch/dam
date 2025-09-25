import { AppLayout } from '@/components/app/layouts/app-layout';

export function TemplateLibraryPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Template library', path: '/template-library' }]}>
      <title>Template library</title>
    </AppLayout>
  );
}
