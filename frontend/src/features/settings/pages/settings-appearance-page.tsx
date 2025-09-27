import { AppLayout } from '@/components/app/layouts/app-layout';
import { HeadingSmall } from '@/components/text/heading-small';
import { AppearanceToggleTab } from '@/features/settings/components/appearance/appearance-toggle-tab';

import { SettingsLayout } from '../settings-layout';

export function SettingsAppearancePage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Appearance settings', path: '/settings/appearance' }]}>
      <title>Appearance settings</title>
      <SettingsLayout>
        <HeadingSmall
          title="Appearance settings"
          description="Update your account’s appearance settings"
        />
        <AppearanceToggleTab />
      </SettingsLayout>
    </AppLayout>
  );
}
