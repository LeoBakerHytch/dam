import { AppLayout } from '@/components/app/layouts/app-layout';
import { HeadingSmall } from '@/components/text/heading-small';

import { SettingsLayout } from '../layouts/settings-layout';
import { AppearanceToggleTab } from './components/appearance-toggle-tab';

export function SettingsAppearancePage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Appearance settings', path: '/settings/appearance' }]}>
      <title>Appearance settings</title>
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Appearance settings"
            description="Update your account’s appearance settings"
          />
          <AppearanceToggleTab />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
