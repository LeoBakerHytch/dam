import { AppLayout } from '@/components/app/layouts/app-layout';
import { HeadingSmall } from '@/components/text/heading-small';
import { SetAvatarForm } from '@/features/settings/components/profile/set-avatar-form';
import { UpdateProfileForm } from '@/features/settings/components/profile/update-profile-form';
import { SettingsLayout } from '@/features/settings/settings-layout';
import { useCurrentUser } from '@/hooks/use-current-user';

export function SettingsProfilePage() {
  const { user } = useCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <AppLayout breadcrumbs={[{ title: 'Profile settings', path: '/settings/profile' }]}>
      <title>Profile settings</title>
      <SettingsLayout>
        <HeadingSmall title="Profile information" description="Update your name and avatar" />
        <SetAvatarForm />
        <UpdateProfileForm />
      </SettingsLayout>
    </AppLayout>
  );
}
