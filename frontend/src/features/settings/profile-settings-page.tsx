import { AppLayout } from '@/components/app/layouts/app-layout';
import { HeadingSmall } from '@/components/text/heading-small';
import { useUser } from '@/context/user-provider';
import { SetAvatarForm } from '@/features/settings/profile/set-avatar-form';
import { UpdateProfileForm } from '@/features/settings/profile/update-profile-form';
import { SettingsLayout } from '@/features/settings/settings-layout';

export function ProfileSettingsPage() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <AppLayout breadcrumbs={[{ title: 'Profile settings', path: '/settings/profile' }]}>
      <title>Profile settings</title>
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Profile information" description="Update your name and avatar" />
          <SetAvatarForm />
          <UpdateProfileForm />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
