import { AppLayout } from '@/components/app/layouts/app-layout';
import { SettingsLayout } from '@/features/settings/layouts/settings-layout';

export function SettingsPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Settings', path: '/settings' }]}>
      <SettingsLayout>{null}</SettingsLayout>
    </AppLayout>
  );
}
